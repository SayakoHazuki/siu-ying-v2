import type { ChatInputCommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import moment from "moment";
import { User } from "../classes/Database/User.js";
import { CONFIG } from "../config.js";
import { SiuYingEmbed } from "../util/embed.js";
import { customExecute } from "./timetable.js"
import type { Command } from "./index.js";

export default {
    data: {
        name: 'tomorrow',
        description: 'Shortcut for /timetable to show tomorrow\'s timetable',
        options: [
            {
                name: 'class',
                description: 'Input the class you want to check (e.g. 1A), leave blank for preset class settings',
                type: ApplicationCommandOptionType.String,
                required: false,
            }
        ]
    },

    async execute(interaction: ChatInputCommandInteraction) {
        let inputCls = interaction.options.getString('class')?.toUpperCase();
        if (!inputCls) {
            const user = await User.fetch(interaction.user.id);
            if (user?.settings.cls) {
                inputCls = user.settings.cls;
            } else {
                return void await interaction.reply({ embeds: [new SiuYingEmbed({ user: interaction.user }).setColor("Red").setTitle("Please input a class").setDescription("You have not set a default class for timetable commands yet. Please either set it using `/settings` or include a class in the command.")] });
            }
        }

        if (inputCls && !CONFIG.GENERAL.CLASSES.includes(inputCls)) {
            return void await interaction.reply({ embeds: [new SiuYingEmbed({ user: interaction.user }).setColor("Red").setTitle("Invalid Class").setDescription("Please enter a valid class (e.g. 1A, 2B)")] });
        }

        const tmrMoment = moment.tz("Asia/Hong_Kong").add(1, 'days');

        // Calls customExecute from timetable.ts, with the moment object set to the next day
        await customExecute(interaction, inputCls, tmrMoment);
    },
} satisfies Command;
