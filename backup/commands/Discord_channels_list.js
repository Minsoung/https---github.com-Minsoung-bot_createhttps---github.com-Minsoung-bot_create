
ufn_Send_Mag = function(msg, Discord, board) {
    const embed = new Discord.MessageEmbed()
    .setTitle(board.Title)
    .setDescription(board.Stirng_value)
    .setColor(board.Color)

    return msg.channel.send({embeds : [embed]});
}

ufn_List_call_Win = function(msg, Discord) {
    const channels = msg.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT');
    var parentId = channels.map(channels => channels.parentId);
    var uniqArray = Array.from(new Set(parentId));
    var String_value = "";

    for (var i = 0; i <uniqArray.length; i++) {
        if (!gfn_isNull(uniqArray[i]) && uniqArray[i] != "886301486986952784") {
            String_value += "<#"+uniqArray[i]+">\n";
            var Id = channels.filter(c => c.parentId === uniqArray[i]).map(channels => channels.id);

            for (var j = 0; j < Id.length; j++) {
                String_value += "<#"+Id[j]+">\n";
            }

            String_value += "\n";
        }
    }

    var board = {
          Title : "채널목록"
        , Stirng_value : String_value
        , Color : "WHITE"
    }

    ufn_Send_Mag(msg, Discord, board);
}

ufn_List_call_arrow = function(msg, Discord) {
    const channels = msg.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT');
    var parentId = channels.map(channels => channels.parentId);
    var uniqArray = Array.from(new Set(parentId));
    var String_value = "";

    for (var i = 0; i <uniqArray.length; i++) {
        if (!gfn_isNull(uniqArray[i]) && uniqArray[i] != "894160721091371080") {
            String_value += "<#"+uniqArray[i]+">\n";
            var Id = channels.filter(c => c.parentId === uniqArray[i]).map(channels => channels.id);

            for (var j = 0; j < Id.length; j++) {
                String_value += "<#"+Id[j]+">\n";
            }

            String_value += "\n";
        }
    }

    var board = {
          Title : "채널목록"
        , Stirng_value : String_value
        , Color : "YELLOW"
    }

    ufn_Send_Mag(msg, Discord, board);
}

module.exports = {
    name : "채널목록"
  , description : "채널리스트"

  , Channels_List_call(msg,Discord) {
        if (msg.channel.guildId == "336357727343345699") {
            ufn_List_call_Win(msg,Discord);
        } else if (msg.channel.guildId == "893078269597990953") {
            ufn_List_call_arrow(msg,Discord);
        }
    }
}