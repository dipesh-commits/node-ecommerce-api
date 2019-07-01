const express = require("express");
const router =  express.Router();
const passport = require('passport');
const multer= require('multer');
var upload = multer();
router.use(upload.array());

router.post('/login',  passport.authenticate('local', {
    // successRedirect: '/success',
    // failureRedirect: '/error',
    failureFlash: true
  }),function(req,res){
        console.log(req.user)
      if(req.user.status!='1'){
        res.json({message:'superadmin need to verify first'});
      }
      res.json({userid:req.user.id});


});
 module.exports = router;
