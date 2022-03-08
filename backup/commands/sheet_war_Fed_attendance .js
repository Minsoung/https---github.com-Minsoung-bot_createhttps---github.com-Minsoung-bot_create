const {google} = require( "googleapis");
const keys = require("./chuno-user-list-665498e52880.json");

const sheet_client = new google.auth.JWT(
    keys.client_email
  , null
  , keys.private_key
  , ['https://www.googleapis.com/auth/spreadsheets']  // 사용자 시트 및 해당 속성에 대한 읽기/쓰기 액세스 허용
  );

var User_Info_att = "";
var User_Info_att2 = "";
var User_Nickname = "";
var User_Code = "";
var User_Row = "";
var User_Row2 = "";
var count_value = "";

this.scallback = "";

gfn_getDate = function(value) {
    var date = new Date();

    if (value == "Week") {
        return date.getDay();
    } else if (value == "Hours") {
        return date.getHours();
    } else if (value == "Minutes") {
        return date.getMinutes();
    } else {
        return false;
    }
}

gfn_isNull = function(value) {
    if (value == 'undefined' || value == "" || value == null || value == undefined || value == "null") {
        return true;
    }

    return false;
}

ufn_Send_Mag = function(msg, Discord, board) {
    const embed = new Discord.MessageEmbed()
    .setTitle(board.Title)
    .setDescription(board.Stirng_value)
    .setColor(board.Color)

    return msg.channel.send({embeds : [embed]});
}

ufn_callbck_War_Fed_Update = function(msg, Discord, sheet_value) {    
    const sheets = google.sheets( { version : "v4"} );
    const request = {
        spreadsheetId : sheet_value.spreadsheetId
        , range : sheet_value.range + Number(User_Row)
        , auth : sheet_value.auth
        , valueInputOption : sheet_value.valueInputOption
        , resource : { values : [ sheet_value.values ]}
    };

    sheets.spreadsheets.values.update(request);

    var board = {
          Title : "출석 성공"
        , Stirng_value : `${msg.author}님 출석이 완료되었습니다.`
        , Color : "BLUE"
    }

    ufn_Send_Mag(msg, Discord, board);
}

ufn_callbck_War_Fed_Count = function(msg, Discord, sheet_value) {    
    const sheets = google.sheets( { version : "v4"} );
    const request = {
        spreadsheetId : sheet_value.spreadsheetId
        , range : sheet_value.range
        , auth : sheet_value.auth
        , valueInputOption : sheet_value.valueInputOption
        , resource : { values : [ sheet_value.values ]}
    };

    sheets.spreadsheets.values.update(request);
}

async function User_War_list(msg,Discord,sheet_value,callback) {
    if (!gfn_isNull(callback)) {
        this.scallback = callback;
    }

    const sheets = google.sheets( { version : "v4"} );
    const request = {
          spreadsheetId : sheet_value.spreadsheetId
        , range : sheet_value.range
        , auth : sheet_value.auth
        , majorDimension : sheet_value.majorDimension
    };
    
    const response = (await sheets.spreadsheets.values.get(request)).data;

    eval(this.scallback+'(msg, Discord, response)');
}

User_War_Fed_Count_Check = function(msg, Discord, response) {
    var not_user = "O";
    var Find_Row = 0;
    User_Row2 = 0;

    if (!gfn_isNull(response.values)) {
        for (var i = 0; i < response.values.length; i++) {
            if (response.values[i][0] == User_Nickname || response.values[i][0] == User_Code) {
                User_Row2 = i+3;
                not_user = "X";
                break;
            } else {
                Find_Row = i+4;
            }
        }
    } else {
        Find_Row = 3;
    }

    var count = 0;
    User_Info_att2 = new Array();
    sheet_range = "";

    if (not_user == "O") {
        User_Info_att2[count++] = User_Code;
        User_Info_att2[count++] = User_Nickname;
        User_Info_att2[count++] = count_value;
        
        sheet_range = '참가횟수!A' + Number(Find_Row);
    } else {
        User_Info_att2[count++] = Number(response.values[i][2]) + Number(count_value);
        sheet_range = '참가횟수!C' + Number(User_Row2);
    }

    var sheet_value = {
          spreadsheetId : '1TdHsmEBNZehNT9C-KMG50Fw9jcEKJZ2NNn-S1hCENGE'
        , range : sheet_range
        , auth  : sheet_client
        , valueInputOption : 'USER_ENTERED'
        , values : User_Info_att2
    };

    ufn_callbck_War_Fed_Count(msg, Discord, sheet_value);
}

