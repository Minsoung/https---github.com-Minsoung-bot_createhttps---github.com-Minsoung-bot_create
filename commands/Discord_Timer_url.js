gfn_isNull = function(value) {
    if (value == 'undefined' || value == "" || value == null || value == undefined || value == "null") {
        return true;
    }

    return false;
}

gfn_getDate = function(value) {
    var date = new Date();

    if (value == "Week") {
        return date.getDay();
    } else if (value == "Hours") {
        return date.getHours();
    } else if (value == "Minutes") {
        return date.getMinutes();
    } else {
        return false;
    }
}

ufn_Send_Mag_Timer = function(msg, Discord, board) {
    const embed = new Discord.MessageEmbed()
    .setTitle(board.Title)
    .setDescription(board.Stirng_value)
    .setColor(board.Color)
    
    return msg.channel.send({embeds : [embed]});
}

Timer_url = function(msg, Discord) {
    var hours = gfn_getDate("Hours");

    if (hours >= 8 && hours <= 22) {
        var board = {
            Title : "트위치 - 고라니"
            , Stirng_value : "https://www.twitch.tv/hxxhni1389"
            , Color : "WHITE"
        }   

        msg.channel.id= '350127416997576704';

        ufn_Send_Mag_Timer(msg, Discord, board);
    }
}

module.exports = {
    name : "타이머실행-트위치"
  , description : "타이머"

  , Timer_Call(msg,Discord) {
       return setInterval(Timer_url,7200000,msg,Discord);
    }
}