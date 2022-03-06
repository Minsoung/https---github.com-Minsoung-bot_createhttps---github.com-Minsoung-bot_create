module.exports = {
    name : "도움말"
  , description : "도움말호출"

  , Sheet_Help(msg,Discord) {
        var Stirng_value  = "\n기본적으로 $이거 사용해야합니다.\n\n";
            Stirng_value += "추가               : 가문원 추가 [Arrow 가문 기능] \n";
            Stirng_value += "가문원             : 현재 시트에 추가된 가문원리스트 [Arrow 가문 기능] \n";
            Stirng_value += "가문원시트         : 가문원 병종시트 및 영토전 시트 링크 [Arrow 가문 기능]\n";
            Stirng_value += "막사이전           : 막사이전Tip PPT 링크\n";
            Stirng_value += "장수무기           : ex)$관도, $검방패 검색 시 설명\n";
            Stirng_value += "참가               : 영토전 참여\n";
            Stirng_value += "참가자             : 영토전 참여자 리스트\n";
            Stirng_value += "출석               : 영토전 당일날 출석\n";
            Stirng_value += "삭제               : 영토전 참여자 시트 정리\n";
            Stirng_value += "채널목록           : 해당 디스코드 채널 목록\n";
            Stirng_value += "타이머실행-트위치  : 트위치 타이머실행 - 권한자만 가능 \n";
            Stirng_value += "타이머종료-트위치 : 트위치 타이머 종료 - 권한자만 가능\n";
            //Stirng_value += "\n";
            //Stirng_value += "\n";
            //Stirng_value += "\n";
            //Stirng_value += "\n";
            //Stirng_value += "\n";
            //Stirng_value += "\n";
            //Stirng_value += "\n";

        const embed = new Discord.MessageEmbed()
            .setTitle("도움말")
            .setDescription(Stirng_value)
            .setColor("WHITE")

        return msg.channel.send({embeds : [embed]});
    }
}