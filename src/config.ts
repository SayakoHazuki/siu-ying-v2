export const CONFIG = {
    API: {
        BASE_URL: 'https://iot.spyc.hk',
        ROUTES: {
            CYCLE_CAL: '/cyclecal',
            TIMETABLE: '/timetable',
        },
        FORMATS: {
            CALENDAR_KEY: 'DD/MM/YYYY', // parsable options as in https://momentjs.com/docs/#/displaying/format/
            TIMETABLE_SUBJECT_SPLITTER: ' / ', // e.g. "CHIN / ENG" (the " / " is the splitter)
        }
    },
    TIMETABLE: {
        CALENDAR_REL_SAVE_PATH: '../../../data/apiCalendar.json', // relative to classes/Timetable/Calendar.ts
        SCHEDULES_REL_SAVE_PATH: '../../../data/apiSchedules.json', // relative to classes/Timetable/Schedules
        ELECTIVE_DETERMINANTS: {
            S5: { "1X": "ICT", "2X": "TH", "3X": "VA" },
            S6: { "1X": "ICT", "2X": "TH", "3X": "VA" },
        }
    },
    GENERAL: {
        CLASSES: [
            "1A", "1B", "1C", "1D",
            "2A", "2B", "2C", "2D",
            "3A", "3B", "3C", "3D",
            "4A", "4B", "4C", "4D",
            "5A", "5B", "5C", "5D", "5E",
            "6A", "6B", "6C", "6D"
        ],
    }
}
