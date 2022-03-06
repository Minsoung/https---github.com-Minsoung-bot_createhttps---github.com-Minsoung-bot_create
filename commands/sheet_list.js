const {google} = require( "googleapis");
const keys = require("./chuno-user-list-665498e52880.json");

const sheet_client = new google.auth.JWT(
    keys.client_email
  , null
  , keys.private_key
  , ['https://www.googleapis.com/auth/spreadsheets']  // 사용자 시트 및 해당 속성에 대한 읽기/쓰기 액세스 허용
  );

async function User_list( sheet_client, msg,Discord) {
    const sheets = google.sheets( { version : "v4"} );
    const request = {
          spreadsheetId : "1F0UIlHHoVOyBnweFzMelJ4xTtrTDvtnkhxSdD_fsf0U"
        , range : "인원시트"
        , auth : sheet_client
        , majorDimension : 'COLUMNS'
    };
    const response = (await sheets.spreadsheets.values.get(request)).data;
    ufn_gsrun_callback(response, msg,Discord);
}
  
ufn_gsrun_callback = function(response, msg, Discord) {

    var Stirng_value = "";

    for (var i = 0; i < response.values[2].length; i++) {
        Stirng_value += (i+1)+". "+ response.values[2][i] +"\n";
    }

    console.log(Stirng_value);

    const embed = new Discord.MessageEmbed()
          .setTitle("가문원 리스트")
          .setDescription(Stirng_value)
          .setColor("BLUE")
    
    return msg.channel.send({embeds : [embed]});
}

module.exports = {
    name : "가문원"
  , description : "가문원 전체호출"

  , Sheet_User(msg,value,Discord) {
        User_list(sheet_client,msg,Discord)
    }
}