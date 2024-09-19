import type { Database } from "../../types/database.types.js";
import { UserSettings } from "./UserSettings.js";
import Db from "./index.js";

export class User {
    public readonly id: string;

    public readonly settings: UserSettings;

    public constructor(public readonly data: Database['public']['Tables']['user_data']['Row']) {
        this.id = data.userId;
        this.settings = new UserSettings({
            cls: data.cls ?? undefined,
        });
    }

    public static async fetch(userId: string): Promise<User> {
        const { data, error } = await Db.client.from('user_data').select('*').eq('userId', userId).single();
        if (error) {
            throw new Error(`Failed to fetch user data: ${error.message}`);
        }

        if (!data) {
            throw new Error(`User with ID ${userId} not found`);
        }

        return new User(data);
    }

    public static async updateOrCreate(userId: string, data: Partial<Database['public']['Tables']['user_data']['Row']>): Promise<User> {
        try {
            await User.fetch(userId); // Check if user exists
            await Db.client.from('user_data').update(data).eq('userId', userId);
        } catch {
            // User most likely doesn't exist
            const { error } = await Db.client.from('user_data').insert([{ userId, ...data }]);

            if (error) {
                throw new Error(`Failed to insert user data: ${error.message}`);
            }
        }

        return User.fetch(userId);
    }
}
