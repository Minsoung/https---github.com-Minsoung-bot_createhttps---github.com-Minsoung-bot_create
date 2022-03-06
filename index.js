const Discord = require('discord.js');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');
const {token ,prefix} = require('./config.json');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('js'));

client.commands = new Discord.Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    console.log(command);
    client.commands.set(command.name, command);
}

client.once('ready', ()=>{
    console.log('보리 봇 준비 완료');
  //const Guilds = client.guilds.cache.map(guild => guild.id);
  //console.log(client.guilds.cache);

  //console.log(Guilds);
})


client.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  
    const value = msg.content.slice(prefix.length).trim().split(/ +/);

    console.log("-------------------------");
    console.log(value);
    console.log(msg.content);
    console.log("-------------------------");
  
    let command = value.shift();
    let arms_name = "";


    var board = {
        Title : "TEST"
      , Stirng_value : "TEST"
      , Color : "YELLOW"
    }

  ufn_Send_Mag(msg, Discord, board);

})

client.login(token);