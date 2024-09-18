import type { Moment } from "moment-timezone";
import { CONFIG } from "../../config.js";
import { CONSTS } from "../../consts.js";
import { TimeslotType } from "../../enums/calendar.js";

const { STRINGS } = CONSTS.CALENDAR;

export class Section {
    public readonly startTime: Moment;

    public readonly endTime: Moment;

    public title?: string;

    public readonly timeslotType: TimeslotType;

    public constructor(timeslotType: TimeslotType, startTime: Moment, endTime: Moment, title?: string) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.title = title;
        this.timeslotType = timeslotType;
    }
}

export class LessonSection extends Section {
    public readonly classes: Array<{
        subject: string; venue: string;
    }>

    public constructor(startTime: Moment, endTime: Moment, data: {
        classes: Array<{ subject: string; venue: string; }>,
        form: "S1" | "S2" | "S3" | "S4" | "S5" | "S6";
    }) {
        super(TimeslotType.Lesson, startTime, endTime);
        this.classes = data.classes;

        /* title format: "Subject1/SubjectB Rm101/Rm102" */
        let subjectAbbrevs = this.classes.map(cls => cls.subject);
        let venues = this.classes.map(cls => cls.venue)

        if (["S5", "S6"].includes(data.form)) {
            const electiveDeterminant = CONFIG.TIMETABLE.ELECTIVE_DETERMINANTS[data.form as "S5" | "S6"];
            for (const electiveClassId in electiveDeterminant) {
                if (subjectAbbrevs.includes(electiveDeterminant[electiveClassId as keyof typeof electiveDeterminant])) {
                    subjectAbbrevs = [electiveClassId];
                    venues = [];
                    break;
                }
            }
        }

        const subject = subjectAbbrevs.map(subj => subj in STRINGS.SUBJECT ? STRINGS.SUBJECT[subj as keyof typeof STRINGS.SUBJECT] : subj)

        this.title = `${subject.join("/")} ${venues.join("/")}`;
    }
}

export class MorningAssemblySection extends Section {
    public constructor(startTime: Moment, endTime: Moment, _data: any) {
        super(TimeslotType.MorningAssembly, startTime, endTime, "早會");
    }
}

export class RecessSection extends Section {
    public constructor(startTime: Moment, endTime: Moment, _data: any) {
        super(TimeslotType.Recess, startTime, endTime, "小息");
    }
}

export class LunchSection extends Section {
    public constructor(startTime: Moment, endTime: Moment, _data: any) {
        super(TimeslotType.Lunch, startTime, endTime, "午膳");
    }
}
