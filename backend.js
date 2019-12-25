const express = require("express");
const router = express.Router();
const database = require('./database');

router.get("/login", (req,res)=>{
    res.render('login', {layout: 'loginLayout.handlebars'});
});
router.get("/dashboard", (req,res)=>{
    res.render('dashboard',{
        dashboard : true,
        content_title: 'Dashboard'
    });
});

router.get("/addurl", (req,res)=>{
    res.render('addUrl',{
        addurl : true,
        content_title: 'Add a New Url'
    });
});

router.post("/addurl", (req,res)=>{

    ///////////////////////////
    /// VALIDATE Counselor ////
    /// SESSION VALIDATION ////
    ///////////////////////////

    if(!/^[^/]*$/.test(req.body['shortUrl']))
        return res.send({msg: "Invalid Short Url"});
    if(!/^http:\/\/(.*)\.(.*)$/.test(req.body['longUrl']) && !/^https:\/\/(.*)\.(.*)$/.test(req.body['longUrl']))
        return res.send({msg : "Invalid Long Url"});
    
    database.addNewShortUrl(req.body['shortUrl'], req.body['longUrl'], req.body['active'], req.body['counselor'], (r)=>{
        res.send({msg: r});
    });
});

router.get("/editurl", (req,res)=>{
    database.fetchAllShortUrlNameAndCounselor((result)=>{
        res.render('editUrl',{
            editurl : true,
            content_title: 'Edit an Existing Url',
            displayInfo: false,
            allUrls: result
        });
    });
});

router.get('/editurl/:shortUrl', (req,res)=>{
    database.fetchSingleShortUrl(req.params.shortUrl,(results)=>{
        if(results[0])
        {
            database.fetchAllShortUrlNameAndCounselor((rs)=>{
                res.render('editUrl',{
                    editurl: true,
                    content_title: 'Edit Existing Url',
                    displayInfo: true,
                    allUrls: rs,
                    shortUrl: results[0]['shortUrl'], 
                    longUrl: results[0]['longUrl'],
                    active: results[0]['active'],
                    counselorId: results[0]['counselor']
                });
            });
        }
        else
        {
            res.send("404");
        }
    });
    
});

router.post("/editurl", (req,res)=>{

    ///////////////////////////
    /// VALIDATE Counselor ////
    /// SESSION VALIDATION ////
    ///// CHECK IF ADMIN //////
    ///////////////////////////

    if(!/^[^/]*$/.test(req.body['shortUrl']))
        return res.send({msg: "Invalid Short Url"});
    if(!/^http:\/\/(.*)\.(.*)$/.test(req.body['longUrl']) && !/^https:\/\/(.*)\.(.*)$/.test(req.body['longUrl']))
        return res.send({msg : "Invalid Long Url"});
    
    database.updateShortUrl(req.body['shortUrl'], req.body['longUrl'], req.body['active'], req.body['counselor'], (r)=>{
        res.send({msg: r});
    });
});

router.get("/allurls", (req,res)=>{
    database.fetchAllShortUrl((result)=>{
        res.render('allUrls',{
            allurls : true,
            content_title: 'View All Urls',
            allUrls: result
        });
    });
});
router.get("/counselor", (req,res)=>{
    res.render('counselor',{
        counselor : true,
        content_title: 'Manage Counselors'
    });
});

module.exports = router;