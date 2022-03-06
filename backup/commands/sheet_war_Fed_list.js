const {google} = require( "googleapis");
const keys = require("./chuno-user-list-665498e52880.json");

var fv_name_value = "";

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

    if (gfn_isNull(response.values)) {
        var board = {
              Title : "등록 확인"
            , Stirng_value : "등록된 인원이 없습니다."
            , Color : "RED"
        }
        
        ufn_Send_Mag(msg, Discord, board); 
        return;
    }

    var Stirng_value = "";

    for (var i = 0; i < response.values.length; i++) {
        Stirng_value += (i+1)+".  가문 : "+response.values[i][5]+" 닉네임 : "+response.values[i][1] +"\n";
    }


    var board = {
          Title : "영토전참가자"
        , Stirng_value : Stirng_value
        , Color : "BLUE"
    }
  
    ufn_Send_Mag(msg, Discord, board); 
}


module.exports = {
    name : "참가자"
  , description : "영토전 참가관련"

  , Sheet_War_Fed_List(msg,Discord) {

        var sheet_value = {
              spreadsheetId : '1TdHsmEBNZehNT9C-KMG50Fw9jcEKJZ2NNn-S1hCENGE'
            , range : '참가자!A3:AA'
            , auth  : sheet_client
            , majorDimension : 'Rows'
        };

        User_War_list(msg, Discord, sheet_value , "User_War_list_Check");
    }
    
}
