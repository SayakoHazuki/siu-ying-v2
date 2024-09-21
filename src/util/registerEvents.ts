import { Events, type Client, type ChatInputCommandInteraction, type ModalSubmitInteraction } from 'discord.js';
import Db from '../classes/Database/index.js';
import logger from '../classes/Logger/index.js';
import type { Command } from '../commands/index.js';
import type { Event } from '../events/index.js';

export function registerEvents(commands: Map<string, Command>, events: Event[], client: Client): void {
	// Create an event to handle command interactions
	const interactionCreateEvent: Event<Events.InteractionCreate> = {
		name: Events.InteractionCreate,
		async execute(interaction) {
			if (interaction.isCommand()) {
				const command = commands.get(interaction.commandName);
				const subcommandText = (interaction as ChatInputCommandInteraction).options.getSubcommand(false);
				const subcommand = subcommandText ? command?.subcommands?.get(subcommandText) : null;
				const optionsData = (subcommand ? interaction.options.data[0].options : interaction.options.data) ?? [];
				logger.info(`Command '${interaction.commandName}${subcommand ? ` ${subcommand.data.name}` : ''}' executed by ${interaction.user.tag} with args: ${optionsData.map(option => `${option.name}: ${option.value}`).join(', ')}`);

				if (!command) {
					logger.error(`Command '${interaction.commandName}' not found.`);
					throw new Error(`Command '${interaction.commandName}' not found.`);
				}

				const { commandName, user, options } = interaction as ChatInputCommandInteraction;
				const optionsJson = {} as Record<string, string>;
				if (subcommandText) optionsJson.subcommand = subcommandText;
				for (const option of options.data) {
					optionsJson[option.name] = option.value?.toString() ?? "";
				}

				await Db.insertCommandRecord(commandName, user.id, optionsJson);

				if (subcommand) {
					await subcommand.execute(interaction as ChatInputCommandInteraction);
				} else {
					await command.execute(interaction);
				}
			}

			if (interaction.isButton()) {
				const buttonId = interaction.customId;
				logger.info(`Button '${buttonId}' executed by ${interaction.user.tag}`);

				const [commandId, customId, ...args] = buttonId.split(':');
				const command = commands.get(commandId);

				if (!command) {
					logger.error(`Command '${customId}' not found for button ${buttonId}.`);
					throw new Error(`Command '${customId}' not found.`);
				}

				await Db.insertInteractionRecord("button_interaction", interaction.user.id, interaction.customId);

				await command.handleButton?.(interaction, customId, ...args);
			}

			if (interaction.isStringSelectMenu()) {
				const selectMenuId = interaction.customId;
				logger.info(`Select menu '${selectMenuId}' executed by ${interaction.user.tag} with options: ${interaction.values.join(', ')}`);

				const [commandId, customId, ...args] = selectMenuId.split(':');
				const command = commands.get(commandId);

				if (!command) {
					logger.error(`Command '${customId}' not found for select menu ${selectMenuId}.`);
					throw new Error(`Command '${customId}' not found.`);
				}

				await Db.insertInteractionRecord("select_menu_interaction", interaction.user.id, interaction.customId);

				await command.handleSelectMenu?.(interaction, customId, ...args);
			}

			if (interaction.isModalSubmit()) {
				const modalId = interaction.customId;
				logger.info(`Modal '${modalId}' submitted by ${interaction.user.tag}`);

				const [commandId, customId] = modalId.split(':');

				const command = commands.get(commandId);

				if (!command) {
					logger.error(`Command '${customId}' not found for modal ${modalId}.`);
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
