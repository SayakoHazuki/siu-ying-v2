import type { ButtonInteraction, ChatInputCommandInteraction, StringSelectMenuInteraction } from 'discord.js';
import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from 'discord.js';
import type { Moment } from "moment-timezone";
import moment from "moment-timezone";
import logger from '../classes/Logger/index.js';
import { TimetableQuery } from '../classes/Timetable/TimetableQuery.js';
import { CONFIG } from '../config.js';
import { SiuYingEmbed } from '../util/embed.js';
import type { Command } from './index.js';

export const getTimetableActions = (cls: string, date: Moment) => [
	new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder().setCustomId(`timetable:previous:${cls}:${date.format("YYYY-MM-DD")}`).setLabel("<<").setStyle(ButtonStyle.Primary),
		new ButtonBuilder().setCustomId(`timetable:void`).setLabel(date.format("DD/MM")).setStyle(ButtonStyle.Secondary).setDisabled(true),
		new ButtonBuilder().setCustomId(`timetable:next:${cls}:${date.format("YYYY-MM-DD")}`).setLabel(">>").setStyle(ButtonStyle.Primary),
		new ButtonBuilder().setCustomId(`timetable:today:${cls}`).setLabel("跳至今日").setStyle(ButtonStyle.Primary),
		new ButtonBuilder().setCustomId(`timetable:settings`).setLabel("設定").setStyle(ButtonStyle.Secondary),
	),
	new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
		new StringSelectMenuBuilder().setCustomId(`timetable:class:${date.format("YYYY-MM-DD")}`).setPlaceholder(` 選擇班級 (目前: ${cls})`)
			.addOptions(CONFIG.GENERAL.CLASSES.map(cls => ({ label: cls, value: cls })))
			.setMaxValues(1).setMinValues(1)
	)
]

async function customExecute(interaction: ButtonInteraction | ChatInputCommandInteraction | StringSelectMenuInteraction, cls: string, inputMoment: Moment) {
	const query = new TimetableQuery(interaction, cls, inputMoment);
	await interaction.deferReply();
	const result = await query.execute();
	await interaction.editReply({
		embeds: [result.toEmbed()],
		components: result.success ? getTimetableActions(cls, inputMoment) : [],
	});
}

export default {
	data: {
		name: 'timetable',
		description: '...',
		options: [
			{
				name: 'class',
				description: 'Input the class you want to check (e.g. 1A)',
				type: ApplicationCommandOptionType.String,
				required: true,
			},
			{
				name: 'date',
				description: 'Input the date you want to check (e.g. 2024-01-13), leave blank for today',
				type: ApplicationCommandOptionType.String,
				required: false,
			},
		],
	},
	async execute(interaction: ChatInputCommandInteraction) {
		logger.info(`Timetable command executed by ${interaction.user.tag}, class: ${interaction.options.getString('class')}, date: ${interaction.options.getString('date')}`);

		let inputCls = interaction.options.getString('class')?.toUpperCase();
		let inputDate = interaction.options.getString('date');

		if (!inputCls) {
			inputCls = "1A"
		}

		if (!inputDate) {
			inputDate = moment.tz("Asia/Hong_Kong").format("YYYY-MM-DD")
		}

		if (inputCls && !CONFIG.GENERAL.CLASSES.includes(inputCls)) {
			return void await interaction.reply({ embeds: [new SiuYingEmbed({ user: interaction.user }).setColor("Red").setTitle("Invalid Class").setDescription("Please enter a valid class (e.g. 1A, 2B)")] });
		}

		if (inputDate && !moment.tz(inputDate, "Asia/Hong_Kong").isValid()) {
			return void await interaction.reply({ embeds: [new SiuYingEmbed({ user: interaction.user }).setColor("Red").setTitle("Invalid Date").setDescription("Please enter a valid date in formats like: 2024-01-13 / 20240113 (Leave blank for today)")] });
		}

		const inputMoment = moment.tz(inputDate, "Asia/Hong_Kong");

		const query = new TimetableQuery(interaction, inputCls, inputMoment);
		await interaction.deferReply();
		const result = await query.execute();
		await interaction.editReply({
			embeds: [result.toEmbed()],
			components: result.success ? getTimetableActions(inputCls, inputMoment) : [],
		});
	},

	async handleButton(interaction: ButtonInteraction, customId: string, ...args: string[]) {
		logger.info(`Timetable button clicked by ${interaction.user.tag}, customId: ${customId}, args: ${args.join(",")}`);
		switch (customId) {
			case "previous":
			case "next": {
				const [cls, date] = args;
				if (!cls || !date) {
					return void await interaction.reply({ embeds: [new SiuYingEmbed({ user: interaction.user }).setColor("Red").setTitle("Invalid Action").setDescription("An unknown error occurred")] });
				}

				const inputMoment = moment.tz(date, "Asia/Hong_Kong");
				inputMoment[customId === "previous" ? "subtract" : "add"](1, "day");

				await customExecute(interaction, cls, inputMoment);
				return;
			}

			case "today": {
				const [cls] = args;
				if (!cls) {
					return void await interaction.reply({ embeds: [new SiuYingEmbed({ user: interaction.user }).setColor("Red").setTitle("Invalid Class").setDescription("An unknown error occurred")] });
				}

				await customExecute(interaction, cls, moment.tz("Asia/Hong_Kong"));
				return;
			}

			case "settings": {
				return void await interaction.reply({ embeds: [new SiuYingEmbed({ user: interaction.user }).setColor("Red").setTitle("Settings").setDescription("Settings are not available yet.")] });
			}

			default:
				await interaction.reply({ embeds: [new SiuYingEmbed({ user: interaction.user }).setColor("Red").setTitle("Invalid Action").setDescription("An unknown error occurred")] });
		}

	},

	async handleSelectMenu(interaction: StringSelectMenuInteraction, customId: string, ...args: string[]) {
		logger.info(`Timetable select menu clicked by ${interaction.user.tag}, customId: ${customId}, args: ${args.join(",")}`);
		switch (customId) {
			case "class": {
				const [date] = args;
				if (!date) {
					return void await interaction.reply({ embeds: [new SiuYingEmbed({ user: interaction.user }).setColor("Red").setTitle("Invalid Class").setDescription("An unknown error occurred")] });
				}

				await customExecute(interaction, interaction.values[0], moment.tz(date, "Asia/Hong_Kong"));
				return;
			}

			default:
				await interaction.reply({ embeds: [new SiuYingEmbed({ user: interaction.user }).setColor("Red").setTitle("Invalid Action").setDescription("An unknown error occurred")] });
		}
	}
} satisfies Command;
