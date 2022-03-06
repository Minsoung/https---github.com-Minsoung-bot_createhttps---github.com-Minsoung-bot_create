const {google} = require( "googleapis");
const keys = require("./chuno-user-list-665498e52880.json");

var User_Info = "";

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

async function User_War_list_Del(msg,Discord,sheet_value,callback,chk_value) {
    if (!gfn_isNull(callback)) {
        this.scallback = callback;
    }

    const sheets = google.sheets( { version : "v4"} );
    const request = {
          spreadsheetId : sheet_value.spreadsheetId
        , auth : sheet_value.auth
        , resource : { ranges : [sheet_value.range]}
    };
    
    const response = (await sheets.spreadsheets.values.batchClear(request)).data;

    if (chk_value == "X") {
        var sheet_value = {
              spreadsheetId : '1TdHsmEBNZehNT9C-KMG50Fw9jcEKJZ2NNn-S1hCENGE'
            , range : '파티편성!K3:AJ'
            , auth  : sheet_client
        };

        User_War_list_Del(msg, Discord, sheet_value , "User_War_list_Del_Msg","O");
    } else {
        var sheet_value = {
            spreadsheetId : '1TdHsmEBNZehNT9C-KMG50Fw9jcEKJZ2NNn-S1hCENGE'
            , range : '파티편성!J3:J'
            , auth  : sheet_client
            , majorDimension : 'COLUMNS'
        };

        User_War_list(msg, Discord, sheet_value , "User_War_list_Fed_Update");
    }

    //eval(this.scallback+'(msg, Discord)');
}

User_War_list_Fed_Update = function(msg, Discord, response) {
    User_Info = new Array();

    for (var i = 0; i < response.values[0].length; i++) {
        User_Info.push({range: `파티편성!J${Number(i + 3)}`, values: [["FALSE"]]});
    }

    var sheet_value = {
          spreadsheetId : '1TdHsmEBNZehNT9C-KMG50Fw9jcEKJZ2NNn-S1hCENGE'
        , auth  : sheet_client
        , valueInputOption : 'USER_ENTERED'
    };

    ufn_callbck_War_Fed_Update_Del(msg, Discord, sheet_value);
}

ufn_callbck_War_Fed_Update_Del = function(msg, Discord, sheet_value) {    
    const sheets = google.sheets( { version : "v4"} );
    const request = {
        spreadsheetId : sheet_value.spreadsheetId
        , auth : sheet_value.auth
        , resource : { 
              valueInputOption : sheet_value.valueInputOption
            , data : User_Info
        }
    };

    sheets.spreadsheets.values.batchUpdate(request);

    var sheet_value2 = {
        spreadsheetId : '1TdHsmEBNZehNT9C-KMG50Fw9jcEKJZ2NNn-S1hCENGE'
        , range : '파티편성!C3:C64'
        , auth  : sheet_client
        , majorDimension : 'COLUMNS'
    };

    User_War_list(msg, Discord, sheet_value2 , "User_War_list_Fed_Update2");
}

User_War_list_Fed_Update2 = function(msg, Discord, response) {
    User_Info = new Array();

    for (var i = 0; i < response.values[0].length; i++) {
        User_Info.push({range: `파티편성!C${Number(i + 3)}`, values: [["미정자"]]});
    }

    var sheet_value = {
          spreadsheetId : '1TdHsmEBNZehNT9C-KMG50Fw9jcEKJZ2NNn-S1hCENGE'
        , auth  : sheet_client
        , valueInputOption : 'USER_ENTERED'
    };

    ufn_callbck_War_Fed_Update_Del2(msg, Discord, sheet_value);
}

ufn_callbck_War_Fed_Update_Del2 = function(msg, Discord, sheet_value) {    
    const sheets = google.sheets( { version : "v4"} );
    const request = {
        spreadsheetId : sheet_value.spreadsheetId
        , auth : sheet_value.auth
        , resource : { 
              valueInputOption : sheet_value.valueInputOption
            , data : User_Info
        }
    };

    sheets.spreadsheets.values.batchUpdate(request);

    var sheet_value2 = {
        spreadsheetId : '1TdHsmEBNZehNT9C-KMG50Fw9jcEKJZ2NNn-S1hCENGE'
        , range : '파티편성!E3:E64'
        , auth  : sheet_client
        , majorDimension : 'COLUMNS'
    };

    User_War_list(msg, Discord, sheet_value2 , "User_War_list_Fed_Update3");
}

User_War_list_Fed_Update3 = function(msg, Discord, response) {
    User_Info = new Array();
    
    if (!gfn_isNull(response.values)) {
        for (var i = 0; i < response.values[0].length; i++) {
            User_Info.push({range: `파티편성!E${Number(i + 3)}`, values: [[""]]});
        }
    }

    var sheet_value = {
          spreadsheetId : '1TdHsmEBNZehNT9C-KMG50Fw9jcEKJZ2NNn-S1hCENGE'
        , auth  : sheet_client
        , valueInputOption : 'USER_ENTERED'
    };

    ufn_callbck_War_Fed_Update_Del3(msg, Discord, sheet_value);
}

