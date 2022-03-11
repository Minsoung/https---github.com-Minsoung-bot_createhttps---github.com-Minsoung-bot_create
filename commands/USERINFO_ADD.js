const con = require('./mysql_db');

UserInfo_add = function(msg, Discord) {
    var sql = "";

    sql  = "SELECT COUNT(NICKNAME_D) AS COUNT, IP AS USER_IP, DROUGHTY_CD AS DROUGHTY";
    sql += " FROM SURVEY";
    sql += " WHERE NICKNAME_D = ?";

    var value = msg.member.user.username + "#" + msg.member.user.discriminator;
    
    con.query(sql, [value],function(err, result, fields) {
        if (err) throw err;
        
        if (result[0].COUNT == 0) {
            var board = {
                Title : "가입신청 실패"
              , Stirng_value : "설문지를 작성해주세요."
              , Color : "RED"
            }

            gfn_Send_Msg(msg, Discord, board);
            return;
        } else {
            var sql2 = "";
            var value2 = new Array;

            sql2  = "INSERT INTO USERINFO";
            sql2 += "(ID, USERNAME, DISCRIMINATOR, NICKNAME_S, NICKNAME_D, IP, CREATED)";
            sql2 += " VALUES";
            sql2 += "(?, ?, ?, ?, ?, ?, NOW())";

            value2[0] = msg.member.id;
            value2[1] = msg.member.user.username;
            value2[2] = msg.member.user.discriminator;
            value2[3] = msg.member.nickname;
            value2[4] = value;
            value2[5] = result[0].USER_IP;
        

            con.query(sql2, value2,function(err, result, fields) {
                if (err) throw err;

                var board = {
                    Title : "가입완료"
                  , Stirng_value : "가입이 완료되었습니다."
                  , Color : "RED"
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