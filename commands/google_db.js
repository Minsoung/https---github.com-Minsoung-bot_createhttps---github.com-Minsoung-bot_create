const {google} = require( "googleapis");
const keys = require("./chuno-user-list-24392807906a.json");

const sheet_client = new google.auth.JWT(
    keys.client_email
  , null
  , keys.private_key
  , ['https://www.googleapis.com/auth/spreadsheets']  // 사용자 시트 및 해당 속성에 대한 읽기/쓰기 액세스 허용
);

module.exports = sheet_client;