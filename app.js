// node_modules 에 있는 express 관련 파일을 가져온다.
var express = require('express')
var app = express();
const fs = require('fs');

// 3000 포트로 서버 오픈
app.listen(3000, '0.0.0.0');

app.get('/', function(req,res) {

    var requestIp = require('request-ip');

    let ip = requestIp.getClientIp(req);

    console.log(ip);

    //res.send("<h1>"+ip+"</h1>");

    res.sendFile(__dirname +'/main.html');
})

app.get('/survey', function(req,res) {

    // var requestIp = require('request-ip');

    // let ip = requestIp.getClientIp(req);

    // console.log(ip);

    //res.send("<h1>"+ip+"</h1>");

    res.sendFile(__dirname +'/survey.html');
})
