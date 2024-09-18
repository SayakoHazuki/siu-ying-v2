import { DayOfCycle, OtherDay } from "./enums/calendar.js";

export const CONSTS = {
    "CALENDAR": {
        "DAYS_OF_CYCLE": ["A", "B", "C", "D", "E", "F", "G", "H"] as Array<keyof typeof DayOfCycle>,
        "OTHER_DAYS": {
            "HOLIDAY": "/" as const,
        },
        "STRINGS": {
            "DAY_OF_CYCLE": {
                [DayOfCycle.A]: "A",
                [DayOfCycle.B]: "B",
                [DayOfCycle.C]: "C",
                [DayOfCycle.D]: "D",
                [DayOfCycle.E]: "E",
                [DayOfCycle.F]: "F",
                [DayOfCycle.G]: "G",
                [DayOfCycle.H]: "H",
                [OtherDay.HOLIDAY]: "Holiday",
            },
        },
    }
}
