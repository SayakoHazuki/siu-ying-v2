import process from 'node:process';
import { URL } from 'node:url';
import { API } from '@discordjs/core/http-only';
import { REST } from 'discord.js';
import { loadCommands } from './loaders.js';

const commands = await loadCommands(new URL('../commands/', import.meta.url));
const commandData = [...commands.values()].map((command) => command.data);
console.log(commandData[0].options);
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
const api = new API(rest);

const result = await api.applicationCommands.bulkOverwriteGlobalCommands(process.env.APPLICATION_ID!, commandData);
const updatedData = await api.applicationCommands.getGlobalCommands(process.env.APPLICATION_ID!);

console.log(`Successfully registered ${result.length} commands.`);
console.log(`Commands: ${updatedData.map((command) => command.name).join(', ')}`);
