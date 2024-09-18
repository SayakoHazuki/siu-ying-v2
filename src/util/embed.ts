import type { Interaction } from "discord.js";
import { EmbedBuilder } from "discord.js";

export class SiuYingEmbed extends EmbedBuilder {
    public constructor(data: {
        user: Interaction["user"];
    }) {
        super();
        this.setColor("#FFD700");
        this.setAuthor({
            name: "SPYC Siu Ying",
            iconURL: "https://cdn.discordapp.com/avatars/933610860012793877/e7fe11793f2491a66bfdf79ba4e21fdc.webp?size=160",
        })
        this.setFooter({
            text: `Requested by ${data.user.tag}`,
            iconURL: data.user.displayAvatarURL(),
        })
    }
}
