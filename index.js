const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname,'public')));

app.get("/", (req,res)=>{ 
    res.write("REDIRECT(302) : https://whataftercollege.com/");  
    res.end();
});

app.get("/:id", (req, res)=>{
    if(/^([a-zA-Z0-9\-\(\)]+)$/.test(req.params.id))
    {
        const database = require('./database.js');
        database.queryDatabase(req.params.id,(results, feilds)=>{
            if(results[0])
            {
                res.write("REDIRECT(302) : " + results[0]['longUrl']);
                database.incrementUrlNoOfClicks(req.params.id);
            }
            else
                res.writeHead(404);
            res.end();
        });
    }
    else
    {
        res.writeHead(404);
        res.end();
    }
});

app.use('^/backend/', require("./backend.js"));

const PORT = 300;

app.listen(PORT, ()=>{
    console.log(`Listening on PORT ${PORT}`);
});