const {google} = require( "googleapis");
const keys = require("./chuno-user-list-665498e52880.json");

var User_Info = "";
var User_Info2 = "";
var User_Nickname = "";
var User_Code = "";

this.scallback = "";

const sheet_client = new google.auth.JWT(
    keys.client_email
  , null
  , keys.private_key
  , ['https://www.googleapis.com/auth/spreadsheets']  // 사용자 시트 및 해당 속성에 대한 읽기/쓰기 액세스 허용
);

gfn_isNull = function(value) {
    if (value == 'undefined' || value == "" || value == null || value == undefined || value == "null") {
        return true;
    }

    return false;
}

ufn_callbck_War_Insert = function(msg, Discord, sheet_value, Row, Mag_Chk) {    
    const sheets = google.sheets( { version : "v4"} );
    const request = {
        spreadsheetId : sheet_value.spreadsheetId
        , range : sheet_value.range + Number(Row)
        , auth : sheet_value.auth
        , valueInputOption : sheet_value.valueInputOption
        , resource : { values : [ sheet_value.values ]}
    };

    sheets.spreadsheets.values.update(request);

    if (Mag_Chk == "O") {
        var board = {
            Title : "참여 성공"
            , Stirng_value : `${msg.author}님 영토전 등록되었습니다.`
            , Color : "BLUE"
        }

        ufn_Send_Mag(msg, Discord, board);
    }
}

