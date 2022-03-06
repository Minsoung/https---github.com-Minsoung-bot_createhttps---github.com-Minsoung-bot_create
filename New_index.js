const Discord = require('discord.js');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    console.log(command);
    client.commands.set(command.name, command);
}

if (gfn_isNull("tt")) {
    console.log("true");
} else {
    console.log("false");
}