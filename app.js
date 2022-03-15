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

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

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
    var requestIp = require('request-ip');

    let ip = requestIp.getClientIp(req);

    console.log(ip);

    var sql = "INSERT INTO IPLOG(IP, CREATED) VALUES(?,NOW())";

    con.query(sql, [ip],function(err, result, fields){
        if (err) throw err;

        console.log(result);
    });

    let sql2 = "";
    let chk_value = false;
    sql2  = "SELECT EXISTS (SELECT IP FROM SURVEY WHERE IP = ? LIMIT 1) AS SUCCESS;";

    if (req.query.key|| null || undefined || 0 || NaN) {
        chk_value = true;
        sql2  = "SELECT A.ARMY_CD, A.PROFICIENCY_CD, B.NICKNAME_D, B.NICKNAME_P, B.LEVEL, B.POSITION_CD, B.DROUGHTY_CD, B.PREFERENCE_ARMY1, B.PREFERENCE_ARMY2, B.PREFERENCE_ARMY3, '2' AS SUCCESS";
        sql2 += " FROM USER_PROFICIENCY AS A, SURVEY AS B";
        sql2 += " WHERE A.IP = ? AND B.IP = ? AND B.USER_KEY = '" + req.query.key + "';";
    }

    con.query(sql2, [ip, ip],function(err, result, fields) {
        if (err) {
            res.send("<script>alert('error'); location.href='/'</script>");
            return false;
        } else {
            if (chk_value) {
                if (result[0] == "" || result[0] == null || result[0] == undefined || result[0] == "null") {
                    res.send("<script> alert('키 값을 확인 및 발급해주세요.[신규작성으로 이동합니다.]'); location.href='/survey_insert'; </script>");
                    return;
                }
            }

            if (result[0].SUCCESS == 0) {
                res.sendFile(__dirname +'/survey.html');
            } else if (result[0].SUCCESS == 1) {
                res.sendFile(__dirname +'/key_confirm.html');
            } else {
                var context = {'UPDATE' : true};
                context['LEVEL'] = result[0].LEVEL;
                context['NICKNAME_P'] = result[0].NICKNAME_P;
                context['NICKNAME_D'] = result[0].NICKNAME_D;
                context['POSITION_CD'] = result[0].POSITION_CD;
                context['DROUGHTY_CD'] = result[0].DROUGHTY_CD;
                context['PREFERENCE_ARMY1'] = result[0].PREFERENCE_ARMY1;
                context['PREFERENCE_ARMY2'] = result[0].PREFERENCE_ARMY2;
                context['PREFERENCE_ARMY3'] = result[0].PREFERENCE_ARMY3;

                for (let i = 0; i < result.length; i++) {
                    context['c' + result[i].ARMY_CD] = result[i].PROFICIENCY_CD;
                }
                
                // data라는 이름으로 전달
                // ejs 파일에서는 data[1].a 와 같은 형식으로 사용
                res.render('survey.ejs', {'data' : context}, function(err ,html){
                    if (err){
                        console.log(err)
                    }
                    
                    res.end(html) // 응답 종료
                })
            }
        }
    });
})

app.get('/survey_insert', function(req,res) {
    var requestIp = require('request-ip');

    let ip = requestIp.getClientIp(req);

    console.log(ip);

    var sql = "INSERT INTO IPLOG(IP, CREATED) VALUES(?,NOW())";

    con.query(sql, [ip],function(err, result, fields){
        if (err) throw err;

        console.log(result);
    });

    res.sendFile(__dirname +'/survey.html');
})

app.post('/survey_submit', function(req, res) {
    let update = req.body.UPDATE;
    delete req.body.UPDATE;

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
            res.send("<script>alert('키 값이 없습니다. 키 발급 후 설문지를 작성을 해주세요. 혹은 디스코드 닉네임을 다시 확인해주세요.'); window.localStorage.setItem('backMessage', 1); window.history.back(-1);</script>");
        } else {
            let USER_KEY = result[0].USER_KEY;
            let USER_ID = result[0].USER_ID;
            let sql = "";
            let valueArray = new Array();
            let bFlag = false;
        
            if (update == "UPDATE") {
                sql  = "UPDATE SURVEY";
                sql += " SET NICKNAME_D=?, NICKNAME_P=?, LEVEL=?, POSITION_CD=?, DROUGHTY_CD=?, PREFERENCE_ARMY1=?, PREFERENCE_ARMY2=?, PREFERENCE_ARMY3=?";
                sql += " WHERE IP=? AND USER_KEY=?";

                valueArray[0] = discordNickname;
                valueArray[1] = username;
                valueArray[2] = level;
                valueArray[3] = position;
                valueArray[4] = family;
                valueArray[5] = hobby1;
                valueArray[6] = hobby2;
                valueArray[7] = hobby3;
                valueArray[8] = ip;
                valueArray[9] = USER_KEY;
            } else {
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
            }
        
            con.query(sql, valueArray,function(err, result, fields) {
                if (err) {console.log(err);
                    if (update == "UPDATE") {
                        res.send("<script>alert('설문지 수정에 실패하였습니다. 다시 시도해주세요.'); window.localStorage.setItem('backMessage', 1); window.history.back(-1);</script>");
                    } else {
                        res.send("<script>alert('이미 저장된 설문지가 존재합니다.'); window.localStorage.setItem('backMessage', 1); window.history.back(-1);</script>");
                    }
                } else {
                    if (update == "UPDATE") {
                        console.log("SURVEY UPDATE COMPLETE");
                    } else {
                        console.log("SURVEY INSERT COMPLETE");
                    }
                    let keyLen = Object.keys(req.body).length;
                    let index = 0;
        
                    for (let key in req.body) {
                        let sql2 = "";
                        let valueArray2 = new Array();
                
                        if (update == "UPDATE") {
                            sql2  = "UPDATE USER_PROFICIENCY";
                            sql2 += " SET PROFICIENCY_CD=?";
                            sql2 += " WHERE IP=? AND ARMY_CD=?";
                            
                            valueArray2[0] = req.body[key];
                            valueArray2[1] = ip;
                            valueArray2[2] = key.replace('c', '');
                        } else {
                            sql2  = "INSERT INTO USER_PROFICIENCY";
                            sql2 += "(IP, ID, ARMY_CD, PROFICIENCY_CD)";
                            sql2 += " VALUES";
                            sql2 += "(?, ?, ?, ?)";
                            
                            valueArray2[0] = ip;
                            valueArray2[1] = USER_ID;
                            valueArray2[2] = key.replace('c', '');
                            valueArray2[3] = req.body[key];
                        }

                        con.query(sql2, valueArray2,function(err, result, fields) {
                            if (err) {
                                res.send("<script>alert('설문지 저장에 실패하였습니다.'); location.href='/'</script>");
                                return false;
                            } else {
                                index = index + 1;

                                if (update == "UPDATE") {
                                    console.log("USER_PROFICIENCY UPDATE COMPLETE");
                                } else {
                                    console.log("USER_PROFICIENCY INSERT COMPLETE");
                                }

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