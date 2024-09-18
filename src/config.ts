export const CONFIG = {
    API: {
        BASE_URL: 'https://iot.spyc.hk',
        ROUTES: {
            CYCLE_CAL: '/cyclecal',
            TIMETABLE: '/timetable',
        },
        FORMATS: {
            CALENDAR_KEY: 'DD/MM/YYYY', // parsable options as in https://momentjs.com/docs/#/displaying/format/
        }
    },
    TIMETABLE: {
        CALENDAR_REL_SAVE_PATH: '../../../data/apiCalendar.json', // relative to classes/Timetable/Calendar.ts
        SCHEDULES_REL_SAVE_PATH: '../../../data/apiSchedules.json', // relative to classes/Timetable/Schedules
    },
}
