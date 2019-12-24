var mysql = require("mysql");

var connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "short-url"
});

function connect(){
    connection.connect();
}

function queryDatabase(shortUrl,f){
    var sql = "SELECT * from url where shortUrl='"+ shortUrl +"'";
    connection.query(sql,(error, results, feilds)=>{
        if(error) throw error;
        f(results,feilds);
    });
}

function incrementUrlNoOfClicks(shortUrl, f){
    var sql = `UPDATE url set noc=noc+1 where shortUrl='${shortUrl}'`;
    connection.query(sql,(error, results, feilds)=>{
        if(error) throw error;
        f(results, feilds);
    });
}

function close()
{
    connection.end();
}

module.exports.queryDatabase = queryDatabase;
module.exports.connect = connect;
module.exports.close = close;
module.exports.incrementUrlNoOfClicks = incrementUrlNoOfClicks;