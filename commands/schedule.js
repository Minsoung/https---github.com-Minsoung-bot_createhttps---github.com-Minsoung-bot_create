var schedule = require('node-schedule');
var run = new schedule.RecurrenceRule();
const {google} = require( "googleapis");
const sheet_client = require('./google_db');
const google_Master = require('./google_config.json');
const con = require('./mysql_db');

Schedule_Update = function(msg, Discord) {
    
    // 화요일, 토요일 23시 스케줄러 업데이트
    run.dayOfWeek = [2,6];
    run.hour = 23;
    //run.second = 30;//test time

    let timer = schedule.scheduleJob(run, function() {
        var sql = "";

        const googleSheets = google.sheets({version : "v4"});

        let User_Nick_Name = new Array();
        let sheet_value = "";
        let request = "";
        let response = "";//파티편성_ONE!D2:D175";

        for (var i = 0; i < 175; i++) {
            User_Nick_Name.push({range: `파티편성_ONE!D${Number(i + 2)}`, values: [["미정자"]]});
        }

        sheet_value = {
            spreadsheetId : google_Master.spreadsheetId
            , auth  : sheet_client
            , valueInputOption : google_Master.valueInputOption
        };

        request = {
            spreadsheetId : sheet_value.spreadsheetId
            , auth : sheet_value.auth
            , resource : { 
            valueInputOption : sheet_value.valueInputOption
            , data : User_Nick_Name
            }
        };

        response = (googleSheets.spreadsheets.values.batchUpdate(request)).data;

        console.log('미지정 업데이트');

        sheet_value = {
            spreadsheetId : google_Master.spreadsheetId
          , range : "파티편성_ONE!H2:J175"
          , auth  : sheet_client
          , majorDimension : google_Master.majorDimension_Row
        };
        
        request = {
          spreadsheetId : sheet_value.spreadsheetId
          , auth : sheet_value.auth
          , resource : { ranges : [sheet_value.range]}
        };

        response = (googleSheets.spreadsheets.values.batchClear(request)).data; 
        
        console.log('ROW삭제');

        for (var i = 0; i < 175; i++) {
          User_Nick_Name.push({range: `파티편성_TOP!D${Number(i + 2)}`, values: [["미정자"]]});
        }

        sheet_value = {
              spreadsheetId : google_Master.spreadsheetId
            , auth  : sheet_client
            , valueInputOption : google_Master.valueInputOption
        };

        request = {
          spreadsheetId : sheet_value.spreadsheetId
          , auth : sheet_value.auth
          , resource : { 
            valueInputOption : sheet_value.valueInputOption
          , data : User_Nick_Name
          }
        };

        response = (googleSheets.spreadsheets.values.batchUpdate(request)).data;

        sheet_value = {
            spreadsheetId : google_Master.spreadsheetId
          , range : "파티편성_TOP!H2:J175"
          , auth  : sheet_client
          , majorDimension : google_Master.majorDimension_Row
        };
        
        request = {
          spreadsheetId : sheet_value.spreadsheetId
          , auth : sheet_value.auth
          , resource : { ranges : [sheet_value.range]}
        };

        response = (googleSheets.spreadsheets.values.batchClear(request)).data; 

      sheet_value = {
          spreadsheetId : google_Master.spreadsheetId
        , range : "참가자_ONE!A2:AZ300"
        , auth  : sheet_client
        , majorDimension : google_Master.majorDimension_Row
      };
      
      request = {
        spreadsheetId : sheet_value.spreadsheetId
        , auth : sheet_value.auth
        , resource : { ranges : [sheet_value.range]}
      };
      
      response = (googleSheets.spreadsheets.values.batchClear(request)).data;

      sheet_value = {
        spreadsheetId : google_Master.spreadsheetId
      , range : "참가자_TOP!A2:AZ300"
      , auth  : sheet_client
      , majorDimension : google_Master.majorDimension_Row
    };
    
    request = {
      spreadsheetId : sheet_value.spreadsheetId
      , auth : sheet_value.auth
      , resource : { ranges : [sheet_value.range]}
    };
    
    response = (googleSheets.spreadsheets.values.batchClear(request)).data;
    

    sql  += " DELETE FROM USER_WARLIST WHERE 1=1;";
  
    con.query(sql, function(err, result, fields) {
      console.log('USER_WARLIST 클리어');
    });
    
    console.log('클리어');
    });    
}

module.exports = {
    name : "스케줄러_test" 
  , description : "스케줄러_test_확인" 
}