import type { ChatInputCommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { User } from "../../classes/Database/User.js";
import { CONFIG } from "../../config.js";
import type { UserSettingsData } from "../../types/general.types.js";
import { SiuYingEmbed } from "../../util/embed.js";

export default {
    data: {
        name: "class",
        description: "Change the default class for timetable commands.",
        options: [
            {
                name: "class",
                description: "The class you want to set as default. Leave blank to remove default class.",
                type: ApplicationCommandOptionType.String,
                required: false,
            }
        ]
    },

    async execute(interaction: ChatInputCommandInteraction) {
        const tests: Array<{ message: string, run(data: Partial<UserSettingsData>): boolean }> = [
            { run: ({ cls }) => !cls || CONFIG.GENERAL.CLASSES.includes(cls), message: "Invalid class." },
        ]

        const data: Partial<UserSettingsData> = {
            cls: interaction.options.getString("class")?.toUpperCase() ?? "",
        }


        for (const test of tests) {
            if (!test.run(data)) {
                return void await interaction.reply({
                    embeds: [new SiuYingEmbed({ user: interaction.user }).setTitle("Failed to update user settings").setDescription(test.message).setColor("Red")],
                    ephemeral: true,
                })
            }
        }

        await interaction.deferReply({ ephemeral: true });
        await User.updateOrCreate(interaction.user.id, data);

        await interaction.editReply({
            embeds: [
                new SiuYingEmbed({ user: interaction.user })
                    .setTitle("User Settings")
                    .setDescription("Your settings have been updated.")
                    .addFields({
                        name: "New settings",
                        value: Object.entries(data).map((
                            [_key, value]) =>
                            `Default class set to ${value ?? "(None)"}`
                        ).join("\n") || "No changes"
                    })
                    .setColor("Blue")
            ]
        })
    },
}
