import type { Moment } from "moment";

export class Section {
    public readonly startTime: Moment;

    public readonly endTime: Moment;

    public title?: string;

    public constructor(startTime: Moment, endTime: Moment, title?: string) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.title = title;
    }
}

export class LessonSection extends Section {
    public readonly classes: Array<{
        subject: string; venue: string;
    }>

    public constructor(startTime: Moment, endTime: Moment, data: {
        classes: Array<{ subject: string; venue: string; }>
    }) {
        super(startTime, endTime);
        this.classes = data.classes;

        /* title format: "Subject1/SubjectB Rm101/Rm102" */
        const subjects = this.classes.map(cls => cls.subject).join("/");
        const venues = this.classes.map(cls => cls.venue).join("/");

        this.title = `${subjects} ${venues}`;
    }
}

export class MorningAssemblySection extends Section {
    public constructor(startTime: Moment, endTime: Moment, _data: any) {
        super(startTime, endTime, "Morning Assembly");
    }
}

export class RecessSection extends Section {
    public constructor(startTime: Moment, endTime: Moment, _data: any) {
        super(startTime, endTime, "Recess");
    }
}

export class LunchSection extends Section {
    public constructor(startTime: Moment, endTime: Moment, _data: any) {
        super(startTime, endTime, "Lunch");
    }
}
