module.exports = {
    name : "도움말"
  , description : "도움말호출"

  //padEnd(20,"\u00a0")

  , Discord_Help(msg,Discord) {
        var Stirng_value = "$키발급 : 디스코드 가입시 설문지에 필요한 키 값을 보내줍니다.\n\n";
            Stirng_value += "$가입신청 : 설문지 제출하기가 완료후 디스코드채팅방에 작성 시 자동으로 역할이 들어가며 디스코드를 사용가능 \n\n";
            Stirng_value += "$참가 : 영토전 채널 -> 영토전-참가조사에서 $참가로 사용이 가능하며 입력 시 영토전참여가 가능해집니다. \n\n";
            Stirng_value += "$출석 : 영토전 채널 -> 영토전-참가조사에서 $출석으로 사용이 가능하며 입력 시 당일영토전 참가파악이 가능합니다. \n\n";
            Stirng_value += "장수장비 : 장수장비에 관련하여 검색시 해당 장비에 설명이 나옵니다. \n";
            Stirng_value += "\u00a0-\u00a0장비 입력 ex) $도순, $관도, $검방패, $긴자루도끼, $워해머, $창,\n \u00a0$야칼, $화승총, $장창, $장궁, $단궁, $쌍도 \n\n";

/*            Stirng_value += "가문원             : 현재 시트에 추가된 가문원리스트 [Arrow 가문 기능] \n";
            Stirng_value += "가문원시트         : 가문원 병종시트 및 영토전 시트 링크 [Arrow 가문 기능]\n";
            Stirng_value += "막사이전           : 막사이전Tip PPT 링크\n";
            Stirng_value += "장수무기           : ex)$관도, $검방패 검색 시 설명\n";
            Stirng_value += "참가               : 영토전 참여\n";
            Stirng_value += "참가자             : 영토전 참여자 리스트\n";
            Stirng_value += "출석               : 영토전 당일날 출석\n";
            Stirng_value += "삭제               : 영토전 참여자 시트 정리\n";
            Stirng_value += "채널목록           : 해당 디스코드 채널 목록\n";
            Stirng_value += "타이머실행-트위치  : 트위치 타이머실행 - 권한자만 가능 \n";
            Stirng_value += "타이머종료-트위치 : 트위치 타이머 종료 - 권한자만 가능\n";*/

        const embed = new Discord.MessageEmbed()
            .setTitle("도움말")
            .setDescription(Stirng_value)
            .setColor("WHITE")

        return msg.channel.send({embeds : [embed]});
    }
}