const express = require("express");
const router = express.Router();
const database = require('./database');
const session = require('express-session');

router.use(session({secret: 'shhhh',resave: false, saveUninitialized: false}));


router.get("/login", (req,res)=>{
    res.render('login', {
        layout: 'loginLayout.handlebars',
        status: req.query.status
    });
});

router.post("/login", (req,res)=>{
    var counselorId = req.body['email'];
    var password = req.body['password'];
    database.searchCounselor(counselorId, password,(rs)=>{
        if(rs[0])
        {
            var sess = req.session;
            sess.counselorId = rs[0]['counselorId'];
            sess.dashboard = rs[0]['dashboard'];
            sess.addUrl = rs[0]['addUrl'];
            sess.editUrl = rs[0]['editUrl'];
            sess.allUrls = rs[0]['allUrls'];
            sess.counselor = rs[0]['manageCounselor'];
            res.redirect('/backend/dashboard');
        }
        else
            res.redirect('/backend/login?status=failed');
    });
});

router.get("/dashboard", (req,res)=>{
    var sess = req.session;
    if(!sess.dashboard)
        res.redirect('/backend/login');
    else
    {
        res.render('dashboard',{
            dashboard : true,
            content_title: 'Dashboard',
            counselorId: sess.counselorId,
            dashboard_access: sess.dashboard,
            addUrl_access: sess.addUrl,
            editUrl_access: sess.editUrl,
            allUrls_access: sess.allUrls,
            counselor_access: sess.counselor
        });
    }
});

router.get("/addurl", (req,res)=>{
    res.render('addUrl',{
        addurl : true,
        content_title: 'Add a New Url',
        dashboard_access: sess.dashboard,
        addUrl_access: sess.addUrl,
        editUrl_access: sess.editUrl,
        allUrls_access: sess.allUrls,
        counselor_access: sess.counselor
    });
});

router.post("/addurl", (req,res)=>{

    ///////////////////////////
    /// VALIDATE Counselor ////
    /// SESSION VALIDATION ////
    ///////////////////////////

    var sess = req.session;
    console.log(sess);
    if(!sess.counselorId)
    {
        console.log("!!!");
    }

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
            allUrls: result,
            dashboard_access: sess.dashboard,
            addUrl_access: sess.addUrl,
            editUrl_access: sess.editUrl,
            allUrls_access: sess.allUrls,
            counselor_access: sess.counselor
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
                    counselorId: results[0]['counselor'],
                    dashboard_access: sess.dashboard,
                    addUrl_access: sess.addUrl,
                    editUrl_access: sess.editUrl,
                    allUrls_access: sess.allUrls,
                    counselor_access: sess.counselor
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
            allUrls: result,
            dashboard_access: sess.dashboard,
            addUrl_access: sess.addUrl,
            editUrl_access: sess.editUrl,
            allUrls_access: sess.allUrls,
            counselor_access: sess.counselor
        });
    });
});

router.post("/allurls",(req,res)=>{
    if(req.body['action']==="edit")
        database.updateShortUrl(req.body['shortUrl'], req.body['longUrl'], req.body['active'],(f)=>{res.send(f)});
    else if(req.body['action']==="delete")
        database.deleteShortUrl(req.body['shortUrl'],(f)=>{res.send(f)});
});

router.get("/counselor", (req,res)=>{
    res.render('counselor',{
        counselor : true,
        content_title: 'Manage Counselors',
        dashboard_access: sess.dashboard,
        addUrl_access: sess.addUrl,
        editUrl_access: sess.editUrl,
        allUrls_access: sess.allUrls,
        counselor_access: sess.counselor
    });
});

module.exports = router;