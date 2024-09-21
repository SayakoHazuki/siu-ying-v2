import type { Moment } from "moment-timezone";
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
        userElectives: { "1X"?: string; "2X"?: string; "3X"?: string; };
    }) {
        super(TimeslotType.Lesson, startTime, endTime);
        this.classes = data.classes;

        /* title format: "Subject1/SubjectB Rm101/Rm102" */
        const subjectAbbrevs = this.classes.map(cls => cls.subject);
        const venues = this.classes.map(cls => cls.venue)

        if (/^\[(?<temp1>[1-3]X)]/.test(subjectAbbrevs[0])) {
            const electiveGroup = (/^\[(?<temp1>[1-3]X)]/.exec(subjectAbbrevs[0]))?.groups?.temp1 as "1X" | "2X" | "3X";

            const userElective = data.userElectives[electiveGroup] ? (
                STRINGS.SUBJECT[data.userElectives[electiveGroup] as keyof typeof STRINGS.SUBJECT] ?? data.userElectives[electiveGroup]
            ) : null;
            this.title = electiveGroup in STRINGS.SUBJECT ? STRINGS.SUBJECT[electiveGroup] + (
                userElective ? ` (${userElective})` : ""
            ) : electiveGroup;
        } else {
            const distinctSubjects = [...new Set(subjectAbbrevs)];
            const subject = distinctSubjects.map(subj => subj in STRINGS.SUBJECT ? STRINGS.SUBJECT[subj as keyof typeof STRINGS.SUBJECT] : subj)
            this.title = `${subject.join("/")} ${venues.join("/")}`;
        }
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
