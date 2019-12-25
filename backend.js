const express = require("express");
const router = express.Router();

router.get("/login", (req,res)=>{
    // res.write("/login " + req.url);
    // res.end();
    res.render('login');
});

module.exports = router;