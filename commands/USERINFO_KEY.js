const con = require('./mysql_db');

//$키발급 입력시 사용자 키 값 추가
UserInfo_key = function(msg, Discord) {
    var sql = "";

    sql  = "SELECT COUNT(ID) AS COUNT, USER_KEY AS USER_KEY";
    sql += " FROM USER_KEY";
    sql += " WHERE ID = ?";

    var value = msg.member.id;

    con.query(sql, [value],function(err, result, fields) {
        if (err) {
            console.log(err);
            con.handleDisconnect();
        } 

        var user_key = result[0].USER_KEY;

        if (result[0].COUNT == 0) {
            var sql2 = "";
            var value2 = new Array();
            
            sql2  = "INSERT INTO USER_KEY";
            sql2 += "(ID, USER_KEY, NICKNAME_D)";
            sql2 += " VALUES";
            sql2 += "(?, ?, ?)";

            value2[0] = msg.member.id;
            value2[1] = msg.member.id + msg.member.user.discriminator;

            if (gfn_isNull(msg.member.user.avatar)) {
                value2[1] += "nl";
            } else {    
                value2[1] += msg.member.user.avatar[0]
            }

            value2[2] = msg.member.user.username + "#" + msg.member.user.discriminator;
            
            con.query(sql2, value2,function(err, result, fields) {
                if (err) {
                    var board = {
                        Title : "키 발급이 되어있습니다"
                        , String_value : "키 값 : " + user_key + "\n\n 설문지를 작성해주세요.(설문지 수정시에도 필요합니다.)\n https://cf70-112-171-4-239.ngrok.io/key_confirm"
                        , Color : "RED"
                    }
                } else {
                    var board = {
                        Title : "키발급 완료"
                        , String_value : "키 디스코드 닉네임 :" + value2[2] + " \n\n 키 값 : " + value2[1] + "\n\n 설문지를 작성해주세요.(설문지 수정시에도 필요합니다.)\n https://cf70-112-171-4-239.ngrok.io/key_confirm"
                        , Color : "BLUE"
                    }

                    var board2 = {
                        Title : "키발급 완료"
                        , String_value : "개인 디스코드 메세지(DM)을 확인해주세요."
                        , Color : "BLUE"
                    }

                    gfn_Send_Msg(msg, Discord, board2);
                }

                gfn_Send_Msg_Dm(msg, Discord, board);
                return;
            });
        } else {
            var board = {
                Title : "키 발급이 되어있습니다"
                , String_value : "키 값 :" + user_key + "\n\n 설문지를 작성해주세요.(설문지 수정시에도 필요합니다.)\n https://cf70-112-171-4-239.ngrok.io/key_confirm"
                , Color : "RED"
            }

            gfn_Send_Msg_Dm(msg, Discord, board);
            return;
        }
    });
}

module.exports = {
    name : "키발급" 
  , description : "사용자 키" 
  , User_Key(msg, Discord) {
        UserInfo_key(msg, Discord);
    }
}