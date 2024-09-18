import fs from "node:fs/promises";
import path from "node:path";
import type { Moment } from "moment-timezone";
import { CONFIG } from "../../config.js";
import { CONSTS } from "../../consts.js";
import { DayOfCycle, OtherDay } from "../../enums/calendar.js";
import type { ApiCalendarData, ApiDayOfDateString } from "../../types/timetable.js";
import { Api } from "../Api/index.js";
import logger from "../Logger/index.js";


const { CALENDAR: consts } = CONSTS;
const savePath = path.join((import.meta as any).dirname, CONFIG.TIMETABLE.CALENDAR_REL_SAVE_PATH);

export class Calendar {
    private readonly data: Map<string, ApiDayOfDateString>;

    private constructor(data: ApiCalendarData) {
        this.data = new Map(Object.entries(data));
    }

    public static async fromApi({ saveToFile = false } = {}): Promise<Calendar> {
        const data = await Api.getCalendar();
        const cal = new Calendar(data);
        if (saveToFile) void cal.saveToFile();
        return cal;
    }

    public static async fromFile(): Promise<Calendar> {
        try {
            const data = await fs.readFile(savePath, "utf8");
            return new Calendar(JSON.parse(data));
        } catch (error) {
            logger.error("Failed to read calendar data from file", error);
            return Calendar.fromApi({ saveToFile: true });
        }
    }

    public getDayOfCycle(moment: Moment) {
        logger.warn(`getting with key ${moment.format(CONFIG.API.FORMATS.CALENDAR_KEY)}`);
        const day = this.data.get(moment.format(CONFIG.API.FORMATS.CALENDAR_KEY));
        if (!day) return null;

        if (day === consts.OTHER_DAYS.HOLIDAY) {
            return OtherDay.HOLIDAY;
        }

        if (consts.DAYS_OF_CYCLE.includes(day)) {
            return DayOfCycle[day];
        }

        return null;
    }

    private async saveToFile() {
        try {
            await fs.writeFile(savePath, JSON.stringify(Object.fromEntries(this.data)));
        } catch (error) {
            logger.error("Failed to save calendar data to file", error);
        }
    }
}
