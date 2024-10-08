import type { UserSettingsData } from "../../types/general.types.js";

export class UserSettings {
    // User settings data, should not be get/set directly, use the getters instead
    private readonly data: UserSettingsData;

    // Create a new instance of the user settings
    public constructor(data: UserSettingsData) {
        this.data = {
            cls: data.cls,
            elective_1x: data.elective_1x,
            elective_2x: data.elective_2x,
            elective_3x: data.elective_3x,
        }
    }

    // Get the user's class
    public get cls() {
        return this.data.cls;
    }

    // Get the user's electives
    public get electives() {
        return {
            "1X": this.elective_1x,
            "2X": this.elective_2x,
            "3X": this.elective_3x,
        }
    }

    // Get the user's 1X elective
    public get elective_1x() {
        return this.data.elective_1x;
    }

    // Get the user's 2X elective
    public get elective_2x() {
        return this.data.elective_2x;
    }

    // Get the user's 3X elective
    public get elective_3x() {
        return this.data.elective_3x;
    }
}