ufn_Send_Mag = function(msg, Discord, board) {
    const embed = new Discord.MessageEmbed()
        .setTitle(board.Title)
        .setDescription(board.Stirng_value)
        .setColor(board.Color)

    return msg.channel.send({embeds : [embed]});
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

User_War_list_Check = function(msg, Discord, response) {
    User_Nickname = msg.member.nickname;
    User_Code = msg.member.user.username +'#'+msg.member.user.discriminator;

    if (gfn_isNull(User_Nickname)) {
        User_Nickname = msg.member.user.username;
    }

    var not_user = "X";

    if (gfn_isNull(response.values)) {
        var board = {
              Title : "등록 확인"
            , Stirng_value : "등록된 인원이 없습니다."
            , Color : "RED"
        }
        User_Info = "";
        User_Info2 = "";
        ufn_Send_Mag(msg, Discord, board); 
        return;
    }

    for (var i = 0; i < response.values.length; i++) {
        if (response.values[i][3] == User_Nickname || response.values[i][3] == User_Code) {
            var count = 0;
            var count2 = 0;

            User_Info = new Array();
            User_Info2 = new Array();

            User_Info[count++] = response.values[i][3];
            User_Info[count++] = response.values[i][2];
            User_Info[count++] = "X";
            User_Info[count++] = response.values[i][4];
            User_Info[count++] = response.values[i][5];
            User_Info[count++] = response.values[i][6];

            User_Info2[count2++] = "X";
            User_Info2[count2++] = response.values[i][3];
            User_Info2[count2++] = response.values[i][2];
            User_Info2[count2++] = response.values[i][4];
            User_Info2[count2++] = response.values[i][5];
            User_Info2[count2++] = response.values[i][6];

            if (response.values[i][7] == "난 다 가졌다.") {
                for (var j = 0; j < 21; j++) {
                    User_Info[count++] = "만렙";
                    User_Info2[count2++] = "만렙";
                }
            } else {
                if (response.values[i].length == 8) {
                    for (var j = 0; j < 21; j++) {
                        User_Info[count++] = " ";
                        User_Info2[count2++] = " ";
                    }
                } else {
                    for (var j = 8; j < response.values[i].length; j++) {
                        var value = response.values[i][j];

                        if (gfn_isNull(value)) {
                            value = " ";
                        }

                        User_Info[count++] = value;
                        User_Info2[count2++] = value;
                    }
                }
            }

            not_user = "O";
            break;
        }
    }
    
    if (!gfn_isNull(User_Info2)) {
        User_Info2.splice(0,2);
    }

    if (not_user == "O") {
        var sheet_value = {
            spreadsheetId : '1TdHsmEBNZehNT9C-KMG50Fw9jcEKJZ2NNn-S1hCENGE'
          , range : '참가자!A3:AA'
          , auth  : sheet_client
          , majorDimension : 'Rows'
        };

        User_War_list(msg, Discord, sheet_value , "User_War_list_Part_Check");
    } else if (not_user == "X") {
        var board = {
              Title : "참가 실패"
            , Stirng_value : `${msg.author}님 설문지 작성을 안하셨거나 디스코드 닉네임이 다릅니다. \n\n[디스코드 닉네임란은 디스코드 별명 혹은 디스코드 아이디를 작성해주세요.\n그 이후에 $참가를 입력해주세요.]\n\n▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼\n\n https://docs.google.com/forms/d/1Ne934g3tG9_O182IuoMcC1kQ1HemKE3kZPGndNrNTC0/viewform?edit_requested=true`
            , Color : "GREEN"
        }

        User_Info = "";
        User_Info2 = "";
        ufn_Send_Mag(msg, Discord, board);
        return;
    }
}

User_War_list_Part_Check = function(msg, Discord, response) {
    if (gfn_isNull(response.values)) {
        var sheet_value = {
              spreadsheetId : '1TdHsmEBNZehNT9C-KMG50Fw9jcEKJZ2NNn-S1hCENGE'
            , range : '참가자!A'
            , auth  : sheet_client
            , valueInputOption : 'USER_ENTERED'
            , values : User_Info
        };

        var sheet_value2 = {
              spreadsheetId : '1TdHsmEBNZehNT9C-KMG50Fw9jcEKJZ2NNn-S1hCENGE'
            , range : '파티편성!J'
            , auth  : sheet_client
            , valueInputOption : 'USER_ENTERED'
            , values : User_Info2
        };

        User_Info2.unshift('=IFERROR(VLOOKUP(L3,$C:$H,6,0),"파티없음")');
        User_Info2.unshift(`=IF(VLOOKUP(L3,'참가자'!$B:$C,2,FALSE)="O",TRUE,FALSE)`);
        
        ufn_callbck_War_Insert(msg, Discord, sheet_value, 3, "X");
        ufn_callbck_War_Insert(msg, Discord, sheet_value2, 3, "O");
    } else {
        var find_user = "X";

        for (var i = 0; i < response.values.length; i++) {
            
            if (response.values[i][0] == User_Nickname || response.values[i][0] == User_Code ) {
                find_user = "O";
                break;
            }
        }
        
        if (find_user == "O") {
            var board = {
                Title : "참가 확인"
                , Stirng_value : `${msg.author}님은 영토전 등록되어있습니다.`
                , Color : "RED"
            }
            
            User_Info = "";
            User_Info2 = "";
            ufn_Send_Mag(msg, Discord, board);
            return;
        } else {
            var sheet_value = {
                  spreadsheetId : '1TdHsmEBNZehNT9C-KMG50Fw9jcEKJZ2NNn-S1hCENGE'
                , range : '참가자!A'
                , auth  : sheet_client
                , valueInputOption : 'USER_ENTERED'
                , values : User_Info
            };

            var sheet_value2 = {
                  spreadsheetId : '1TdHsmEBNZehNT9C-KMG50Fw9jcEKJZ2NNn-S1hCENGE'
                , range : '파티편성!J'
                , auth  : sheet_client
                , valueInputOption : 'USER_ENTERED'
                , values : User_Info2
            };

            User_Info2.unshift('=IFERROR(VLOOKUP(L'+ Number(response.values.length+Number(3)) + ',$C:$H,6,0),"파티없음")');
            User_Info2.unshift("=IF(VLOOKUP(L" + Number(response.values.length+Number(3)) + `,'참가자'!$B:$C,2,FALSE)="O",TRUE,FALSE)`);

            ufn_callbck_War_Insert(msg, Discord, sheet_value, response.values.length+Number(3), "X");
            ufn_callbck_War_Insert(msg, Discord, sheet_value2, response.values.length+Number(3), "O");
        }  
    }
}

module.exports = {
    name : "참가"
  , description : "영토전 참가관련"

  , Sheet_War_Fed(msg,Discord) {
        var sheet_value = {
              spreadsheetId : '1TdHsmEBNZehNT9C-KMG50Fw9jcEKJZ2NNn-S1hCENGE'
            , range : '영토전_참가자_시트!A2:AI'
            , auth  : sheet_client
            , majorDimension : 'Rows'
        };

        User_War_list(msg, Discord, sheet_value , "User_War_list_Check");
    }
}
