const Discord = require('discord.js');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');
const {token ,prefix} = require('./config.json');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('js'));

client.commands = new Discord.Collection();

for (const file of commandFiles) {
    if (file == "mysql_db.js") continue;

    const command = require(`./commands/${file}`);
    console.log(command);
    client.commands.set(command.name, command);
}

client.once('ready', ()=>{
    console.log('보리 봇 준비 완료');
})


client.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  
    const value = msg.content.slice(prefix.length).trim().split(/ +/);

    console.log("-------------------------");
    console.log(msg.member); 
    console.log(value);
    console.log(msg.content);
    console.log("-------------------------");

    let command = value.shift();
    let arms_name = "";

    if (command == '도순' || command == '관도' || command == '검방패' || command == '긴자루도끼' || command == '워해머' ||
        command == '창' || command == '야칼' || command == '화승총' || command == '장창' || command == '장궁' ||
        command == '단궁' || command == '쌍도' ) {
        console.log(command);

        arms_name = command;      
        command = '장비';
    }
  
    if (!client.commands.has(command)) return;

    if (command == '장비') {
        client.commands.get(command).User_job(msg, arms_name, Discord);
    } else if (command == '가입신청') {
        client.commands.get(command).User_Add(msg, Discord);
    }

})

client.login(token);