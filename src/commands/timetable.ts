import { ApplicationCommandOptionType } from 'discord.js';
import moment from "moment-timezone";
import logger from '../classes/Logger/index.js';
import { TimetableQuery } from '../classes/Timetable/TimetableQuery.js';
import type { Command } from './index.js';

export default {
	data: {
		name: 'timetable',
		description: '...',
		options: [
			{
				name: 'class',
				description: '...',
				type: ApplicationCommandOptionType.String,
				required: true,
			},
			{
				name: 'date',
				description: '...',
				type: ApplicationCommandOptionType.String,
				required: true,
			},
		],
	},
	async execute(interaction) {
		logger.info(`Timetable command executed by ${interaction.user.tag}, class: ${interaction.options.getString('class')}, date: ${interaction.options.getString('date')}`);
		const query = new TimetableQuery(interaction, interaction.options.getString('class'), moment.tz(interaction.options.getString('date'), "Asia/Hong_Kong"));
		await interaction.deferReply();
		const result = await query.execute();
		await interaction.editReply({
			embeds: [result.toEmbed()],
		});
	},
} satisfies Command;
