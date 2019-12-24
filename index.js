const http = require('http');

const server = http.createServer((req, res)=>{
    req.url = req.url.substr(1);
    if(/^$/.test(req.url))
    {
        // res.writeHead(302,{"Location" : 'https://whataftercolllege.com/' }); 
        res.write("https://whataftercollege.com/");  
        res.end();
    }
    else if(/^backend\/(.*)$/.test(req.url))
    {
        res.write("Take Me to backend protal");  
        res.end();
    }
    else if(/^([a-zA-Z0-9\-\(\)]+)$/.test(req.url))
    {
        const database = require('./database.js');
        var flag = true;
        database.queryDatabase(req.url,(results, feilds)=>{
            console.log(results);
            if(results[0])
            {
                // res.writeHead(302,{"Location" : results[0]['longUrl'] }); 
                res.write(results[0]['longUrl']);  
                res.end();
            }
            else
            {
                flag = false;
                res.writeHead(404);
                res.end();
            }
        });
        database.incrementUrlNoOfClicks(req.url, (results, feilds)=>{
            console.log(results);
        });
    }
    else
    {
        res.writeHead(404);
        res.end();
    }
});

server.listen(300,()=>{
    console.log(`Listening on PORT 300`);
});