const {google} = require( "googleapis");
const keys = require("./chuno-user-list-665498e52880.json");

var fv_name_value = "";

const sheet_client = new google.auth.JWT(
    keys.client_email
  , null
  , keys.private_key
  , ['https://www.googleapis.com/auth/spreadsheets']  // 사용자 시트 및 해당 속성에 대한 읽기/쓰기 액세스 허용
  );

async function User_War_attendance_name_Check(sheet_client,msg) 
{
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
        User_War_attendance_Check(sheet_client,msg);
    }    
}

async function User_War_attendance_Check(sheet_client,msg,Row) 
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


    if (chk_value == 0) {
        return msg.channel.send(`등록된 정보가 없습니다. \n $신청 입력 후 다시해주세요.`);
    } else {
        User_List_War_attendance_Update(sheet_client,msg,Chk_Row);
    }  
}

async function User_List_War_attendance_Update(sheet_client,msg,Row) 
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

    User_War_attendance_Update(sheet_client,msg,Row,War_Date_chage);
}

async function User_War_attendance_Update(sheet_client,msg,Row,War_Date_chage) 
{
    const sheets = google.sheets( { version : "v4"} );
    const request = {
        spreadsheetId : "1pZ5jfuVydOrfvvrEHr-f7cw_lpEPGeFGOvBKDH07bx0"
        , range : "영토전참가자!A4:G117"
        , auth : sheet_client
        , majorDimension : 'ROWS'
    };

    const response = (await sheets.spreadsheets.values.get(request)).data;

    var User_Info = new Array();

    var value_number = 0;

    for (var i = 0; i < response.values.length; i++) {
        if (response.values[i][0] == fv_name_value) {
            value_number = i;
            User_Info = [response.values[i][0],response.values[i][1],response.values[i][2],response.values[i][3],response.values[i][4],response.values[i][5],'O'];
            break;
        }
    }

    let today = new Date();   
    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1;  // 월
    let date = today.getDate();  // 날짜

    var to_day = year + '/' + month + '/' + date;

    var week_value = new Date(War_Date_chage) - new Date(to_day);

    if (week_value != 0) {
        return msg.channel.send(`영토전 당일날만 출석이 가능합니다.`);
    }

    if (response.values[value_number][6] == 'O') {
        return msg.channel.send(`${msg.author}님은 (`+War_Date_chage+`)날짜 영토전 출석이 되어있습니다.`);
    } 
    
    ufn_callbck_attendance_Update(sheet_client,msg,Row,User_Info);
}

ufn_callbck_attendance_Update = function(sheet_client,msg,Row,User_Info) {    
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

  return msg.channel.send(`${msg.author}님의 출석이 완료되었습니다.`);
}
  
module.exports = {
    name : "출석"
  , description : "영토전 출석관련"
  
  , Sheet_War_chk(msg) {
        User_War_attendance_name_Check(sheet_client,msg)
    }
}