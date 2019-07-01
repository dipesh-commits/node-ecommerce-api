const express = require("express");
const router =  express.Router();
const passport = require('passport');
const User = require('../..//models/admin');
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const multer= require('multer');
var upload = multer();
router.use(upload.array());

router.route('/signup').post( async function(req, res,next){

  const { email, username, password}= req.body;
        const salt =await bcrypt.genSalt(10);
        console.log(req.body)
        console.log(salt)
    ;    const hashPassword = await bcrypt.hash(password,salt);
        console.log(hashPassword);
         const newUser = new User({
           username:username,
           email: email,
           password:hashPassword,
           status:"0",
         }) ;
          await newUser.save();
         res.send("successfully signed up");

});

module.exports = router;
