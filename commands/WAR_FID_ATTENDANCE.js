const {google} = require( "googleapis");
const sheet_client = require('./google_db');
const google_Master = require('./google_config.json');
const con = require('./mysql_db');

// 영토전 참가자 출석 처리 
User_War_Fed_Attendance = function(msg, Discord) {
    var value = msg.member.id;
    var sql = "";

    sql  += " SELECT ID";
    sql  += " , NICKNAME_P";
    sql  += " , ATTENDANCE";
    sql  += " , DROUGHTY_NM";
    sql  += " FROM USER_WARLIST";
    sql  += " WHERE ID = ?";

    con.query(sql, [value],function(err, result, fields) {
        if (err) {
            console.log(err);
        } 

        console.log(result[0]);

        if (gfn_isNull(result[0]) ) {
            var board = {
                Title : "참가 확인"
              , String_value : "참가자 시트에 등록 되어있지않습니다.\n\n참가등록부터 해주세요.\n\n[$참가 <- 입력]"
              , Color : "GREEN"
          }

            gfn_Send_Msg(msg, Discord, board);
            return;
        } 

        var week_day = gfn_getDate("Day");
        var today_Hours = gfn_getDate("Hours");
        
        if (week_day == 2 || week_day == 6) {
            if (today_Hours >= 20 && today_Hours <= 22) {
                if (result[0].ATTENDANCE == "O") {
                    var board = {
                          Title : "출석 확인"
                        , String_value : `${msg.author}님은 출석이 되어있습니다.`
                        , Color : "RED"
                    }

                    gfn_Send_Msg(msg, Discord, board);
                } else {
                    var DROUGHTY = result[0].DROUGHTY_NM;
                    var USER_UD = result[0].ID;
                    var sql2 = "";
                    
                    sql2 += " UPDATE USER_WARLIST SET";
                    sql2 += " ATTENDANCE = 'O'";
                    sql2 += " WHERE ID = ?;";
                    sql2 += " INSERT INTO USER_ATTENDANCE";
                    sql2 += "(ID, DROUGHTY_NM, CREATED)";
                    sql2 += " VALUES";
                    sql2 += "(?, ?, NOW());";

                    var USER_ATT_ADD = new Array();
                    var count = 0;

                    USER_ATT_ADD[count++] = USER_UD;
                    USER_ATT_ADD[count++] = USER_UD;
                    USER_ATT_ADD[count++] = DROUGHTY;

                    con.query(sql2, USER_ATT_ADD,function(err, result, fields) {
                        var range_value = "";

                        if (DROUGHTY == "GoguryeoⅠ" || DROUGHTY == "GoguryeoⅡ" || DROUGHTY == "GoguryeoⅢ") { 
                            range_value = "참가자_ONE!";
                        } else {
                            range_value = "참가자_TOP!";
                        }
                        
                        ufn_sheet_Search(msg, Discord, range_value, USER_UD);
                    });
                }
            } else {
                var board = {
                      Title : "시간 확인"
                    , String_value : "출석 시간이 아닙니다."
                    , Color : "RED"
                }

                gfn_Send_Msg(msg, Discord, board);
            }
        } else {
            var board = {
                  Title : "날짜 확인"
                , String_value : "영토전 날짜가 아닙니다."
                , Color : "RED"
            }

            gfn_Send_Msg(msg, Discord, board);
            return;
        }
    
    });
}

// 구글 시트 값 변경
async function ufn_sheet_Search(msg, Discord, range_value, USER_UD) {
    const sheets = google.sheets( { version : "v4"} );

    var sheet_value = {
          spreadsheetId : google_Master.spreadsheetId
        , range : range_value + "A2:D"
        , auth  : sheet_client
        , majorDimension : google_Master.majorDimension_Row
    };

    const request = {
        spreadsheetId : sheet_value.spreadsheetId
      , range : sheet_value.range
      , auth : sheet_value.auth
      , majorDimension : sheet_value.majorDimension
  };

    const response = (await sheets.spreadsheets.values.get(request)).data;

    var User_Row = 0;

    for (var i = 0; i < response.values.length; i++) {
        if (response.values[i][0] == USER_UD) {
            User_Row = i + 2;
            break;
        }
    }

    const request2 = {
        spreadsheetId : google_Master.spreadsheetId
        , range : range_value + "D" + Number(User_Row)
        , auth : sheet_value.auth
        , valueInputOption : google_Master.valueInputOption
        , resource : { values : [["O"]]}
    };

    sheets.spreadsheets.values.update(request2);

    var board = {
        Title : "출석 성공"
        , String_value : `${msg.author}님 출석이 완료되었습니다.`
        , Color : "BLUE"
    }

    gfn_Send_Msg(msg, Discord, board);
}

module.exports = {
    name : "출석" 
  , description : "영토전출석" 
  , War_Fed_Attendance(msg, Discord) {
        User_War_Fed_Attendance(msg, Discord);
    }
}