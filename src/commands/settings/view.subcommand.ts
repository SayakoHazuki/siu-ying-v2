import type { ButtonInteraction, CommandInteraction } from "discord.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { User } from "../../classes/Database/User.js";
import { SiuYingEmbed } from "../../util/embed.js";
import type { Command } from "../index.js";

export default {
    data: {
        name: "view",
        description: "View your settings.",
        options: []
    },

    async execute(interaction: ButtonInteraction | CommandInteraction) {
        const user = await User.fetch(interaction.user.id);
        const userSettings = {
            cls: user?.settings.cls,
            electives: user.settings.electives
        }
        const electiveKeys = Object.keys(userSettings.electives) as Array<keyof typeof userSettings.electives>;

        const embed = new SiuYingEmbed({ user: interaction.user })
            .setTitle("用戶設定")
            .setDescription("目前用戶設定：")
            .addFields([
                { name: "時間表預設班別", value: userSettings.cls ? userSettings.cls : "Not set", inline: true },
                {
                    name: "時間表顯示選修科目",
                    value: (electiveKeys.map(
                        key => `${key}: ${userSettings.electives[key] || "Not set"}`
                    )).join("\n"),
                    inline: true
                },
            ])
            .setColor("Blue");

        const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setCustomId("settings:prompt-class").setLabel("修改班別").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId("settings:prompt-electives").setLabel("修改選修科").setStyle(ButtonStyle.Secondary),
        )

        await interaction.reply({ embeds: [embed], components: [buttons], ephemeral: true });
    },
} satisfies Command;
