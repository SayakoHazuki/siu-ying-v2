import { SiuYingEmbed } from "../util/embed.js";
import type { Command } from "./index.js";

export default {
    data: {
        name: "about",
        description: "Get information about the bot.",
    },

    async execute(interaction) {
        await interaction.reply({
            embeds: [
                new SiuYingEmbed({ user: interaction.user })
                    .setTitle("Siu Ying v2")
                    .setDescription("Made by Software Development Club, Siu Ying (V2) is an updated version of the original Siu Ying bot introduced in the SPYC Discord Personal Assistant workshop in January 2022. This bot aims to provide students with convenience by implementing a chat command (/timetable) to check the school timetable.")
                    .addFields(
                        { name: "Commands", value: "`/timetable <class> <date>`\nCheck the timetable of a class on a specific date.\n\n`/about`\nThis command." },
                        { name: "\u200B", value: "-# Privacy note\n-# We collect statistics regarding usage activity of commands solely for the purpose of improving the bot. The bot does not read your messages in any forms.\n\n-# Source code\n-# The source for this Discord bot is available at the bot's [Github Repository](https://github.com/SayakoHazuki/siu-ying-v2). Any kind of contribution is welcomed." }
                    )
                    .setFooter({ text: "Made with ❤️ by Software Development Club", iconURL: undefined })
            ]
        })
    }
} satisfies Command;
