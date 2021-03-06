const {google} = require( "googleapis");
const sheet_client = require('./google_db');
const google_Master = require('./google_config.json');
const con = require('./mysql_db');

// 영토전 참가자 추가
User_War_Fed_Add = function(msg, Discord) {
    var sql = "";

    sql  = " SELECT M.ID ";
    sql += " , M.NICKNAME_D";
    sql += " , S.NICKNAME_P";
    sql += " , S.LEVEL";
    sql += " , (SELECT COM_CD_NM FROM S_POSITION WHERE S.POSITION_CD = COM_CD) AS POSITION_NM";
    sql += " , (SELECT COM_CD_NM FROM DROUGHTY WHERE S.DROUGHTY_CD = COM_CD) AS DROUGHTY_NM";
    sql += " , S.PREFERENCE_ARMY1";
    sql += " , S.PREFERENCE_ARMY2";
    sql += " , S.PREFERENCE_ARMY3";
    sql += " , S.DROUGHTY_CD";
    sql += "   FROM USERINFO M , SURVEY S";
    sql += "   WHERE M.ID = S.ID";
    sql += "   AND M.ID = ?";
    sql += "   ORDER BY M.ID;";
    sql += " SELECT A.ID";
    sql += " 	  , IFNULL(A.ARMY_CD, B.COM_CD) AS ARMY_CD";
    sql += "      , (SELECT COM_CD_NM FROM ARMY WHERE IFNULL(A.ARMY_CD, B.COM_CD) = COM_CD) AS ARMY_NM";
    sql += "      , IFNULL(A.PROFICIENCY_CD, 0) AS PROFICIENCY_CD";
    sql += "      , (SELECT COM_CD_NM FROM PROFICIENCY WHERE IFNULL(A.PROFICIENCY_CD, 0) = COM_CD) AS PROFICIENCY_NM";
    sql += "  FROM ( SELECT ID";
    sql += " 	  		   , ARMY_CD";
    sql += "               , PROFICIENCY_CD";
    sql += "            FROM USER_PROFICIENCY Y";
    sql += "           WHERE Y.ID = ?";
    sql += "             AND Y.ARMY_CD > 399) A RIGHT JOIN ARMY B ON A.ARMY_CD = B.COM_CD";
    sql += "           WHERE B.COM_CD > 399";
    sql += "           ORDER BY B.COM_CD;";
    /*
    sql += " SELECT ID";
    sql += " ,  ARMY_CD";
    sql += " , (SELECT COM_CD_NM FROM ARMY WHERE Y.ARMY_CD = COM_CD) AS ARMY_NM";
    sql += " , PROFICIENCY_CD";
    sql += " , (SELECT COM_CD_NM FROM PROFICIENCY WHERE Y.PROFICIENCY_CD = COM_CD) AS PROFICIENCY_NM";
    sql += "   FROM USER_PROFICIENCY Y";
    sql += "   WHERE Y.ID = ?";
    sql += "   AND Y.ARMY_CD > 399";
    sql += "   ORDER BY Y.ID, Y.ARMY_CD;";*/

    var value = msg.member.id;

    con.query(sql, [value,value],function(err, result, fields) {
        if (err) {
            console.log(err);
        } 

        if (gfn_isNull(result[0][0]) ) {
            var board = {
                Title : "신청 실패"
              , String_value : "설문지를 작성해주세요.\n\h https://cf70-112-171-4-239.ngrok.io/key_confirm"
              , Color : "RED"
            }

            gfn_Send_Msg(msg, Discord, board);
            return;
        } else {
            var DROUGHTY = result[0][0].DROUGHTY_CD;   // 가문
            var USER_WAR_ADD = new Array();
            var count = 0;
            var USER_WAR_LIST = result[1];

            USER_WAR_ADD[count++] = result[0][0].ID // 디스코드 아이디
            USER_WAR_ADD[count++] = result[0][0].NICKNAME_D // 디스코드 닉네임
            USER_WAR_ADD[count++] = result[0][0].NICKNAME_P // 게임 아이디
            USER_WAR_ADD[count++] = 'X' // 출석
            USER_WAR_ADD[count++] = result[0][0].LEVEL // 게임레벨
            USER_WAR_ADD[count++] = result[0][0].POSITION_NM // 영토전 포지션
            USER_WAR_ADD[count++] = result[0][0].DROUGHTY_NM // 가문
            USER_WAR_ADD[count++] = result[0][0].PREFERENCE_ARMY1 + "," + result[0][0].PREFERENCE_ARMY2 + "," + result[0][0].PREFERENCE_ARMY3; // 선호병종
            

            //console.log(USER_WAR_ADD);
            var sql2 = "";

            sql2  = "INSERT INTO USER_WARLIST";
            sql2 += "(ID, NICKNAME_D, NICKNAME_P, ATTENDANCE, LEVEL, POSITION_NM, DROUGHTY_NM)";
            sql2 += " VALUES";
            sql2 += "(?, ?, ?, ?, ?, ?, ?);";

            con.query(sql2, USER_WAR_ADD,function(err, result, fields) {
                if (err) {
                    var board = {
                        Title : "참가 확인"
                        , String_value : `${msg.author}님은 영토전 등록되어있습니다.`
                        , Color : "RED"
                    }

                    gfn_Send_Msg(msg, Discord, board);
                    return;
                } else {
                    for (var i in USER_WAR_LIST) {
                        for (var j in USER_WAR_LIST[i]) {
                            if (j == "PROFICIENCY_NM") {
                                USER_WAR_ADD[count++] = USER_WAR_LIST[i][j];
                            }
                        }
                    }
                    
                    var sql3 = "";
                    var range_value = "";

                    sql3  = "SELECT COUNT(ID) + 1 AS COUNT";
                    sql3 += " FROM USER_WARLIST";

                    if (DROUGHTY == 1 || DROUGHTY == 2 || DROUGHTY == 3) {
                        sql3 += " WHERE DROUGHTY_NM IN ('GoguryeoⅠ','GoguryeoⅡ','GoguryeoⅢ');";
                        range_value = "참가자_ONE!A";
                    } else {
                        sql3 += " WHERE DROUGHTY_NM IN ('전설','Bretonnia','Heaven');";
                        range_value = "참가자_TOP!A";
                    }

                    con.query(sql3, [],function(err, result, fields) {
                        if (err) throw err;

                        var sheet_value = {
                            spreadsheetId : google_Master.spreadsheetId
                            , range : range_value
                            , auth  : sheet_client
                            , valueInputOption : google_Master.valueInputOption
                            , values : USER_WAR_ADD
                        };
                        
                        const sheets = google.sheets( { version : "v4"} );
                        const request = {
                            spreadsheetId : sheet_value.spreadsheetId
                            , range : sheet_value.range + Number(result[0].COUNT)
                            , auth : sheet_value.auth
                            , valueInputOption : sheet_value.valueInputOption
                            , resource : { values : [ sheet_value.values ]}
                        };
                    
                        sheets.spreadsheets.values.update(request);

                        var board = {
                            Title : "참여 성공"
                            , String_value : `${msg.author}님 영토전 등록되었습니다.`
                            , Color : "BLUE"
                        }
    
                        gfn_Send_Msg(msg, Discord, board);
                        return;
                    });
                }
            });
        }
    });
}

module.exports = {
    name : "참가" 
  , description : "영토전참가" 
  , War_Fed_Add(msg, Discord) {
        User_War_Fed_Add(msg, Discord);
    }
}