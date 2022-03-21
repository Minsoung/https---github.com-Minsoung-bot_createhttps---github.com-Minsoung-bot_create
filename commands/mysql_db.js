const myslq = require('mysql');
const db_Master = require('./db_config.json');

let con = "";

function handleDisconnect() { 
     con = myslq.createConnection({
        host : db_Master.host
      , user : db_Master.user
      , password : db_Master.password
      , database : db_Master.database
      , multipleStatements: true
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

    module.exports = con;
}

handleDisconnect();