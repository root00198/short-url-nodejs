const express = require("express");
const router = express.Router();

router.get("/login", (req,res)=>{
    res.render('login', {layout: 'loginLayout.handlebars'});
});


router.get("/dashboard", (req,res)=>{
    res.render('dashboard');
});

module.exports = router;