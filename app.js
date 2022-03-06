const myslq = require('mysql');
const fs = require('fs');

var express = require('express')
var app = express();

const con = myslq.createConnection({
      host : 'localhost'
    , user : 'root'
    , password : '1234'
    , database : 'botDB'
});

con.connect(function(err){
    if (err) throw err;

    console.log('Connected');
});

// 3000 포트로 서버 오픈
app.listen(3000, '0.0.0.0');

app.use(express.static(__dirname + '/css'));
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
