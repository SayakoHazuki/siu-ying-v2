import type { RESTPostAPIApplicationCommandsJSONBody, CommandInteraction, ButtonInteraction, StringSelectMenuInteraction, ModalSubmitInteraction, ModalSubmitFields } from 'discord.js';
import { z } from 'zod';
import type { StructurePredicate } from '../util/loaders.js';

/**
 * Defines the structure of a command
 */
export type Command = {
	/**
	 * The data for the command
	 */
	data: RESTPostAPIApplicationCommandsJSONBody;
	/**
	 * The function to execute when the command is called
	 *
	 * @param interaction - The interaction of the command
	 */
	execute(interaction: CommandInteraction): Promise<void> | void;
	/**
	 * The function to handle button interactions
	 * 
	 * @param interaction - The interaction of the command
	 * @param customId - The custom ID of the button
	 * @param args - The arguments of the button
	 */
	handleButton?(interaction: ButtonInteraction, customId: string, ...args: string[]): Promise<void> | void;
	/**
	 * The function to handle Modal submissions
	 * 
	 * @param interaction - The interaction of the command
	 * @param customId - The custom ID of the modal
	 * @param fields - The fields of the modal
	 */
	handleModal?(interaction: ModalSubmitInteraction, customId: string, fields: ModalSubmitFields): Promise<void> | void;
	/**
	 * The function to handle select menu interactions
	 * 
	 * @param interaction - The interaction of the command
	 * @param customId - The custom ID of the select menu
	 * @param args - The arguments of the select menu
	 */
	handleSelectMenu?(interaction: StringSelectMenuInteraction, customId: string, ...args: string[]): Promise<void> | void;
};

/**
 * Defines the schema for a command
 */
export const schema = z.object({
	data: z.record(z.any()),
	execute: z.function(),
});

/**
 * Defines the predicate to check if an object is a valid Command type.
 */
export const predicate: StructurePredicate<Command> = (structure: unknown): structure is Command =>
	schema.safeParse(structure).success;
