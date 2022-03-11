const myslq = require('mysql');

const con = myslq.createConnection({
    host : 'localhost'
  , user : 'root' 
  , password : '1234'
  , database : 'botDB'
});

function handleDisconnect() {
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

module.exports = con;