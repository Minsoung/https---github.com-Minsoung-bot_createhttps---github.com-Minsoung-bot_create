const {google} = require( "googleapis");
const keys = require("./chuno-user-list-665498e52880.json");

const sheet_client = new google.auth.JWT(
    keys.client_email
  , null
  , keys.private_key
  , ['https://www.googleapis.com/auth/spreadsheets']  // 사용자 시트 및 해당 속성에 대한 읽기/쓰기 액세스 허용
  );


async function User_job( sheet_client,msg,name) {
    const sheets = google.sheets( { version : "v4"} );
    const request = {
          spreadsheetId : "1F0UIlHHoVOyBnweFzMelJ4xTtrTDvtnkhxSdD_fsf0U"
        , range : "직업"
        , auth : sheet_client
        , majorDimension : 'ROWS'
    };
    const response = (await sheets.spreadsheets.values.get(request)).data;
    console.log(name);
    ufn_User_job_callback(response,msg,name);
}
  
ufn_User_job_callback = function(response,msg,name) {
    var Stirng_value = "";
    for (var i = 0; i < response.values.length; i++) {
        if (response.values[i][0] == name) {
            Stirng_value = response.values[i][0] +"\n\n";
            for (var j = 1; j < response.values[i].length; j++) {
                Stirng_value += "- "+ response.values[i][j] +"\n\n";
            }
            break;
        }
    }
    console.log(Stirng_value);
    return msg.channel.send(""+Stirng_value+"");
}

module.exports = {
    name : "장궁"
  , description : "장궁 호출"

  , Sheet_User_job(msg,value) {
      console.log(value);
        User_job(sheet_client,msg, '장궁')
    }
}