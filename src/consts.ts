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
            "SUBJECT": {
                "CHIN": "中國語文 (CHIN)",
                "ENG": "英國語文 (ENG)",
                "MATH": "數學 (MATH)",
                "LS": "通識 (LS)",
                "L&S": "生活與社會 (L&S)",
                "CS": "公民與社會發展 (CS)",
                "PHY": "物理 (PHY)",
                "CHEM": "化學 (CHEM)",
                "BIO": "生物 (BIO)",
                "ICT": "資訊及通訊科技 (ICT)",
                "PE": "體育 (PE)",
                "MUS": "音樂 (MUS)",
                "VA": "視覺藝術 (VA)",
                
            },
        },
    }
}
