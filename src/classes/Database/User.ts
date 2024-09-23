import type { Database } from "../../types/database.types.js";
import logger from "../Logger/index.js";
import { UserSettings } from "./UserSettings.js";
import Db from "./index.js";

// User class to interact with user data
export class User {
    public readonly id: string;

    public readonly settings: UserSettings;

    // Create a new instance of the user
    public constructor(public readonly data: Database['public']['Tables']['user_data']['Row']) {
        this.id = data.userId;
        this.settings = new UserSettings({
            cls: data.cls ?? null,
            elective_1x: data.elective_1x ?? null,
            elective_2x: data.elective_2x ?? null,
            elective_3x: data.elective_3x ?? null,
        });
    }

    // Fetch user data from the database, returns null if user not found
    public static async fetch(userId: string): Promise<User | null> {
        const { data, error } = await Db.client.from('user_data').select('*').eq('userId', userId).single();
        if (error || !data) {
            if (error) logger.error(error);
            if (!data) logger.warn(`User ${userId} not found`);
            return null;
        }

        return new User(data);
    }

    // Update a user's data or create a new user if not found
    public static async updateOrCreate(userId: string, data: Partial<Database['public']['Tables']['user_data']['Row']>): Promise<User> {
        try {
            logger.info(data)
            const user = await User.fetch(userId); // Check if user exists
            if (!user) throw new Error("User not found");

            await Db.client.from('user_data').update(data).eq('userId', userId);
        } catch {
            // User most likely doesn't exist
            const { error } = await Db.client.from('user_data').insert([{ userId, ...data }]);

            if (error) {
                throw new Error(`Failed to insert user data: ${error.message}`);
            }
        }

        return User.fetch(userId) as Promise<User>;
    }
}
