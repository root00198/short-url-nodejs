var mysql = require("mysql");

var connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "short-url"
});

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
    });
}

module.exports.queryDatabase = queryDatabase;
module.exports.incrementUrlNoOfClicks = incrementUrlNoOfClicks;
