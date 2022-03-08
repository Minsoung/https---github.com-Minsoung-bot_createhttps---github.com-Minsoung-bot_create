
ufn_Send_Mag_Timer = function(msg, Discord, board) {
    const embed = new Discord.MessageEmbed()
    .setTitle(board.Title)
    .setDescription(board.Stirng_value)
    .setColor(board.Color)
    
    return msg.channel.send({embeds : [embed]});
}

module.exports = {
    name : "타이머종료-트위치"
  , description : "타이머"

  , Timer_Stop(msg,Discord,timerId) {
        var board = {
              Title : "Timer 종료"
            , Stirng_value : "타이머가 종료되었습니다."
            , Color : "WHITE"
        }   

        clearTimeout(timerId);

        ufn_Send_Mag_Timer(msg, Discord, board);
    }
}