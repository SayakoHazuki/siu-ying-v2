import type { UserSettingsData } from "../../types/general.types.js";

export class UserSettings {
    private readonly data: UserSettingsData;

    public constructor(data: UserSettingsData) {
        this.data = {
            cls: data.cls,
            elective_1x: data.elective_1x,
            elective_2x: data.elective_2x,
            elective_3x: data.elective_3x,
        }
    }

    public get cls() {
        return this.data.cls;
    }

    public get electives() {
        return {
            "1X": this.elective_1x,
            "2X": this.elective_2x,
            "3X": this.elective_3x,
        }
    }

    public get elective_1x() {
        return this.data.elective_1x;
    }

    public get elective_2x() {
        return this.data.elective_2x;
    }

    public get elective_3x() {
        return this.data.elective_3x;
    }
}
