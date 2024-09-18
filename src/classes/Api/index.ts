import axios from "axios";
import { CONFIG } from "../../config.js";
import type { ApiCalendarData, ApiSchedulesData } from "../../types/timetable.js";

const config = CONFIG.API;

export const Api = {
    async getCalendar(): Promise<ApiCalendarData> {
        const response = await axios.get<ApiCalendarData>(`${config.BASE_URL}${config.ROUTES.CYCLE_CAL}`);
        return response.data;
    },

    async getTimetable(cls: string = ""): Promise<ApiSchedulesData> {
        const response = await axios.get<ApiSchedulesData>(`${config.BASE_URL}${config.ROUTES.TIMETABLE}/${cls}`);
        return response.data;
    },
};
