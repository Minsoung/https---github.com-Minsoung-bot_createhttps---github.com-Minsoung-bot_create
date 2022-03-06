const axios = require('axios');
const open = require('open');
const Discord = require('discord.js');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
const request = require('request');
const cheerio = require('cheerio');

const {token ,prefix} = require('./config.json');
const fs = require('fs');

var Del_value = "X";
let timerID = "";

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  console.log(command);
  client.commands.set(command.name, command);
}

gfn_isNull = function(value) {
  if (value == 'undefined' || value == "" || value == null || value == undefined || value == "null") {
      return true;
  }

  return false;
}

ufn_Send_Mag = function(msg, Discord, board) {
  const embed = new Discord.MessageEmbed()
  .setTitle(board.Title)
  .setDescription(board.Stirng_value)
  .setColor(board.Color)

  return msg.channel.send({embeds : [embed]});
}

client.once('ready', ()=>{
  console.log('보리 봇 준비 완료');
  const Guilds = client.guilds.cache.map(guild => guild.id);
  //console.log(client.guilds.cache);

  //console.log(Guilds);
})

async function getIpClient() {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

client.on('message', msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  
  const value = msg.content.slice(prefix.length).trim().split(/ +/);
  //cl_members = msg.guild.members.cache.filter(member => !member.user.bot);
  
  //console.log(cl_members.cache.filter(member => member.roles === '911093907373314149'));
  //var requestIp = require('request-ip');

  //let ip = requestIp.getClientIp(req);
  
  //const getIp = req => (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress);

  console.log("-------------------------");
  //console.log(getIpClient());
  //console.log(msg.member); 
  //console.log(msg.author);
  console.log(value);
  console.log(msg.content);
  console.log("-------------------------");
  /*
  open('https://api.ipify.org?format=json');
  */
 /*
  request("https://6112-112-171-4-239.ngrok.io/", function(error, response, html){
      if (error) {throw error};

      //var $ = cheerio.load(html);

      console.log(html);
  });*/

  let command = value.shift();
  let arms_name = "";

  if (command == "명령어") {
    var board = {
        Title : "도움말 요청"
      , Stirng_value : "$도움말로 검색해주세요."
      , Color : "YELLOW"
    }

    ufn_Send_Mag(msg, Discord, board);
    return;
  }

  if (command == '도순' || command == '관도' || command == '검방패' || command == '긴자루도끼' || command == '워해머' ||
      command == '창' || command == '야칼' || command == '화승총' || command == '장창' || command == '장궁' ||
      command == '단궁' || command == '쌍도' ) {
        console.log(command);

      arms_name = command;      
      command = '장비';
    }
  
  if (!client.commands.has(command)) return;


  if (Del_value == "O" && command != "삭제") {
      Del_value = "X";
  }

  if (command == '소환') {
    try {
      client.commands.get(command).execute(msg, value ,Discord);
    } catch (error) {
      console.error(error);
    }
  } else if (command == '추가') {
    if (msg.channel.guildId == '893078269597990953') { //arrow
      if (value[0] == 'undefined' || value[0] == "" || value[0] == null || value[0] == undefined) {
        return msg.channel.send(`별명을 입력해주세요`);
      }
    
      client.commands.get(command).Sheet_User_Add(msg, value[0],Discord);
    }
  } else if (command == '가문원') {
    if (msg.channel.guildId == '893078269597990953') { //arrow
      client.commands.get(command).Sheet_User(msg, value , Discord);
    }
  } else if (command == '장비') { // command == '보리'
    //client.commands.get(command).Sheet_User_job(msg, value , Discord);
    client.commands.get(command).User_job(msg, arms_name , Discord);
  } else if (command == '가문원시트') {
    if (msg.channel.guildId == '893078269597990953') { //arrow
      client.commands.get(command).Sheet_Call(msg, Discord);
    }
  } else if (command == '막사이전') {
    client.commands.get(command).Sheet_Call2(msg, Discord);
  } else if (command == '참가') {
    if (msg.channel.guildId == '893078269597990953') { //arrow
      if (msg.channelId != '897821651297775627') { //arrow 영토전 참가신청 
        return msg.channel.send("영토전 -> 참가신청에서 $참가를 입력해주세요.");
      }

      client.commands.get(command).Sheet_War_Fed(msg, Discord);
      //client.commands.get(command).Sheet_War(msg); //arrow
    } else  if (msg.channel.guildId == '336357727343345699') { //win
      if (msg.channelId != '884102726164828200') {
        return msg.channel.send("영토 채널 -> 영토전-참가조사에서 $참가를 입력해주세요.");
      }

      client.commands.get(command).Sheet_War_Fed(msg, Discord);
    }
  } else if (command == '참가자') {
    client.commands.get(command).Sheet_War_Fed_List(msg, Discord);
  } else if (command == '출석') {
    if (msg.channel.guildId == '893078269597990953') { //arrow
      if (msg.channelId != '897861940272042004') {
        return msg.channel.send("영토전 -> 영토전-출석에서 $출석을 입력해주세요.");
      }

      client.commands.get(command).Sheet_War_Fed_chk(msg, Discord) ;
      //client.commands.get(command).Sheet_War_chk(msg); //arrow
    } else  if (msg.channel.guildId == '336357727343345699') { //win
      if (msg.channelId != '884102726164828200') {
        return msg.channel.send("영토 채널 -> 영토전-참가조사에서 $출석을 입력해주세요.");
      }

      client.commands.get(command).Sheet_War_Fed_chk(msg, Discord) ;
    }
  } else if (command == '삭제') {
    if (msg.member.user == '246937082415546370' || msg.member.user == '614243699785990151' ||
       msg.member.user == '405651542113255455' || msg.member.user == '345933087286362114') {
        if (Del_value == "X") {
          Del_value = "O";
          return msg.channel.send("시트내용 제거를 원하시면 한번 더 $삭제를 입력해주세요.");
        } else {
          Del_value = "X";
          client.commands.get(command).Sheet_War_Fed_Del(msg, Discord) ;
        }
    } else {
        var board = {
            Title : "삭제 권한"
          , Stirng_value : "권한이 없습니다."
          , Color : "RED"
        }

        ufn_Send_Mag(msg, Discord, board);
        return;
    }
  } else if (command == '타이머실행-트위치') {
    if (msg.member.user == '246937082415546370' || msg.member.user == '614243699785990151' ||
        msg.member.user == '405651542113255455' || msg.member.user == '345933087286362114') {
          if (!gfn_isNull(timerID)) {
            var board = {
                Title : "Timer 실행중"
              , Stirng_value : "타이머가 이미 실행중입니다."
              , Color : "RED"
            }
      
            ufn_Send_Mag(msg, Discord, board);
            return;
          }

          var board = {
              Title : "Timer 실행"
            , Stirng_value : "타이머가 실행되었습니다."
            , Color : "WHITE"
          }
  
          ufn_Send_Mag(msg, Discord, board);

          timerID = client.commands.get(command).Timer_Call(msg, Discord) ;
        } else {
          var board = {
              Title : "타이머 권한"
            , Stirng_value : "권한이 없습니다."
            , Color : "RED"
          }
  
          ufn_Send_Mag(msg, Discord, board);
          return;
      }
  } else if (command == '타이머종료-트위치') {
    if (gfn_isNull(timerID)) {
      var board = {
          Title : "Timer 없음"
        , Stirng_value : "실행된 타이머가 없습니다."
        , Color : "RED"
      }

      ufn_Send_Mag(msg, Discord, board);
      return;
    }

    if (msg.member.user == '246937082415546370' || msg.member.user == '614243699785990151' ||
        msg.member.user == '405651542113255455' || msg.member.user == '345933087286362114') {
          client.commands.get(command).Timer_Stop(msg, Discord, timerID) ;
    } else {
      var board = {
          Title : "타이머 권한"
        , Stirng_value : "권한이 없습니다."
        , Color : "RED"
      }

      ufn_Send_Mag(msg, Discord, board);
      return;
    }
  } else if (command == '채널목록') {
    client.commands.get(command).Channels_List_call(msg, Discord);
  } else if (command == '도움말') {
    client.commands.get(command).Sheet_Help(msg, Discord);
  }
})

client.login(token);



  //console.log(msg.channel.guildId);
  //console.log(msg.channel.id);
  // console.log(msg.member.user.username); 
  // console.log(msg.member.user.discriminator);
  //console.log(msg.member);
  //console.log(msg.channel.guild.roles.roles);
  //console.log(msg.channel.roles);