ufn_callbck_War_Fed_Update_Del3 = function(msg, Discord, sheet_value) {    
    if (!gfn_isNull(User_Info)) {
        const sheets = google.sheets( { version : "v4"} );
        const request = {
            spreadsheetId : sheet_value.spreadsheetId
            , auth : sheet_value.auth
            , resource : { 
                valueInputOption : sheet_value.valueInputOption
                , data : User_Info
            }
        };

        sheets.spreadsheets.values.batchUpdate(request);
    }
    
    var sheet_value2 = {
        spreadsheetId : '1TdHsmEBNZehNT9C-KMG50Fw9jcEKJZ2NNn-S1hCENGE'
        , range : '파티편성!F3:F64'
        , auth  : sheet_client
        , majorDimension : 'COLUMNS'
    };

    User_War_list(msg, Discord, sheet_value2 , "User_War_list_Fed_Update4");
}

User_War_list_Fed_Update4 = function(msg, Discord, response) {
    User_Info = new Array();

    if (!gfn_isNull(response.values)) {
        for (var i = 0; i < response.values[0].length; i++) {
            User_Info.push({range: `파티편성!F${Number(i + 3)}`, values: [[""]]});
        }
    }

    var sheet_value = {
          spreadsheetId : '1TdHsmEBNZehNT9C-KMG50Fw9jcEKJZ2NNn-S1hCENGE'
        , auth  : sheet_client
        , valueInputOption : 'USER_ENTERED'
    };

    ufn_callbck_War_Fed_Update_Del4(msg, Discord, sheet_value);
}

ufn_callbck_War_Fed_Update_Del4 = function(msg, Discord, sheet_value) {    
    if (!gfn_isNull(User_Info)) {
        const sheets = google.sheets( { version : "v4"} );
        const request = {
            spreadsheetId : sheet_value.spreadsheetId
            , auth : sheet_value.auth
            , resource : { 
                valueInputOption : sheet_value.valueInputOption
                , data : User_Info
            }
        };

        sheets.spreadsheets.values.batchUpdate(request);
    }

    var sheet_value2 = {
        spreadsheetId : '1TdHsmEBNZehNT9C-KMG50Fw9jcEKJZ2NNn-S1hCENGE'
        , range : '파티편성!G3:G64'
        , auth  : sheet_client
        , majorDimension : 'COLUMNS'
    };

    User_War_list(msg, Discord, sheet_value2 , "User_War_list_Fed_Update5");
}


User_War_list_Fed_Update5 = function(msg, Discord, response) {
    User_Info = new Array();

    if (!gfn_isNull(response.values)) {
        for (var i = 0; i < response.values[0].length; i++) {
            User_Info.push({range: `파티편성!G${Number(i + 3)}`, values: [[""]]});
        }
    }
    var sheet_value = {
          spreadsheetId : '1TdHsmEBNZehNT9C-KMG50Fw9jcEKJZ2NNn-S1hCENGE'
        , auth  : sheet_client
        , valueInputOption : 'USER_ENTERED'
    };

    ufn_callbck_War_Fed_Update_Del5(msg, Discord, sheet_value);
}

ufn_callbck_War_Fed_Update_Del5 = function(msg, Discord, sheet_value) {    
    if (!gfn_isNull(User_Info)) {
        const sheets = google.sheets( { version : "v4"} );
        const request = {
            spreadsheetId : sheet_value.spreadsheetId
            , auth : sheet_value.auth
            , resource : { 
                valueInputOption : sheet_value.valueInputOption
                , data : User_Info
            }
        };

        sheets.spreadsheets.values.batchUpdate(request);
    }

    User_War_list_Del_Msg(msg, Discord);
}


User_War_list_Del_Msg = function(msg, Discord) {
    var board = {
        Title : "내용 삭제"
      , Stirng_value : "시트 내용이 정상적으로 삭제되었습니다."
      , Color : "BLUE"
  }

  ufn_Send_Mag(msg, Discord, board);
}

module.exports = {
    name : "삭제"
  , description : "영토전 시트삭제"

  , Sheet_War_Fed_Del(msg,Discord) {

        var sheet_value = {
              spreadsheetId : '1TdHsmEBNZehNT9C-KMG50Fw9jcEKJZ2NNn-S1hCENGE'
            , range : '참가자!A3:AA'
            , auth  : sheet_client
        };

        User_War_list_Del(msg, Discord, sheet_value , "User_War_list_Del_Msg","X");
    }
}
