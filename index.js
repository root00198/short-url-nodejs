const path = require('path');
const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname,'public')));

app.get("/", (req,res)=>{
    // res.writeHead(302,{"Location" : 'https://whataftercolllege.com/' }); 
    res.write("https://whataftercollege.com/");  
    res.end();
});

app.get("/:id", (req, res)=>{
    if(/^([a-zA-Z0-9\-\(\)]+)$/.test(req.params.id))
    {
        const database = require('./database.js');
        database.queryDatabase(req.params.id,(results, feilds)=>{
            if(results[0])
            {
                // res.writeHead(302,{"Location" : results[0]['longUrl'] }); 
                res.write(results[0]['longUrl']);  
                res.end();
                database.incrementUrlNoOfClicks(req.params.id);
            }
            else
            {
                res.writeHead(404);
                res.end();
            }
        });
    }
    else
    {
        res.writeHead(404);
        res.end();
    }
});



const PORT = 300;

app.listen(PORT, ()=>{
    console.log(`Listening on PORT ${PORT}`);
});