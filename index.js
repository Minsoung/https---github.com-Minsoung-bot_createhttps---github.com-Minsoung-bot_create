const Discord = require('discord.js');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');
const {token ,prefix} = require('./config.json');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('js'));
const con = require('./commands/mysql_db');

client.commands = new Discord.Collection();

for (const file of commandFiles) {
    if (file == "mysql_db.js" || file == "google_db.js") continue;

    const command = require(`./commands/${file}`);
    console.log(command);
    client.commands.set(command.name, command);
}

client.once('ready', ()=>{
    console.log('보리 봇 준비 완료');
    //Schedule_Update();
})

client.on("error", (err) => {
    con.handleDisconnect();
});


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
  
    let timer_name = "";

    if (command == '영토전타이머' || command == '설문지타이머') { 
        timer_name = command;
        command = '타이머';
    }
    if (!client.commands.has(command)) return;

    if (command == '장비') {
        client.commands.get(command).User_job(msg, arms_name, Discord);
    } else if (command == '가입신청') {
        client.commands.get(command).User_Add(msg, Discord);
    } else if (command == '타이머') {
        client.commands.get(command).War_Timer_20(msg, timer_name, Discord);
    } else if (command == '키발급') {   
        client.commands.get(command).User_Key(msg, Discord);
    } else if (command == '참가') {
        if (msg.channelId == '897821651297775627' || msg.channelId == '986234708243406879') {
            client.commands.get(command).War_Fed_Add(msg, Discord);    
        } else {
            return msg.channel.send("영토전 채널 -> 참가조사에서 $참가를 입력해주세요."); 임시주석
        }
    } else if (command == '출석') {   
        if (msg.channelId == '897821651297775627' || msg.channelId == '986234708243406879') {
            client.commands.get(command).War_Fed_Attendance(msg, Discord);   
        } else {
            return msg.channel.send("영토전 채널 -> 참가조사에서 $출석를 입력해주세요."); // 임시주석
        }
    } else if (command == '도움말') {   
        client.commands.get(command).Discord_Help(msg, Discord);
    }

})

client.login(token);