import type { ButtonInteraction, CommandInteraction } from "discord.js";
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { User } from "../classes/Database/User.js";
import { CONFIG } from "../config.js";
import { SiuYingEmbed } from "../util/embed.js";
import type { Command } from "./index.js";

export default {
    data: {
        name: "settings",
        description: "Change user settings.",
    },

    async execute(interaction: ButtonInteraction | CommandInteraction) {
        const modal = new ModalBuilder()
            .setCustomId("settings")
            .setTitle("User Settings")

        const classInput = new TextInputBuilder()
            .setCustomId("settings:class")
            .setLabel("Default class for timetable commands")
            .setPlaceholder("Enter your class, e.g. 1A")
            .setStyle(TextInputStyle.Short)

        const firstRow = new ActionRowBuilder<TextInputBuilder>().addComponents(classInput);

        modal.addComponents(firstRow);

        await interaction.showModal(modal);
    },

    async handleModal(interaction, _customId, fields) {
        const tests: Array<{ message: string, run(data: Record<string, any>): boolean }> = [
            { run: ({ cls }) => CONFIG.GENERAL.CLASSES.includes(cls), message: "Invalid class." },
        ]

        const data = {
            cls: fields.getTextInputValue("settings:class").toUpperCase() || undefined,
        }

        for (const test of tests) {
            if (!test.run(data)) {
                return void await interaction.reply({
                    embeds: [new SiuYingEmbed({ user: interaction.user }).setTitle("Failed to update user settings").setDescription(test.message).setColor("Red")],
                    ephemeral: true,
                })
            }
        }

        await User.updateOrCreate(interaction.user.id, data);

        await interaction.reply({
            embeds: [
                new SiuYingEmbed({ user: interaction.user })
                    .setTitle("User Settings")
                    .setDescription("Your settings have been updated.")
                    .setColor("Blue")
            ],
            ephemeral: true,
        })
    }
} satisfies Command;
