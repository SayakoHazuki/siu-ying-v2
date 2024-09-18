import fs from "node:fs/promises";
import path from "node:path";
import { CONFIG } from "../../config.js";
import { DayOfCycle } from "../../enums/calendar.js";
import type { ApiSchedulesData, ApiSchedule_OneClassData, ApiSchedule_OneScheduleData, ApiDayOfCycleString } from "../../types/timetable.js";
import { Api } from "../Api/index.js";
import logger from "../Logger/index.js";

const savePath = path.join((import.meta as any).dirname, CONFIG.TIMETABLE.SCHEDULES_REL_SAVE_PATH);

export type ClassSchedules = InstanceType<typeof _ClassSchedules>;
class _ClassSchedules {
    private readonly data: Map<ApiDayOfCycleString, ApiSchedule_OneScheduleData[]>;

    public constructor(data: ApiSchedule_OneClassData) {
        this.data = new Map(Object.entries(data) as Array<
            [ApiDayOfCycleString, ApiSchedule_OneScheduleData[]]
        >);
    }

    public getDaySchedules(dayOfCycle: DayOfCycle): ApiSchedule_OneScheduleData[] | null {
        return this.data.get(
            DayOfCycle[dayOfCycle] as ApiDayOfCycleString
        ) ?? null;
    }
}

export class Schedules {
    private readonly rawData: ApiSchedulesData;

    private readonly data: Map<string, ClassSchedules>;

    private constructor(data: ApiSchedulesData) {
        this.rawData = data;
        this.data = new Map(Object.entries(data).map(([cls, schedules]) => [cls, new _ClassSchedules(schedules)]));
    }

    public static async fromApi({ saveToFile = false } = {}): Promise<Schedules> {
        const data = await Api.getTimetable();
        const sched = new Schedules(data);
        if (saveToFile) void sched.saveToFile();
        return sched;
    }

    public static async fromFile(): Promise<Schedules> {
        try {
            const data = await fs.readFile(savePath, "utf8");
            return new Schedules(JSON.parse(data));
        } catch (error) {
            logger.error("Failed to read calendar data from file", error);
            return Schedules.fromApi({ saveToFile: true });
        }
    }


    public getClassSchedule(cls: string): ClassSchedules | null {
        return this.data.get(cls) ?? null
    }

    private async saveToFile() {
        try {
            await fs.writeFile(savePath, JSON.stringify(this.rawData));
        } catch (error) {
            logger.error("Failed to save schedules data to file", error);
        }
    }
}
