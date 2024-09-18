import { Events, type Client } from 'discord.js';
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

				await command.execute(interaction);
			}

			if (interaction.isButton()) {
				const [commandId, customId, ...args] = interaction.customId.split(':');
				const command = commands.get(commandId);

				if (!command) {
					throw new Error(`Command '${customId}' not found.`);
				}

				await command.handleButton?.(interaction, customId, ...args);
			}
			
			if (interaction.isStringSelectMenu()) {
				const [commandId, customId, ...args] = interaction.customId.split(':');
				const command = commands.get(commandId);

				if (!command) {
					throw new Error(`Command '${customId}' not found.`);
				}

				await command.handleSelectMenu?.(interaction, customId, ...args);
			}
		},
	};

	for (const event of [...events, interactionCreateEvent]) {
		client[event.once ? 'once' : 'on'](event.name, async (...args) => event.execute(...args));
	}
}
