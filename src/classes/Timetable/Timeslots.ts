import type { Moment } from "moment-timezone";
import { TimeslotType } from "../../enums/calendar.js";
import { LessonSection, LunchSection, MorningAssemblySection, RecessSection } from "./Section.js";

const TimeslotsData = {
    NORMAL_TIME: [
        { startTime: "08:10", endTime: "08:40", type: "MorningAssembly" },
        { startTime: "08:40", endTime: "09:35", type: "Lesson" },
        { startTime: "09:35", endTime: "10:30", type: "Lesson" },
        { startTime: "10:30", endTime: "10:45", type: "Recess" },
        { startTime: "10:45", endTime: "11:40", type: "Lesson" },
        { startTime: "11:40", endTime: "12:35", type: "Lesson" },
        { startTime: "12:35", endTime: "13:45", type: "Lunch" },
        { startTime: "13:50", endTime: "14:45", type: "Lesson" },
        { startTime: "14:45", endTime: "15:40", type: "Lesson" },],
    SUMMER_TIME: [
        { startTime: "08:10", endTime: "08:40", type: "MorningAssembly" },
        { startTime: "08:40", endTime: "09:30", type: "Lesson" },
        { startTime: "09:30", endTime: "10:20", type: "Lesson" },
        { startTime: "10:20", endTime: "10:35", type: "Recess" },
        { startTime: "10:35", endTime: "11:25", type: "Lesson" },
        { startTime: "11:25", endTime: "12:15", type: "Lesson" },
        { startTime: "12:15", endTime: "13:20", type: "Lunch" },
        { startTime: "13:20", endTime: "14:10", type: "Lesson" },
        { startTime: "14:10", endTime: "15:00", type: "Lesson" },]
}

function getTimeslotsOfDay(date: Moment) {
    // on or before 24/9, summer time
    if (date.isBefore("2024-09-24")) return TimeslotsData.SUMMER_TIME;
    return TimeslotsData.NORMAL_TIME;
}

function getEnumForTimeslotType(type: string) {
    switch (type) {
        case "Lesson":
            return TimeslotType.Lesson;
        case "Lunch":
            return TimeslotType.Lunch;
        case "MorningAssembly":
            return TimeslotType.MorningAssembly;
        case "Recess":
            return TimeslotType.Recess;
        default:
            throw new Error("Invalid TimeslotType");
    }
}

export class Timeslot<Type extends TimeslotType> {
    public readonly startTime: Moment;

    public readonly endTime: Moment;

    public readonly type: Type;

    public readonly indexOfType: number;

    public constructor(startTime: Moment, endTime: Moment, type: Type, indexOfType: number) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.type = type;
        this.indexOfType = indexOfType;
    }

    public toSection(
        data: Type extends TimeslotType.Lesson ? {
            classes: Array<{ subject: string; venue: string; }>;
            form: string;
            userElectives: {
                "1X"?: string | null;
                "2X"?: string | null;
                "3X"?: string | null;
            } | null;
        } : Record<string, never>
    ) {
        const sectionConstructor = {
            [TimeslotType.Lesson]: LessonSection,
            [TimeslotType.MorningAssembly]: MorningAssemblySection,
            [TimeslotType.Recess]: RecessSection,
            [TimeslotType.Lunch]: LunchSection,
        }[this.type];
        if (!sectionConstructor) throw new Error("Invalid TimeslotType");

        return new sectionConstructor(this.startTime, this.endTime, data as any);
    }

    public static getAllOfDate(date: Moment) {
        const counters: Record<string, number> = {};
        const result: Array<Timeslot<any>> = [];

        for (const { startTime, endTime, type } of getTimeslotsOfDay(date)) {
            const startTimeMoment = date.clone().set({
                hour: Number.parseInt(startTime.split(":")[0], 10),
                minute: Number.parseInt(startTime.split(":")[1], 10),
            });
            const endTimeMoment = date.clone().set({
                hour: Number.parseInt(endTime.split(":")[0], 10),
                minute: Number.parseInt(endTime.split(":")[1], 10),
            });

            if (!(type in counters)) counters[type] = 0;
            result.push(new Timeslot(startTimeMoment, endTimeMoment, getEnumForTimeslotType(type), counters[type]));
            counters[type]++;
        }

        return result;
    }
}
