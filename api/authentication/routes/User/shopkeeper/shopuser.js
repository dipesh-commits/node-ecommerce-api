const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose=require('mongoose');
const User= require('../../../models/index');
const ControllersUser = require('../../../controllers/users');
const {validateBody, schemas} = require('../../helper/routehelper');
const passportJWT = passport.authenticate('jwt', { session: false });
const multer= require('multer');
var MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost/1';
var upload = multer();
router.use(upload.array());

router.post('/completeprofile/:id',passportJWT,async(req, res, next)=>{


  const id = req.params.id;
  console.log(id);
  const name = req.body.name;
  const user = User.findOne({"_id":id});
  console.log(user);
  if(!user){
     res.status(404).json({satus:"error",error:"invalid user or user not found"});
  }

    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("1");
//        id=new MongoId
    var myquery = {'_id':id};
    var a1= name +'.contact_no';
    var a2=  name +'.pan_no';
    var a3= name +'.address';
    var a4= name +'.location';
    var a5=  name +'.shopkeeper';
    var a6= name +'.shopname';
    var a7 = name +'.completeprofile'


    var datas={[a1]:req.body.contact_no,
               [a2] :req.body.pan_no,
               [a3]:req.body.address,
               //[a4]:[req.body.location[0],req.body.location[1]],
               [a5]:true,
               [a6]:req.body.shopname,
               [a7]:true
             }
   console.log(datas);
     var myquery = {'_id':mongoose.Types.ObjectId(id)};
    var newvalues = {$set: datas };

      dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
      console.log(res.result.nModified + " document(s) updated");
      db.close();
    });

  });

res.status(200).json({status:'success', message:'info updated'});
});
router.post('/signup',validateBody(schemas.authSchema1),ControllersUser.shopsignup);

//get shopkeeper's profile for editing
router.get('/profileinfo/:id',passportJWT, async(req,res,next)=>{
   try { const user1= await User.findOne({"_id":req.params.id});

        if(!user1){
            res.json({error:true,message:"no shopkeeper found"})
        }else{
            res.json({status:true,
              fullname:user1.local.fullname,
              address:user1.local.address,
              age:user1.local.age,
              gender:user1.local.gender})
        }
}catch(err){
  res.json({status:true,message:err});
}
    });


//edit the shopkeeper profile
router.post('/edit/:id',passportJWT,ControllersUser.additionalinfo);

module.exports = router;
