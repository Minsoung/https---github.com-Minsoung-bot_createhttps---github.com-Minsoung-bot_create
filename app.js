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
    console.log('test');
});

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