WarTimer =  function(msg, Discord) {
    // 화요일 토요일 20시 영토전 공지 
    var schedule = require('node-schedule');
    var run = new schedule.RecurrenceRule();
    run.dayOfWeek = [2,6];
    run.hour = 20;

    var timer = schedule.scheduleJob(run, function(){
        var board = {
            Title : "영토전공지"
          , Stirng_value : "영토전 한시간 전 입니다."
          , Color : "WHITE"
        }

        //msg.channel.id= '350127416997576704';
        gfn_Send_Msg(msg, Discord, board);
    });
}


module.exports = {
    name : "영토전타이머" 
  , description : "타이머추가" 
  , War_Timer_20(msg, Discord) {
        WarTimer(msg, Discord);
  }
}