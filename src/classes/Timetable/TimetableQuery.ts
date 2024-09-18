import type { CommandInteraction } from "discord.js";
import type { Moment } from "moment-timezone";
import { DayOfCycle, DayType, OtherDay, TimeslotType } from "../../enums/calendar.js";
import { SiuYingEmbed } from "../../util/embed.js";
import { Calendar } from "./Calendar.js";
import { Schedules } from "./Schedules.js";
import type { Section } from "./Section.js";
import { Timeslot } from "./Timeslots.js";

class TimetableQueryResult<status extends "Error" | "Success"> {
    public readonly query: TimetableQuery;

    public readonly success: status extends "Success" ? true : false;

    public readonly data: status extends "Success" ? {
        dayOfCycle: DayOfCycle;
        sections: Section[];
        type: DayType.SCHOOL_DAY;
    } | {
        type: DayType.HOLIDAY;
    } : string;

    public constructor(
        query: TimetableQuery,
        success: status extends "Success" ? true : false,
        data: status extends "Success" ? {
            dayOfCycle: DayOfCycle; sections: Section[]; type: DayType.SCHOOL_DAY;
        } | {
            type: DayType.HOLIDAY;
        } : string
    ) {
        this.query = query;
        this.success = success;
        this.data = data;
    }

    public toString() {
        return this.success ? JSON.stringify(this.data) : this.data;
    }

    public toEmbed() {
        if (!this.success) {
            const { data } = this as TimetableQueryResult<"Error">;
            return new SiuYingEmbed({ user: this.query.interaction.user }).setColor("Red").setTitle("Timetable Query Failed").setDescription(data);
        }

        const { data } = this as TimetableQueryResult<"Success">;
        switch (data.type) {
            case DayType.HOLIDAY:
                return new SiuYingEmbed({ user: this.query.interaction.user }).setColor("Green").setTitle("Holiday").setDescription("No school today! Enjoy your holiday.");
            case DayType.SCHOOL_DAY: {
                const divider = "────────────────────";
                const dividerWithText = (text: string) => {
                    /* add text (shorter than divider) in the center of the divider while keeping the divider length */
                    const textLength = text.length;
                    const dividerLength = divider.length;
                    const leftSideLength = Math.floor((dividerLength - textLength) / 2);
                    const rightSideLength = dividerLength - textLength - leftSideLength;
                    return `${divider.slice(0, leftSideLength)}${text}${divider.slice(0, rightSideLength)}`;
                }

                const sectionsBlock = data.sections.map(section => {
                    if (section.timeslotType === TimeslotType.Lesson) return `<t:${section.startTime.unix()}:t> ${section.title}`;
                    return "-# " + dividerWithText("00:00 " + section.title ?? "").replace("00:00", `<t:${section.startTime.unix()}:t>`);
                }).join("\n");
                const dateBlock = `### ${data.sections[0].startTime.format("ddd, DD MMM YYYY")} (Day ${DayOfCycle[data.dayOfCycle]})`;

                return new SiuYingEmbed({ user: this.query.interaction.user })
                    .setColor("Blue")
                    .setTitle(`Timetable for ${this.query.query.cls}`)
                    .setDescription([dateBlock, sectionsBlock].join("\n"))
                    .setThumbnail("https://i.imgur.com/MteV7Gv.png")
            }

            default:
                return new SiuYingEmbed({ user: this.query.interaction.user }).setColor("Red").setTitle("Timetable Query Failed").setDescription("An unknown error occurred");
        }
    }
}

export class TimetableQuery {
    public readonly interaction: CommandInteraction;

    public readonly query: {
        cls: string;
        date: Moment;
    };

    public constructor(interaction: CommandInteraction, cls: string, date: Moment) {
        if (!cls || !date) throw new Error("Invalid query parameters");
        this.interaction = interaction;
        this.query = { cls, date };
    }

    public async execute() {
        const calendar = await Calendar.fromFile();

        const dayOfCycle = calendar.getDayOfCycle(this.query.date);
        if (!dayOfCycle) {
            return this.finish(false, "Invalid date");
        }

        if (dayOfCycle === OtherDay.HOLIDAY) {
            return this.finish(true, { type: DayType.HOLIDAY });
        }

        const schedules = await Schedules.fromFile();

        const classSchedule = schedules.getClassSchedule(this.query.cls);
        if (!classSchedule) {
            return this.finish(false, "Invalid class");
        }

        const daySchedules = classSchedule.getDaySchedules(dayOfCycle);
        if (!daySchedules?.length) {
            return this.finish(false, "No schedule for the class on this day");
        }

        const dayTimeslots = Timeslot.getAllOfDate(this.query.date);
        const sections = dayTimeslots.map((timeslot) => {
            if (timeslot.type === TimeslotType.Lesson) {
                const schedule = daySchedules[timeslot.indexOfType];
                const subjects = schedule.subject.split("/");
                const venues = schedule.venue.split("/");
                const classes = subjects.map((subject, idx) => ({ subject, venue: venues[idx] }));
                return (timeslot as Timeslot<TimeslotType.Lesson>).toSection({ classes });
            } else {
                return (timeslot as Timeslot<Exclude<TimeslotType, TimeslotType.Lesson>>).toSection({});
            }
        });

        return this.finish(true, { sections, type: DayType.SCHOOL_DAY, dayOfCycle });
    }

    private finish(success: boolean, data: string | {
        dayOfCycle: DayOfCycle;
        sections: Section[];
        type: DayType.SCHOOL_DAY;
    } | {
        type: DayType.HOLIDAY;
    }) {
        return new TimetableQueryResult(this, success, data);
    }
}
