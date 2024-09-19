import { Events, type Client, type ChatInputCommandInteraction, type ModalSubmitInteraction } from 'discord.js';
import Db from '../classes/Database/index.js';
import type { Command } from '../commands/index.js';
import type { Event } from '../events/index.js';

export function registerEvents(commands: Map<string, Command>, events: Event[], client: Client): void {
	// Create an event to handle command interactions
	const interactionCreateEvent: Event<Events.InteractionCreate> = {
		name: Events.InteractionCreate,
		async execute(interaction) {
			if (interaction.isCommand()) {
				const command = commands.get(interaction.commandName);

				if (!command) {
					throw new Error(`Command '${interaction.commandName}' not found.`);
				}

				const { commandName, user, options } = interaction as ChatInputCommandInteraction;
				const optionsJson = {} as Record<string, string>;
				for (const option of options.data) {
					optionsJson[option.name] = option.value?.toString() ?? "";
				}

				await Db.insertCommandRecord(commandName, user.id, optionsJson);
				await command.execute(interaction);
			}

			if (interaction.isButton()) {
				const [commandId, customId, ...args] = interaction.customId.split(':');
				const command = commands.get(commandId);

				if (!command) {
					throw new Error(`Command '${customId}' not found.`);
				}

				await Db.insertInteractionRecord("button_interaction", interaction.user.id, interaction.customId);

				await command.handleButton?.(interaction, customId, ...args);
			}

			if (interaction.isStringSelectMenu()) {
				const [commandId, customId, ...args] = interaction.customId.split(':');
				const command = commands.get(commandId);

				if (!command) {
					throw new Error(`Command '${customId}' not found.`);
				}

				await Db.insertInteractionRecord("select_menu_interaction", interaction.user.id, interaction.customId);

				await command.handleSelectMenu?.(interaction, customId, ...args);
			}

			if (interaction.isModalSubmit()) {
				const [commandId, customId] = interaction.customId.split(':');

				const command = commands.get(commandId);

				if (!command) {
					throw new Error(`Command '${customId}' not found.`);
				}

				const { user, fields } = interaction as ModalSubmitInteraction;

				await Db.insertInteractionRecord(
					"modal_submit", user.id, interaction.customId,
					Object.fromEntries(
						fields.fields.map(field => field.value).entries()
					)
				);

				await command.handleModal?.(interaction, customId, interaction.fields);
			}
		},
	};

	for (const event of [...events, interactionCreateEvent]) {
		client[event.once ? 'once' : 'on'](event.name, async (...args) => event.execute(...args));
	}
}
