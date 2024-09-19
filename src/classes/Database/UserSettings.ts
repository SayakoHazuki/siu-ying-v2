import type { UserSettingsData } from "../../types/general.types.js";

export class UserSettings {
    private readonly data: UserSettingsData;

    public constructor(data: UserSettingsData) {
        this.data = {
            cls: data.cls,
        }
    }

    public get cls() {
        return this.data.cls;
    }
}
