const {google} = require( "googleapis");
const keys = require("./chuno-user-list-665498e52880.json");

const sheet_client = new google.auth.JWT(
    keys.client_email
  , null
  , keys.private_key
  , ['https://www.googleapis.com/auth/spreadsheets']  // 사용자 시트 및 해당 속성에 대한 읽기/쓰기 액세스 허용
  );

async function User_list_Add( sheet_client,msg,value) {
    const sheets = google.sheets( { version : "v4"} );
    const request = {
        spreadsheetId : "1F0UIlHHoVOyBnweFzMelJ4xTtrTDvtnkhxSdD_fsf0U"
        , range : "인원시트"
        , auth : sheet_client
        , majorDimension : 'Rows'
    };

    const response = (await sheets.spreadsheets.values.get(request)).data;

    var chk_value = 0;
    
    for (var i = 0; i < response.values.length; i++) {
        if (response.values[i][0] == msg.author.username && response.values[i][1] == msg.author.discriminator) {
            chk_value++;
        }
    }

    if (chk_value == 1) {
        return msg.channel.send(`${msg.author}님은 이미 등록되어있습니다.`);
    } else {
        ufn_gsrun_callback2(msg,value);
    }
    
}
  
ufn_gsrun_callback2 = function(msg,value) {
    const sheets = google.sheets( { version : "v4"} );
    const request = {
        spreadsheetId : "1F0UIlHHoVOyBnweFzMelJ4xTtrTDvtnkhxSdD_fsf0U"
      , range : "인원시트"
      , auth : sheet_client
      , valueInputOption : 'USER_ENTERED'
      , insertDataOption: 'INSERT_ROWS'
      , resource : { values : [
            [msg.author.username ,msg.author.discriminator,value]
        ]
      }
  };

  sheets.spreadsheets.values.append(request);

  User_list_Add2(sheet_client,msg,value);
}

async function User_list_Add2( sheet_client, msg,value) {
    const sheets = google.sheets( { version : "v4"} );

    const request = {
          spreadsheetId : "1pZ5jfuVydOrfvvrEHr-f7cw_lpEPGeFGOvBKDH07bx0"
        , range : "가문원시트!A7:A"
        , auth : sheet_client
        , majorDimension : 'ROWS'
    };
    const response = (await sheets.spreadsheets.values.get(request)).data;

    ufn_gsrun_callback3(response, msg,value);
}

ufn_gsrun_callback3 = function(response,msg,value) {    
    const sheets = google.sheets( { version : "v4"} );
    const request = {
        spreadsheetId : "1pZ5jfuVydOrfvvrEHr-f7cw_lpEPGeFGOvBKDH07bx0"
      , range : "가문원시트!A" + Number(response.values.length+7)
      , auth : sheet_client
      , valueInputOption : 'USER_ENTERED'
      , resource : { values : [
            [value]
        ]
      }
  };

  sheets.spreadsheets.values.update(request);

  return msg.channel.send(`${msg.author}님이 등록되었습니다. \n https://docs.google.com/spreadsheets/d/1pZ5jfuVydOrfvvrEHr-f7cw_lpEPGeFGOvBKDH07bx0/edit?usp=sharing  <<< 이동하여 시트를 작성해주세요.`);
}

module.exports = {
    name : "추가"
  , description : "가문원추가"

  , Sheet_User_Add(msg,value) {
      console.log(value);
        User_list_Add(sheet_client,msg,value)
    }
}