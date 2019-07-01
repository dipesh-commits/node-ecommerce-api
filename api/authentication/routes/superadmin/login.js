const express = require("express");
const router =  express.Router();
const passport = require('passport');
const userId= require('../../passport');
const User = require('../../models/admin');
const multer= require('multer');
var upload = multer();
router.use(upload.array());

router.post('/login',  passport.authenticate('local', {
    // successRedirect: '/success',
    // failureRedirect: '/error',
    failureFlash: true
  }),function(req,res){
      const user = User.findOne({"_id":user.email},function(err,data){
        if(err){
        res.json({error:err});
      }
      res.json({success:data});
  })

});
 module.exports = router;
