const {google} = require( "googleapis");
const keys = require("./chuno-user-list-665498e52880.json");

var fv_name_value = "";

const sheet_client = new google.auth.JWT(
    keys.client_email
  , null
  , keys.private_key
  , ['https://www.googleapis.com/auth/spreadsheets']  // 사용자 시트 및 해당 속성에 대한 읽기/쓰기 액세스 허용
  );

async function User_War_list_name_Check(sheet_client,msg) {
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
            fv_name_value = response.values[i][2];
            chk_value++;
            break;
        }
    }
    
    if (chk_value == 0) {
        return msg.channel.send(`등록된 정보가 없습니다. \n $추가 게임닉네임 입력 후 시트를 작성해주세요.`);
    } else {
        User_War_list_Check(sheet_client,msg);
    }    
}

async function User_War_list_Check(sheet_client,msg) 
{
    const sheets = google.sheets( { version : "v4"} );
    const request = {
        spreadsheetId : "1pZ5jfuVydOrfvvrEHr-f7cw_lpEPGeFGOvBKDH07bx0"
        , range : "영토전참가자!A4:A"
        , auth : sheet_client
        , majorDimension : 'ROWS'
    };

    const response = (await sheets.spreadsheets.values.get(request)).data;

    var chk_value = 0;
    var Chk_Row = 0;
  
    if (response.values != undefined) {   
        for (var i = 0; i < response.values.length; i++) {
            if (response.values[i] == fv_name_value) {
                Chk_Row = i+4;
                chk_value++;
                break;
            }
        }
    } else {
        Chk_Row += 4;
    }
    
    var SUID = "";

    if (chk_value == 1) {
        SUID = "Update";
        
        User_List_War_Check(sheet_client,msg,Chk_Row,SUID);
    } else {
        SUID = "Insert";

        if (response.values != undefined) {
            User_List_War_Check(sheet_client,msg,Number(response.values.length+4),SUID);
        } else {
            User_List_War_Check(sheet_client,msg,Chk_Row,SUID);
        }
    }
}

User_List_War_Check = function(sheet_client,msg,Row,SUID)
{
    if (SUID == "Insert") {
        User_List_War_Inert(sheet_client,msg,Row);
    } else {
        User_List_War_Update(sheet_client,msg,Row);
    }
}

async function User_List_War_Inert(sheet_client,msg,Row) 
{
    const sheets = google.sheets( { version : "v4"} );
    const request = {
        spreadsheetId : "1pZ5jfuVydOrfvvrEHr-f7cw_lpEPGeFGOvBKDH07bx0"
        , range : "가문원시트!A7:D150"
        , auth : sheet_client
        , majorDimension : 'ROWS'
    };

    const response = (await sheets.spreadsheets.values.get(request)).data;

    var User_Info = new Array();

    let today = new Date();   
    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1;  // 월
    let date = today.getDate();  // 날짜

    var to_day = year + '/' + month + '/' + date;

    for (var i = 0; i < response.values.length; i++) {
        if (response.values[i][0] == fv_name_value ) {
            User_Info = [response.values[i][0],response.values[i][2],response.values[i][3],0,'O',to_day]
            break;
        }
    }

    ufn_callbck_War_Inert(sheet_client,msg,Row,User_Info);
}

ufn_callbck_War_Inert = function(sheet_client,msg,Row,User_Info) {    
    const sheets = google.sheets( { version : "v4"} );
    const request = {
        spreadsheetId : "1pZ5jfuVydOrfvvrEHr-f7cw_lpEPGeFGOvBKDH07bx0"
      , range : "영토전참가자!A" + Number(Row)
      , auth : sheet_client
      , valueInputOption : 'USER_ENTERED'
      , resource : { values : [
            User_Info
        ]
      }
  };

  sheets.spreadsheets.values.update(request);

  return msg.channel.send(`${msg.author}님 참가신청이 완료되었습니다.`);
}

async function User_List_War_Update(sheet_client,msg,Row) 
{
    const sheets = google.sheets( { version : "v4"} );
    const request = {
        spreadsheetId : "1pZ5jfuVydOrfvvrEHr-f7cw_lpEPGeFGOvBKDH07bx0"
        , range : "영토전참가자!A2:A2"
        , auth : sheet_client
        , majorDimension : 'ROWS'
    };

    const response = (await sheets.spreadsheets.values.get(request)).data;
    
    let today = new Date();   
    let year = today.getFullYear(); // 년도

    var War_date = String(response.values[0]).trim();
    var War_Date_chage = year+"/"+ War_date.substring(0,2) + "/" + War_date.substring(4,6);
    var week = War_date.substring(8);

    ufn_callbck_War_Update(sheet_client,msg,Row,War_Date_chage,week);
}

async function ufn_callbck_War_Update(sheet_client,msg,Row,War_Date_chage,week) 
{
    const sheets = google.sheets( { version : "v4"} );
    const request = {
        spreadsheetId : "1pZ5jfuVydOrfvvrEHr-f7cw_lpEPGeFGOvBKDH07bx0"
        , range : "영토전참가자!A4:G117"
        , auth : sheet_client
        , majorDimension : 'ROWS'
    };
    
    const response = (await sheets.spreadsheets.values.get(request)).data;

    var User_Date = "";
    var User_Info = new Array();

    let today = new Date();   
    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1;  // 월
    let date = today.getDate();  // 날짜

    var to_day = year + '/' + month + '/' + date;
    var count = 0;

    for (var i = 0; i < response.values.length; i++) {
        if (response.values[i][0] == fv_name_value) {
            User_Date = response.values[i][5];
            
            if (response.values[i][6] == 'O') {
                count = Number(Number(response.values[i][3])+1);
            } else {
                count = Number(response.values[i][3]);
            }
        
            User_Info = [response.values[i][0],response.values[i][1],response.values[i][2],count,response.values[i][4],to_day,'X'];
            break;
        }
    }

    var week_value = new Date(War_Date_chage) - new Date(User_Date);
    
    if (week == "토요일") { 
        if (week_value == 259200000 || week_value == 172800000 || week_value == 86400000 || week_value == 0) {
            return msg.channel.send(`${msg.author}님은 (`+War_Date_chage+`)날짜 영토전 등록이 되어있습니다.`);
        } else {
            ufn_callbck_War_List_Update(sheet_client,msg,Row,User_Info);
        }
    } else if (week == "화요일") {
        if (week_value == 172800000 || week_value == 86400000 || week_value == 0) {
            return msg.channel.send(`${msg.author}님은 (`+War_Date_chage+`)날짜 영토전 등록이 되어있습니다.`);
        } else {
            ufn_callbck_War_List_Update(sheet_client,msg,Row,User_Info);
        }
    }
}

ufn_callbck_War_List_Update = function(sheet_client,msg,Row,User_Info) {    
    const sheets = google.sheets( { version : "v4"} );
    const request = {
        spreadsheetId : "1pZ5jfuVydOrfvvrEHr-f7cw_lpEPGeFGOvBKDH07bx0"
      , range : "영토전참가자!A" + Number(Row)
      , auth : sheet_client
      , valueInputOption : 'USER_ENTERED'
      , resource : { values : [
            User_Info
        ]
      }
  };
  
  sheets.spreadsheets.values.update(request);

  return msg.channel.send(`${msg.author}님 참가신청이 완료되었습니다.`);
}
  
module.exports = {
    name : "참가"
  , description : "영토전 참가관련"

  , Sheet_War(msg) {
        User_War_list_name_Check(sheet_client,msg)
    }
}