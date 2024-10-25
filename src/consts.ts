import { DayOfCycle, OtherDay } from "./enums/calendar.js";
import type { HkoWarningCode } from "./types/hko.types.js";

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
        "LOCALE_STRINGS": {
            "ZH_TRAD": {
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
            "ZH_SIMP": {
                "SUBJECT": {
                    "CHIN": "中国语文 (CHIN)",
                    "ENG": "英国语文 (ENG)",
                    "MATH": "数学 (MATH)",
                    "LS": "通识 (LS)",
                    "L&S": "生活与社会 (L&S)",
                    "CS": "公民与社会发展 (CS)",
                    "MUS": "音乐 (MUS)",
                    "SCI": "综合科学 (SCI)",
                    "M1": "数学延伸1 (M1)",
                    "M2": "数学延伸2 (M2)",
                    "BAFS": "企业会计与财务概论 (BAFS)",
                    "BIO": "生物 (BIO)",
                    "CHIS": "中国历史 (CHIS)",
                    "CLIT": "中国文学 (CLIT)",
                    "CHEM": "化学 (CHEM)",
                    "ECON": "经济 (ECON)",
                    "GEOG": "地理 (GEOG)",
                    "HIST": "历史 (HIST)",
                    "ICT": "资讯与通讯科技 (ICT)",
                    "PHY": "物理 (PHY)",
                    "TH": "旅游与款待 (TH)",
                    "IA": "综合艺术 (IA)",
                    "PE": "体育 (PE)",
                    "RS": "宗教 (RS)",
                    "VA": "视觉艺术 (VA)",
                    "CTP": "班主任课 (CTP)",
                    "ASS": "周会 (ASS)",
                    "DE": "戏剧 (DE)",
                    "HEC": "家政 (HEC)",
                    "PTH": "普通话 (PTH)",
                    "IT": "电脑 (IT)",
                    "1X": "选修课 1X",
                    "2X": "选修课 2X",
                    "3X": "选修课 3X"
                },
            },
            "EN": {
                "SUBJECT": {
                    "CHIN": "CHIN",
                    "ENG": "ENG",
                    "MATH": "MATH",
                    "LS": "LS",
                    "L&S": "L&S",
                    "CS": "CS",
                    "MUS": "MUS",
                    "SCI": "SCI",
                    "M1": "M1",
                    "M2": "M2",
                    "BAFS": "BAFS",
                    "BIO": "BIO",
                    "CHIS": "CHIS",
                    "CLIT": "CLIT",
                    "CHEM": "CHEM",
                    "ECON": "ECON",
                    "GEOG": "GEOG",
                    "HIST": "HIST",
                    "ICT": "ICT",
                    "PHY": "PHY",
                    "TH": "TH",
                    "IA": "IA",
                    "PE": "PE",
                    "RS": "RS",
                    "VA": "VA",
                    "CTP": "CTP",
                    "ASS": "ASS",
                    "DE": "DE",
                    "HEC": "HEC",
                    "PTH": "PTH",
                    "IT": "IT",
                    "1X": "Elective 1X",
                    "2X": "Elective 2X",
                    "3X": "Elective 3X"
                },
            },

        }
    },
    "EMOJIS": {
        "HKO": {
            "WARNINGS": {
                "TC1": "<:tc1:1299378316184387584>",
                "TC3": "<:tc3:1299378319074001036>",
                "TC8NE": "<:tc8ne:1299378323725488189>",
                "TC8NW": "<:tc8nw:1299378328775692318>",
                "TC8SE": "<:tc8se:1299378321439719536>",
                "TC8SW": "<:tc8sw:1299378326103785512>",
                "TC9": "<:tc9:1299378330486964224>",
                "TC10": "<:tc10:1299378332227338312>",
                "WRAINA": "<:raina:1299378333896675379>",
                "WRAINR": "<:rainr:1299378336119652424>",
                "WRAINB": "<:rainb:1299378338325856411>",
            } as Record<HkoWarningCode<"WRAIN" | "WTCSGNL">, string>,
        }
    },
}
