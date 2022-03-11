const con = require('./mysql_db');

UserInfo_add = function(msg, Discord) {
    var sql = "";

    sql  = "SELECT COUNT(NICKNAME_D) AS COUNT";
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
            console.log(1);
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