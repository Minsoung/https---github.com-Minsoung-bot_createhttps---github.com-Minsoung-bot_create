var schedule = require('node-schedule');
var run = new schedule.RecurrenceRule();
const {google} = require( "googleapis");
const sheet_client = require('./google_db');
const google_Master = require('./google_config.json');
const con = require('./mysql_db');

Schedule_Update =  function(msg, Discord) {
    
    // 화요일, 토요일 23시 스케줄러 업데이트
    //run.dayOfWeek = [2,6];
    //run.hour = 23;
    run.second = 5;//test time

    let timer = schedule.scheduleJob(run, function() {
        const googleSheets = google.sheets({version : "v4"});

        let User_Nick_Name = new Array();
        let sheet_value = "";
        let request = "";
        let response = "sheet15!D2:D177";

        console.log(response);
        for (var i = 0; i < 177; i++) {
          User_Nick_Name.push({range: `sheet15!D${Number(i + 2)}`, values: [["미정자"]]});
        }
        console.log(User_Nick_Name);
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
          , range : "sheet15!H2:J176"
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
        , range : "sheet14!A2:AZ300"
        , auth  : sheet_client
        , majorDimension : google_Master.majorDimension_Row
      };
      
      request = {
        spreadsheetId : sheet_value.spreadsheetId
        , auth : sheet_value.auth
        , resource : { ranges : [sheet_value.range]}
      };
      
      response = (googleSheets.spreadsheets.values.batchClear(request)).data;
      
      console.log('클리어');
    });    
}

module.exports = {
    name : "스케줄러_test" 
  , description : "스케줄러_test_확인" 
}