User_War_Fed_list_Check = function(msg, Discord, response) {
    User_Nickname = msg.member.nickname;
    User_Code = msg.member.user.username +'#'+msg.member.user.discriminator;
    User_Row = 0;

    if (gfn_isNull(User_Nickname)) {
        User_Nickname = msg.member.user.username;
    }

    if (gfn_isNull(response.values)) {
        var board = {
            Title : "등록 확인"
          , Stirng_value : "등록된 인원이 없습니다."
          , Color : "RED"
      }
      
        User_Info_att = "";
        User_Info_att2 = "";
        ufn_Send_Mag(msg, Discord, board); 
        return;
    }

    var not_user = "O";
    var attendance = "X";

    for (var i = 0; i < response.values.length; i++) {
        if (response.values[i][0] == User_Nickname || response.values[i][0] == User_Code) {
            var count = 0;
            User_Info_att = new Array();

            User_Row = i+3;
            User_Info_att[count++] = "O";
            attendance = response.values[i][2];
            not_user = "X";
            break;
        }
    }

    var week_day = gfn_getDate("Week");
    var today_Hours = gfn_getDate("Hours");

    if (not_user == "O") {
        var board = {
              Title : "참가 확인"
            , Stirng_value : "참가자 시트에 등록 되어있지않습니다.\n\n참가등록부터 해주세요.\n\n[$참가 <- 입력]"
            , Color : "GREEN"
        }
        
        User_Info_att = "";
        User_Info_att2 = "";
        ufn_Send_Mag(msg, Discord, board); 
        return;
    } else {
        if (week_day == 2 || week_day == 6) {
            if (today_Hours >= 20 && today_Hours <= 22) {
                if (attendance == "O") {
                    var board = {
                        Title : "출석 확인"
                      , Stirng_value : `${msg.author}님은 출석이 되어있습니다.`
                      , Color : "RED"
                    }
                    
                    User_Info_att = "";
                    User_Info_att2 = "";
                    ufn_Send_Mag(msg, Discord, board);
                    return;
                } 
                
                if (today_Hours == 20) {
                    count_value = 1;
                } else if (today_Hours >= 21) {
                    count_value = 0.5;
                }

                var sheet_value = {
                      spreadsheetId : '1TdHsmEBNZehNT9C-KMG50Fw9jcEKJZ2NNn-S1hCENGE'
                    , range : '참가자!C'
                    , auth  : sheet_client
                    , valueInputOption : 'USER_ENTERED'
                    , values : User_Info_att
                };

                var sheet_value2 = {
                      spreadsheetId : '1TdHsmEBNZehNT9C-KMG50Fw9jcEKJZ2NNn-S1hCENGE'
                    , range : '참가횟수!A3:C'
                    , auth  : sheet_client
                    , majorDimension : 'Rows'
                };

                ufn_callbck_War_Fed_Update(msg, Discord, sheet_value);
                User_War_list(msg, Discord, sheet_value2, "User_War_Fed_Count_Check");
            } else {
                var board = {
                      Title : "시간 확인"
                    , Stirng_value : "출석 시간이 아닙니다."
                    , Color : "RED"
                }

                User_Info_att = "";
                User_Info_att2 = "";

                ufn_Send_Mag(msg, Discord, board); 
                return;
            }
        } else {
            var board = {
                  Title : "날짜 확인"
                , Stirng_value : "영토전 날짜가 아닙니다."
                , Color : "RED"
            }
            
            User_Info_att = "";
            User_Info_att2 = "";

            ufn_Send_Mag(msg, Discord, board); 
            return;
        }
    }
}

module.exports = {
    name : "출석"
  , description : "영토전 출석관련"
  
  , Sheet_War_Fed_chk(msg, Discord) {
        var sheet_value = {
              spreadsheetId : '1TdHsmEBNZehNT9C-KMG50Fw9jcEKJZ2NNn-S1hCENGE'
            , range : '참가자!A3:AA'
            , auth  : sheet_client
            , majorDimension : 'Rows'
        };

        User_War_list(msg, Discord, sheet_value , "User_War_Fed_list_Check");
    }
}