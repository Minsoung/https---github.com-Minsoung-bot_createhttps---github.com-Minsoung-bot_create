const myslq = require('mysql');
const fs = require('fs');
var express = require('express')
var app = express();

 let con = "";

function handleDisconnect() {
    con = myslq.createConnection({
        host : 'localhost'
      , user : 'root' 
      , password : '1234'
      , database : 'botDB'
    });

    con.connect(function(err) {
        if (err) { 
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }

        console.log('Connected');
    });

    con.on('error', function(err) { 
        console.log('db error', err); 
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { 
            handleDisconnect(); 
        } else { 
            throw err;
        } 
    });
}


handleDisconnect();

// 3000 포트로 서버 오픈
app.listen(3000, '0.0.0.0');

app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/commands'));
app.use(express.static(__dirname + '/img'));
app.use(express.static(__dirname + '/font'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', function(req,res) {  

    var requestIp = require('request-ip');

    let ip = requestIp.getClientIp(req);

    console.log(ip);

    var sql = "INSERT INTO IPLOG(IP, CREATED) VALUES(?,NOW())";

    con.query(sql, [ip],function(err, result, fields){
        if (err) throw err;

        console.log(result);
    });

    res.sendFile(__dirname +'/main.html');
})

app.get('/survey', function(req,res) {

    // var requestIp = require('request-ip');

    // let ip = requestIp.getClientIp(req);

    // console.log(ip);

    //res.send("<h1>"+ip+"</h1>");
    
    res.sendFile(__dirname +'/survey.html');
})

app.post('/survey_submit', function(req, res) {
    let ip = req.body.ip;
    delete req.body.ip;

    let username = req.body.username;
    delete req.body.username;

    let discordNickname = req.body.discordNickname;
    delete req.body.discordNickname;

    let first = req.body.first;
    delete req.body.first;

    let discriminator = req.body.discriminator;
    delete req.body.discriminator;

    let level = req.body.level;
    delete req.body.level;

    let hobby1 = req.body.hobby1;
    delete req.body.hobby1;

    let hobby2 = req.body.hobby2;
    delete req.body.hobby2;

    let hobby3 = req.body.hobby3;
    delete req.body.hobby3;

    let position = req.body.position;
    delete req.body.position;

    let family = req.body.family;
    delete req.body.family;

    let sql3 = "";
    let nick_value = discordNickname;

    sql3  = "SELECT COUNT(ID) AS COUNT, USER_KEY AS USER_KEY, ID AS USER_ID";
    sql3 += " FROM USER_KEY";
    sql3 += " WHERE NICKNAME_D = ?";

    con.query(sql3, nick_value,function(err, result, fields) {
        if (result[0].COUNT == 0) {
            res.send("<script>alert('키 값이 없습니다. 키 발급 후 설문지를 작성을 해주세요. 혹은 디스코드 닉네임을 다시 확인해주세요.'); location.href='/survey'</script>");
        } else {
            let USER_KEY = result[0].USER_KEY;
            let USER_ID = result[0].USER_ID;
            let sql = "";
            let valueArray = new Array();
            let bFlag = false;
        
            sql  = "INSERT INTO SURVEY";
            sql += "(IP, USER_KEY, ID, NICKNAME_D, NICKNAME_P, LEVEL, POSITION_CD, DROUGHTY_CD, PREFERENCE_ARMY1, PREFERENCE_ARMY2, PREFERENCE_ARMY3)";
            sql += " VALUES";
            sql += "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
            valueArray[0] = ip;
            valueArray[1] = USER_KEY;
            valueArray[2] = USER_ID;
            valueArray[3] = discordNickname;
            valueArray[4] = username;
            valueArray[5] = level;
            valueArray[6] = position;
            valueArray[7] = family;
            valueArray[8] = hobby1;
            valueArray[9] = hobby2;
            valueArray[10] = hobby3;
        
            con.query(sql, valueArray,function(err, result, fields) {
                if (err) {
                    res.send("<script>alert('이미 저장된 설문지가 존재합니다.'); location.href='/'</script>");
                } else {
                    console.log("SURVEY INSERT COMPLETE");
                    let keyLen = Object.keys(req.body).length;
                    let index = 0;
        
                    for (let key in req.body) {
                        let sql2 = "";
                        let valueArray2 = new Array();
                
                        sql2  = "INSERT INTO USER_PROFICIENCY";
                        sql2 += "(IP, ID, ARMY_CD, PROFICIENCY_CD)";
                        sql2 += " VALUES";
                        sql2 += "(?, ?, ?, ?)";
                
                        valueArray2[0] = ip;
                        valueArray2[1] = USER_ID;
                        valueArray2[2] = key.replace('c', '');
                        valueArray2[3] = req.body[key];
                
                        con.query(sql2, valueArray2,function(err, result, fields) {
                            if (err) {
                                res.send("<script>alert('설문지 저장에 실패하였습니다.'); location.href='/'</script>");
                                return false;
                            } else {
                                index = index + 1;
                                console.log("USER_PROFICIENCY INSERT COMPLETE");
        
                                if (index == keyLen) {
                                    res.send("<script>alert('설문지가 저장되었습니다.'); location.href='/'</script>");
                                }
                            }
                        });
                    }
                }
            });
        }
    });
})

/*
const con = myslq.createConnection({
    host : 'localhost'
  , user : 'root' 
  , password : '1234'
  , database : 'botDB'
});

con.connect(function(err){
  if (err) throw err;

  console.log('Connected');
});*/