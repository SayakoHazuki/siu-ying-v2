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
                "MUS": "音樂 (MUS)",
                "SCI": "綜合科學 (SCI)",
                "M1": "數學延伸1 (M1)",
                "M2": "數學延伸2 (M2)",
                "BAFS": "企業會計與財務概論 (BAFS)",
                "BIO": "生物 (BIO)",
                "CHIS": "中國歷史 (CHIS)",
                "CLIT": "中國文學 (CLIT)",
                "CHEM": "化學 (CHEM)",
                "ECON": "經濟 (ECON)",
                "GEOG": "地理 (GEOG)",
                "HIST": "歷史 (HIST)",
                "ICT": "資訊與通訊科技 (ICT)",
                "PHY": "物理 (PHY)",
                "TH": "旅遊與款待 (TH)",
                "IA": "綜合藝術 (IA)",
                "PE": "體育 (PE)",
                "RS": "宗教 (RS)",
                "VA": "視覺藝術 (VA)",
                "CTP": "班主任課 (CTP)",
                "ASS": "週會 (ASS)",
                "DE": "戲劇 (DE)",
                "HEC": "家政 (HEC)",
                "PTH": "普通話 (PTH)",
                "IT": "電腦 (IT)",
                "1X": "選修課 1X",
                "2X": "選修課 2X",
                "3X": "選修課 3X"
            },
        },
    }
}
