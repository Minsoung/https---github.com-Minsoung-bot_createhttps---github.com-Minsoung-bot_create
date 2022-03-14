WarTimer =  function(msg, timer_name, Discord) {
    // 화요일, 토요일 20시 영토전 공지 
    var schedule = require('node-schedule');
    var run = new schedule.RecurrenceRule();

    if (timer_name == '영토전타이머') {
      run.dayOfWeek = [2,6];
      run.hour = 20;
      
      var timer = schedule.scheduleJob(run, function(){
        var board = {
            Title : "영토전공지"
          , Stirng_value : "영토전 한시간 전 입니다."
          , Color : "WHITE"
        }

        // msg.channel.id= '350127416997576704';
        gfn_Send_Msg(msg, Discord, board);
      });
  } else if (timer_name == '설문지타이머') {
    // 7시부터 22시 15시간 [13시, 19시]
      run.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
      run.hour = [13, 19];

      var timer = schedule.scheduleJob(run, function(){
        var board = {
            Title : "설문지공지"
          , Stirng_value : "설문지를 수정해주세요."
          , Color : "WHITE"
        }

        // msg.channel.id= '350127416997576704';
        gfn_Send_Msg(msg, Discord, board);
      });
  }
}


module.exports = {
    name : "타이머" 
  , description : "타이머추가" 
  , War_Timer_20(msg, timer_name, Discord) {
      WarTimer(msg, timer_name, Discord);
  }
}