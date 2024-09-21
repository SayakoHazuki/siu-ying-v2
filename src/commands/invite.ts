import { ActionRowBuilder, ButtonBuilder, ButtonStyle, type ChatInputCommandInteraction } from "discord.js";
import type { Command } from "./index.js";

export default {
    data: {
        name: 'invite',
        description: 'Get the invite link for the bot',
    },
    async execute(interaction: ChatInputCommandInteraction) {
        const button = new ButtonBuilder().setURL("https://discord.com/oauth2/authorize?client_id=1283023401879080991&permissions=563362270726208&integration_type=0&scope=bot").setLabel("Invite Me").setStyle(ButtonStyle.Link);
        await interaction.reply({
            content: "Thanks for inviting me! Click the button below to invite me to your server.",
            components: [new ActionRowBuilder<ButtonBuilder>().addComponents(button)],
        });
    },
} satisfies Command;
