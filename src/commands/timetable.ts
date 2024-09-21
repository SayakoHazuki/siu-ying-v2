import type { ButtonInteraction, ChatInputCommandInteraction, StringSelectMenuInteraction } from 'discord.js';
import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from 'discord.js';
import type { Moment } from "moment-timezone";
import moment from "moment-timezone";
import { User } from '../classes/Database/User.js';
import { TimetableQuery } from '../classes/Timetable/TimetableQuery.js';
import { CONFIG } from '../config.js';
import { SiuYingEmbed } from '../util/embed.js';
import SettingsViewCommand from './settings/view.subcommand.js';
import type { Command } from './index.js';

export const getTimetableActions = (cls: string, date: Moment) => [
	new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder().setCustomId(`timetable:previous:${cls}:${date.format("YYYY-MM-DD")}`).setEmoji("1013803101129543690").setStyle(ButtonStyle.Primary),
		new ButtonBuilder().setCustomId(`timetable:void`).setLabel(date.format("DD/MM")).setStyle(ButtonStyle.Primary).setDisabled(true),
		new ButtonBuilder().setCustomId(`timetable:next:${cls}:${date.format("YYYY-MM-DD")}`).setEmoji("1013802785910833234").setStyle(ButtonStyle.Primary),
		new ButtonBuilder().setCustomId(`timetable:today:${cls}`).setLabel("今日").setStyle(ButtonStyle.Primary),
		new ButtonBuilder().setCustomId(`timetable:settings`).setEmoji("⚙️").setStyle(ButtonStyle.Secondary),
	),
	new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
		new StringSelectMenuBuilder().setCustomId(`timetable:class:${date.format("YYYY-MM-DD")}`).setPlaceholder(` 選擇班級 (目前: ${cls})`)
			.addOptions(CONFIG.GENERAL.CLASSES.map(cls => ({ label: cls, value: cls })))
			.setMaxValues(1).setMinValues(1)
	)
]

export async function customExecute(interaction: ButtonInteraction | ChatInputCommandInteraction | StringSelectMenuInteraction, cls: string, inputMoment: Moment) {
	const user = await User.fetch(interaction.user.id);
	const query = new TimetableQuery(interaction, cls, inputMoment, user);
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
				description: 'Input the class you want to check (e.g. 1A), leave blank for preset class settings',
				type: ApplicationCommandOptionType.String,
				required: false,
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
		let inputCls = interaction.options.getString('class')?.toUpperCase();
		let inputDate = interaction.options.getString('date') ?? moment.tz("Asia/Hong_Kong").format("YYYY-MM-DD");

		/* Validations and default values */

		// If class is not provided, check if user has set a default class
		const user = await User.fetch(interaction.user.id);
		if (!inputCls) {
			if (user?.settings.cls) {
				inputCls = user.settings.cls;
			} else {
				return void await interaction.reply({ embeds: [new SiuYingEmbed({ user: interaction.user }).setColor("Red").setTitle("Please input a class").setDescription("You have not set a default class for timetable commands yet. Please either set it using `/settings` or include a class in the command.")] });
			}
		}

		// Check if class is valid
		if (inputCls && !CONFIG.GENERAL.CLASSES.includes(inputCls)) {
			return void await interaction.reply({ embeds: [new SiuYingEmbed({ user: interaction.user }).setColor("Red").setTitle("Invalid Class").setDescription("Please enter a valid class (e.g. 1A, 2B)")] });
		}

		// Check if date is date-of-week
		if (["mon", "tue", "wed", "thu", "fri", "sat", "sun"].includes(inputDate.toLowerCase())) {
			const dayOfWeekMoment = moment.tz("Asia/Hong_Kong").day(inputDate);
			if (dayOfWeekMoment.isBefore(moment.tz("Asia/Hong_Kong"), "day")) {
				dayOfWeekMoment.add(1, "week");
			}

			inputDate = dayOfWeekMoment.format("YYYY-MM-DD");
		}

		// Check if date is valid
		if (inputDate && !moment.tz(inputDate, "Asia/Hong_Kong").isValid()) {
			return void await interaction.reply({ embeds: [new SiuYingEmbed({ user: interaction.user }).setColor("Red").setTitle("Invalid Date").setDescription("Please enter a valid date in formats like: 2024-01-13 / 20240113 (Leave blank for today)")] });
		}

		/* Execute query */
		const inputMoment = moment.tz(inputDate, "Asia/Hong_Kong");

		const query = new TimetableQuery(interaction, inputCls, inputMoment, user);
		await interaction.deferReply();
		const result = await query.execute();
		await interaction.editReply({
			embeds: [result.toEmbed()],
			components: result.success ? getTimetableActions(inputCls, inputMoment) : [],
		});
	},

	async handleButton(interaction: ButtonInteraction, customId: string, ...args: string[]) {
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
				await SettingsViewCommand.execute(interaction);
				return;
			}

			default:
				await interaction.reply({ embeds: [new SiuYingEmbed({ user: interaction.user }).setColor("Red").setTitle("Invalid Action").setDescription("An unknown error occurred")] });
		}

	},

	async handleSelectMenu(interaction: StringSelectMenuInteraction, customId: string, ...args: string[]) {
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
