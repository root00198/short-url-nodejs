var mysql = require("mysql");

var connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "short-url"
});

function queryDatabase(shortUrl,f){
    var sql = "SELECT * from url where shortUrl='"+ shortUrl +"' && active=1 LIMIT 1";
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

function addNewShortUrl(shortUrl, longUrl, active, counselor, f){
    var sql = `SELECT * from url where shortUrl='${shortUrl}' LIMIT 1`;
    connection.query(sql, (error, results, feilds)=>{
        if(error)
        {
            f("server side error");
            throw error;
        }
        if(results[0])
            f("Short Url Already Exist");
        else
        {
            sql = `INSERT INTO url(shortUrl, longUrl, active, counselor, noc) VALUES ('${shortUrl}','${longUrl}',${active},'${counselor}',0)`;
            connection.query(sql, (error, results, feilds)=>{
                if(error)
                {
                    f("server side error");
                    throw error;
                }
                f(`https://wac.co.in/${shortUrl}`);
            });
        }
    });
}

function updateShortUrl(shortUrl, longUrl, active, counselor, f){
    var sql = `UPDATE url set longUrl='${longUrl}', active=${active} where shortUrl='${shortUrl}'`;
    connection.query(sql, (error, results, feilds)=>{
        if(error)
        {
            f("server error");
            throw error;
        }
        f(`successfully updated!!`);
    });
}

function fetchAllShortUrlNameAndCounselor(f){
    var sql = "SELECT shortUrl, counselor from url";
    connection.query(sql, (error, results, feilds)=>{
        if(error)
        {
            f({});
            throw error;
        }
        f(results);
    });
}

function fetchAllShortUrl(f){
    var sql = "SELECT * from url";
    connection.query(sql, (error, results, feilds)=>{
        if(error)
        {
            f({});
            throw error;
        }
        f(results);
    });
}


function fetchSingleShortUrl(shortUrl,f){
    var sql = `SELECT * from url where shortUrl='${shortUrl}' LIMIT 1`;
    connection.query(sql, (error, results, feilds)=>{
        if(error)
        {
            f({});
            throw error;
        }
        f(results);
    });
}


function updateShortUrl(shortUrl, longUrl, active, f){
    var sql = `UPDATE url SET longUrl='${longUrl}', active='${active}' where shortUrl='${shortUrl}'`;
    connection.query(sql, (error, results, feilds)=>{
        if(error)
        {
            f(error);
            throw error;
        }
        f({});
    });
}

function deleteShortUrl(shortUrl,f){
    var sql = `DELETE from url where shortUrl='${shortUrl}'`;
    connection.query(sql, (error, results, feilds)=>{
        if(error)
        {
            f(error);
            throw error;
        }
        f({});
    });
}

module.exports.queryDatabase = queryDatabase;
module.exports.incrementUrlNoOfClicks = incrementUrlNoOfClicks;
module.exports.addNewShortUrl = addNewShortUrl;
module.exports.updateShortUrl = updateShortUrl;
module.exports.fetchAllShortUrlNameAndCounselor = fetchAllShortUrlNameAndCounselor;
module.exports.fetchAllShortUrl= fetchAllShortUrl;
module.exports.fetchSingleShortUrl = fetchSingleShortUrl;
module.exports.updateShortUrl = updateShortUrl;
module.exports.deleteShortUrl = deleteShortUrl;

