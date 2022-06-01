const con = require('./mysql_db');

// $가입신청시 사용자 추가 
UserInfo_add = function(msg, Discord) {
    var sql = "";

    sql  = "SELECT COUNT(NICKNAME_D) AS COUNT, IP AS USER_IP, DROUGHTY_CD AS DROUGHTY";
    sql += " FROM SURVEY";
    sql += " WHERE ID = ?";

    //var value = msg.member.user.username + "#" + msg.member.user.discriminator;
    var value = msg.member.id;
    
    con.query(sql, [value],function(err, result, fields) {
        if (err) throw err;

        var DROUGHTY_VALUE = result[0].DROUGHTY;

        if (result[0].COUNT == 0) {
            var board = {
                Title : "가입신청 실패"
              , String_value : "설문지를 작성해주세요. 혹은 $키발급부터 해주세요. \n https://6112-112-171-4-239.ngrok.io/key_confirm"
              , Color : "RED"
            }

            gfn_Send_Msg(msg, Discord, board);
            return;
        } else {
            var sql2 = "";
            var value2 = new Array();

            sql2  = "INSERT INTO USERINFO";
            sql2 += "(ID, USERNAME, DISCRIMINATOR, NICKNAME_S, NICKNAME_D, IP, CREATED)";
            sql2 += " VALUES";
            sql2 += "(?, ?, ?, ?, ?, ?, NOW())";
            
            value2[0] = msg.member.id;
            value2[1] = msg.member.user.username;
            value2[2] = msg.member.user.discriminator;
            value2[3] = msg.member.nickname;
            value2[4] = msg.member.user.username + "#" + msg.member.user.discriminator;
            value2[5] = result[0].USER_IP;
        
            con.query(sql2, value2,function(err, result, fields) {
                if (err) {
                    var board = {
                        Title : "이미 등록된 사용자입니다."
                        , String_value : "이미 가입이 완료된 사용자입니다."
                        , Color : "RED"
                    }
                } else {
                    var board = {
                        Title : "가입완료"
                        , String_value : "가입이 완료되었습니다."
                        , Color : "BLUE"
                    }

                    var DROUGHTY_NAME = "";
                
                    if (DROUGHTY_VALUE == 1 || DROUGHTY_VALUE == 2 || DROUGHTY_VALUE == 3) {
                        DROUGHTY_NAME = "Goguryeo[가문원]";
                    } else if (DROUGHTY_VALUE == 4) {
                        DROUGHTY_NAME = "전설[가문원]";
                    } else if (DROUGHTY_VALUE == 5) {
                        DROUGHTY_NAME = "Bretonnia[가문원]";
                    } else if (DROUGHTY_VALUE == 6) {
                        DROUGHTY_NAME = "HEAVEN[가문원]";
                    }
                    
                    //msg.member.roles.remove(msg.guild.roles.cache.find(c => c.name === "가입대기").id); // 사용자 가입대기 역할 제거 
                    //msg.member.roles.add(msg.guild.roles.cache.find(c => c.name === DROUGHTY_NAME).id); // 해당 디스코드에서 가문에 해당하는 역할 추가
                }

                gfn_Send_Msg(msg, Discord, board);
                return;
            });
        }
    });
}

module.exports = {
    name : "가입신청" 
  , description : "사용자정보 추가" 
  , User_Add(msg, Discord) {
        UserInfo_add(msg, Discord);
    }
}