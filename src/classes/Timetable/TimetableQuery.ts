import { EmbedBuilder } from "discord.js";
import type { Moment } from "moment";
import { DayType, OtherDay, TimeslotType } from "../../enums/calendar.js";
import { Calendar } from "./Calendar.js";
import { Schedules } from "./Schedules.js";
import type { Section } from "./Section.js";
import { Timeslot } from "./Timeslots.js";

class TimetableQueryResult<status extends "Error" | "Success"> {
    public readonly success: status extends "Success" ? true : false;

    public readonly data: status extends "Success" ? {
        sections: Section[];
        type: DayType.SCHOOL_DAY;
    } | {
        type: DayType.HOLIDAY;
    } : string;

    public constructor(success: false, data: string)
    public constructor(success: true, data: {
        sections: Section[];
        type: DayType.SCHOOL_DAY;
    } | {
        type: DayType.HOLIDAY;
    })
    public constructor(success: status extends "Success" ? true : false, data: any) {
        this.success = success;
        this.data = data;
    }

    public toString() {
        return this.success ? JSON.stringify(this.data) : this.data;
    }

    public toEmbed() {
        if (!this.success) {
            const { data } = this as TimetableQueryResult<"Error">;
            return new EmbedBuilder().setTitle("Timetable Query Failed").setDescription(data);
        }

        const { data } = this as TimetableQueryResult<"Success">;
        switch (data.type) {
            case DayType.HOLIDAY:
                return new EmbedBuilder().setTitle("Holiday").setDescription("No school today! Enjoy your holiday.");
            case DayType.SCHOOL_DAY:
                return new EmbedBuilder().setTitle("Timetable").setDescription(data.sections.map(section => {
                    return `${section.title} (${section.startTime.format("HH:mm")} - ${section.endTime.format("HH:mm")})`;
                }).join("\n"));
            default:
                return new EmbedBuilder().setTitle("Timetable Query Failed").setDescription("An unknown error occurred");
        }
    }
}

export class TimetableQuery {
    public readonly query: {
        cls: string;
        date: Moment;
    };

    public constructor(cls: string, date: Moment) {
        if (!cls || !date) throw new Error("Invalid query parameters");
        this.query = { cls, date };
    }

    public async execute() {
        const calendar = await Calendar.fromFile();

        const dayOfCycle = calendar.getDayOfCycle(this.query.date);
        if (!dayOfCycle) {
            return new TimetableQueryResult(false, "Invalid date");
        }

        if (dayOfCycle === OtherDay.HOLIDAY) {
            return new TimetableQueryResult(true, { type: DayType.HOLIDAY });
        }

        const schedules = await Schedules.fromFile();

        const classSchedule = schedules.getClassSchedule(this.query.cls);
        if (!classSchedule) {
            return new TimetableQueryResult(false, "Invalid class");
        }

        const daySchedules = classSchedule.getDaySchedules(dayOfCycle);
        if (!daySchedules?.length) {
            return new TimetableQueryResult(false, "No schedule for the class on this day");
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

        return new TimetableQueryResult(true, { sections, type: DayType.SCHOOL_DAY });
    }
}
