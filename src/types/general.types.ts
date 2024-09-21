import type { ApplicationCommandOptionType } from "discord.js";
import type { Database } from "./database.types.js";

export type UserSettingsData = Omit<Database['public']['Tables']['user_data']['Row'], 'userId' | "created_at" | "id">;

export type SubCommandWithOnlyStringOptions = {
    description: string;
    name: string;
    required: boolean;
    type: ApplicationCommandOptionType.String;
}
