// Null 확인 값이 null이면 true 아니면 false 값을 반환
// 김민성
gfn_isNull = function(value) {
    if (value == 'undefined' || value == "" || value == null || value == undefined || value == "null") {
        return true;
    }

    return false;
}

// 날짜 값 가져오기 날 / 시간 / 분
// 김민성
gfn_getDate = function(value) {
    var date = new Date();

    if (value == "Day") {
        return date.getDay();
    } else if (value == "Hours") {
        return date.getHours();
    } else if (value == "Minutes") {
        return date.getMinutes();
    } else {
        return false;
    }
}

gfn_nvlChage = function(value, chagevalue) {
    var rtVal = "";

    if (gfn_isNull(value)) {
        if (gfn_isNull(chagevalue)) {
            rtVal = "";
        } else {
            rtVal = chagevalue;
        }
    } else {
        rtVal = value;
    }

    return rtVal;
}

// 디스코드에 메세지 값 설정 후 현재 있는 채널에 메세지 출력
// 김민성
gfn_Send_Msg = function(msg, Discord, board) {
    const embed = new Discord.MessageEmbed()
    .setTitle(board.Title)
    .setDescription(board.Stirng_value)
    .setColor(board.Color)

    return msg.channel.send({embeds : [embed]});
}


module.exports = {
    name : "함수" 
  , description : "함수 모음" 
}