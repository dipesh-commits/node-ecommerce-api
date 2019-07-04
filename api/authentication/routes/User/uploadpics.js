const express = require('express');
const router  = express.Router();
const passport = require('passport');
var MongoClient = require('mongodb').MongoClient;
const mongoose=require('mongoose');
const User = require('../../models/index');
const UsersController = require('../../controllers/users');
const middleware = require('../Middleware/index');
const userId= require('../../passport');
const {validateBody,schemas}=require('../helper/routehelper');
const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });
const multer = require('multer');

const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'public/shop_logo');
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname+'-'+Date.now()+'-'+file.originalname);
    }

});

const upload = multer({
    storage: storage,
    limits: {filesize:900000},
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
});

function checkFileType(file,cb){
    if(file.mimetype ==='image/jpeg' || file.mimetype==='image/png' || file.mimetype==='image/gif' ||file.mimetype ==='image/jpg'){
        cb(null,true);

        }else
        {
          cb(null,false); //rejects storing a file
        }

  }

  router.put('/edit/:id',upload.array("images",2),function(req,res,next){

      const shopid= req.params.id;
      console.log(shopid);
      console.log(
                    "shop_logo:"+req.files[0].path+
                    "shop_picture:"+req.files[0].path,
                  );

      User.find({"_id":shopid}).update({
              'local.fullname': req.body.fullname,
              'local.contact_no': req.body.contact_no,
              'local.shop_logo':req.files[0].path,
              'local.shop_picture':req.files[1].path,
              'local.shopname':req.body.shopname,
              'local.updated_at': Date.now(),
      },function(err,data){

              if(err){
                res.json({status:err});
          }else{
              res.json({message:data});
          }
      });

    });

    module.exports = router;
