import process from 'node:process';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import { CONFIG } from '../../config.js';
import type { Database } from '../../types/database.types.js';
import logger from '../Logger/index.js';

// Helper class to interact with the database
class _Database {
    public readonly client: SupabaseClient<Database>;

    // should not be called directly, use create() instead
    private constructor(supabaseUrl: string, supabaseKey: string) {
        this.client = createClient(supabaseUrl, supabaseKey);
    }

    // Create a new instance of the database
    public static create() {
        if (!process.env.SUPABASE_SERVICE_KEY?.length) {
            throw new Error('Supabase service key is not provided');
        }

        return new _Database(CONFIG.DATABASE.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    }

    // Insert a new command record into the database
    public async insertCommandRecord(command: string, userId: string, args: Record<string, string> = {}) {
        const { error } = await this.client.from('commands_log').insert({
            command,
            userId,
            args,
        });
        if (error) {
            logger.error(`Failed to add command record: ${error.message}`);
        }
    }

    // Insert a new interaction record into the database
    public async insertInteractionRecord(
        type: Database['public']['Enums']['interactionaction_type'],
        userId: string,
        customId: string | null = null,
        data?: Record<string, string>,
    ) {
        const { error } = await this.client.from('interaction_logs').insert({
            type,
            userId,
            customId,
            data
        });
        if (error) {
            logger.error(`Failed to add interaction record: ${error.message}`);
        }
    }
}

// Export a new instance of the database
const Db = _Database.create();
export default Db;
