const User = require('../models/index');
const express = require('express');
const router  = express.Router();

const mongoose=require('mongoose');
const randomString = require('randomstring');
const mailer = require('../MISC/mailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
var MongoClient = require('mongodb').MongoClient;
const url2 =require("../configuration");
const url = url2.url;
const multer = require('multer');
const upload = multer();
router.use(upload.array());

const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../configuration');

signToken = user => {
  return JWT.sign({
    iss: 'najikaiko',
    sub: user._id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
  }, JWT_SECRET);
}


module.exports=
 {
   edit: async(req,res, next)=>{
       const user = await User.findOne({'_id':req.params.id});
     if(!user){
       res.json({status:"error",message:"user not found or invalid user"});
     }
      console.log(user);

   var myquery = {'local.email':user.local.email};
   var newvalues = {$set: {'local.age':req.body.age,
                            'local.gender':req.body.gender,
                            'local.fullname':req.body.fullname,
                             'local.address':req.body.address} };
    User.findOneAndUpdate(myquery,newvalues,{new:true},(err,doc)=>{
      if(err)
      {
        console.log("error generated and  database not updated!")
        res.json({staus:"error",message:"error generated and database not updated!"})
      }
      console.log(doc);
    });
     res.status(200).json({success:"profile edited"});

    },
   signIn: async (req, res, next)=>{
     console.log("uservalue:"+req.user);

    //    console.log(req.user.local.status);
     if(req.user==="1")
     {
       res.json({status:"error",message:"no user found"});
     }
     if(req.user==="2")
     {
           res.json({status:"error",message:"password didn't match"});
     }

     const token = signToken(req.user);
     console.log("userstatus:"+req.user.local.status);
        if(req.user.local.status==='0')
         {
                 const secretToken = Math.floor(Math.random()*9000);
                 console.log("url"+ url);
                 console.log(secretToken);
                 const myquery = {'local.email':req.user.local.email};
                 const update_value = {$set:{'local.secretToken':secretToken}}
                  User.findOneAndUpdate(myquery,update_value,{new:true},(err,doc)=>{
                 if(err){
                   console.log('Error generated');
                 }else{
                 console.log(doc);
                 }

            });
        //          MongoClient.connect(url, function(err, db) {
        //          if (err) throw err;
        //          //var dbo = db.db("EcommerceDB");
        //  //        id=new MongoId
        //          var myquery = {'local.email':req.user.local.email};

        //          var newvalues = {'local.secretToken':secretToken} ;
        //          db.collection("users").updateOne(myquery, newvalues, function(err, res) {
        //            if (err) throw err;
        //            console.log(res.result.nModified + " document(s) updated");
        //            db.close();
        //          });
        //        });

             const html = `hi there,
             <br/>
             thank you for registering!
             Please verify your email by typing the secret token provided below:
             <br/><br/>
             <br/><br/>
            Verification Code: <b>${secretToken}</b>
             <br/>
             Have a pleasant day!`

            await mailer.sendEmail('najikaikopasal@gmail.com',req.user.local.email, 'Please verify your email', html);
             console.log('please check your email');
             res.json({status:"success",messasge:'you need to verify first',verify:"no",userid:req.user._id,verificationtoken:secretToken,jwttoken:token});

          }
        if(req.user.local.completeprofile=='0')
        {
          res.json({status:"error",messasge:'you need to complete profile first'});
        }
        else {
          if(req.user.local.status=='1')
          {


            res.status(200).json({status:'success',
                                  verify:"yes",
                                  success:"successfully logged in",
                                  jwttoken:token,
                                  userid:req.user._id,

                                 });
           }
        }
        res.json({status:"error",message:req.user});
      },
   shopsignup: async (req, res, next) => {
     console.log('shopsignup');
     const { shopname,fullname,email,password,address} = req.body;
     console.log(req.body);
      //  Check if there is a user with the same email
      let foundUser = await User.findOne({ "local.email": email });
      if (foundUser) {
       return res.status(403).json({status:"error", error: 'Email is already in use'});

      }
      // Is there a Google account with the same email?
      foundUser = await User.findOne({ "google.email": email });
      if (foundUser) {
        // Let's merge them?
        foundUser.methods.push('local')
        foundUser.local = {
          email: email,
          password: password
        }
        // Generate the token
       const token = signToken(foundUser);
       // Respond with token
    res.status(200).json({ token });
        await foundUser.save();
      }

      // Is there a Google account with the same email?
      foundUser = await User.findOne({ "facebook.email": email });
      if (foundUser) {
        // Let's merge them?
        foundUser.methods.push('local')
        foundUser.local = {
          email: email,
          password: password
        }
              // Generate the token
        const token = signToken(foundUser);
        // Respond with token
        res.status(200).json({ token });

        await foundUser.save();
      }
      // Generate the token
          const secretToken = Math.floor(Math.random()*9000);
       //  Create a new user
       // console.log(req.body.location[0]);
       // console.log(req.body.location[1]);
      let newUser = new User({
         methods: ['local'],
         local: {
          email: email,
          password: password,
          shopname: shopname,
          fullname: fullname,
          address: address,
          shopkeeper:1,
          secretToken: secretToken,
          active: false,
          status:'0',
        //  location:[req.body.location[0],req.body.location[1]]
        }
      });

      // Generate the token
      const token = signToken(newUser);

      await newUser.save()
      .then(function(doc){
        console.log(doc);
      })
      .catch(function(err){
          console.error("error"+err);
      })
      //Compose an Email
      const html = `hi there,
      <br/>
      thank you for registering!
      <br/><br/>
      Please verify your email by typing the secret token provided below:
      <br/><br/>
      Secret Token: <b>${secretToken}</b>
      <br/>
      Have a pleasant day!`

      await mailer.sendEmail('najikaikopasal@gmail.com',email, 'Please verify your email', html);
      console.log('please check your email');


      res.status(200).json({status:"success",success:"successfully signed up",verificationtoken:newUser.local.secretToken,userid:newUser._id,jwttoken:token});

      },
   newpassword: async(req, res,next)=>{
     const newpassword= req.body.newpassword;
      console.log("gfdgdfgf:"+newpassword);
      const id = req.params.id;
      const user = await User.findOne({"_id":id});
    //  console.log(user);
       if(!user){
         res.status(204).status({error:"no user found"});
       }
       const salt =await  bcrypt.genSalt(10);
       // Generate a password hash (salt + hash)
       const passwordHash = await bcrypt.hash(newpassword, salt);
       console.log(passwordHash);

       MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
       if (err) throw err;
       var dbo = db.db("1");
//        id=new MongoId

       var myquery = {'local.email':user.local.email};
       var newvalues = {$set: {'local.password':passwordHash} };
       dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
         if (err) throw err;
         console.log(res.result.nModified + " document(s) updated");
         db.close();
       });
     });

     res.status(200).json({success:"new password has been created"});
   },
   signUp: async (req, res, next) => {

          const { fullname,email,password,address,age,gender } = req.body;


          //  Check if there is a user with the same email
            let foundUser = await User.findOne({ "local.email": email });
            if (foundUser) {
              return res.status(403).json({status:"error", error: 'Email is already in use'});
            }

            // Is there a Google account with the same email?
            foundUser = await User.findOne({ "google.email": email });
            if (foundUser) {
              // Let's merge them?
              foundUser.methods.push('local')
              foundUser.local = {
                email: email,
                password: password
              }
                      // Generate the token
          const token = signToken(foundUser);
          // Respond with token
          res.status(200).json({ token });
              await foundUser.save()
              // Generate the token

            }

            // Is there a Google account with the same email?
            foundUser = await User.findOne({ "facebook.email": email });
            if (foundUser) {
              // Let's merge them?
              foundUser.methods.push('local')
              foundUser.local = {
                email: email,
                password: password
              }
                        // Generate the token
             const token = signToken(foundUser);
             // Respond with token
             res.status(200).json({ token });
              // Respond with token
              res.status(200).json({ token });
            }
            // Generate the token


          const secretToken = randomString.generate(4);
          //  Create a new
          console.log(req.body.location[0]);
          console.log(req.body.location[1]);

             let newUser = new User({
               methods: ['local'],
               local: {
                fullname:fullname,
                email: email,
                password: password,
                address: address,
                age: age,
                gender: gender,
                shopkeeper:0,
                secretToken: secretToken,
                active: false,
                status:'0',
                location:[req.body.location[0],req.body.location[1]]
              }

            });

                      // Generate the token
            const token = signToken(newUser);
            // Respond with token

            await newUser.save();
            //Compose an Email
          const html = `hi there,
          <br/>
          thank you for registering!
          <br/><br/>
           Please verify your email by typing the secret token provided below:
          <br/><br/>
          Secret Token: <b>${secretToken}</b>
          <br/>
          Have a pleasant day!`

          await mailer.sendEmail('072bex401.aatish@pcampus.edu.np',email, 'Please verify your email', html);
          console.log('please check your email');
          res.status(200).json({status:"success", success: "successfully signed in",userid: newUser._id,verificationtoken:newUser.local.secretToken,jwttoken:token});

},
   verify: async (req, res, next) => {
          console.log('fuck assish');
         const  {secretToken} = req.body;
         console.log(secretToken);
         console.log(req.params.id);
         const user = await User.findOne({"_id":req.params.id});
            if(!user)
             {
               res.status(404).json({status:"error",message:"secretToken not valid or found"});
             }

             var myquery = {'local.email':user.local.email};
             var newvalues = {$set: {'local.secretToken':'','local.status':1,'local.active':true} };
             User.findOneAndUpdate(myquery, newvalues,{new:true},(err,doc)=> {
              if (err) {
                          console.log("error generated and not verified");
                           res.json({status:"error",message:"error occurred and not verified!"});
                        }
              else {
                    console.log(doc);
                   }
               });
            res.status(200).json({status:"success",message:'email verified!'});
          },

   forgot: async(req, res, next) => {
         const {email} = req.body;

          var token2 = Math.floor(Math.random()*9000);
          var token1 = token2.toString('hex');

         const user =   await User.findOne({ 'local.email': email });
              if (!user) {
                    res.status(403).json({error:"email already in use"});

               }
               var myquery = {'local.email':email};
               var newvalues = {$set: {'local.resetPasswordToken':token1,'local.resetPasswordExpires':Date.now() + 3600000} };
                User.findOneAndUpdate(myquery,newvalues,{new:true},(err, doc)=>{
                 if (err){
                   console.log("error generated and not database updated!");
                   res.json({status:"error",message:"error generated and not database updated"});
                 }
                 console.log("database updated");
                 console.log(doc);
               });

                console.log('secret token for  generation of new password!');
               //Compose an Email
               const html = `You are receiving this because you (or someone else) have requested the reset of the password for your account.
                             <br/>
                             Please click on the following link, or paste this token to our app to complete the process:<br/><br/>
                             Token: <b>${token1}</b>
                             <br/><br/>
                 If you did not request this, please ignore this email and your password will remain unchanged.`

               await mailer.sendEmail('najikaikopasal@gmail.com',email, 'Please check  your email', html);
               console.log('please check your email');

              res.status(200).json({success:'successfully resent the token for resetting the password!'});
           },

   resetpassword: async(req, res, next) =>{

     const resetToken= req.body.resetToken;
     console.log("we are here");
     console.log(req.body);
     console.log(resetToken);
     //find the secretToken
     const user = await User.findOne({"local.resetPasswordToken": resetToken});
        // res.send('fuck you man ');
          if(!user)
           {
            res.status(404).json({status:"error",message:'resetToken not valid or found'});
           }
            var myquery = {'local.resetPasswordToken':resetToken};
            var newvalues = {$set: {'local.resetPasswordToken':'','local.resetPasswordExpires':'','local.password':''} };
            User.findOneAndUpdate(myquery,newvalues,{new:true},(err,doc)=>{
              if (err){
                console.log("error generated and not database updated!");
                res.json({status:"error",message:"error generated and not database updated"});
              }
              console.log("database updated");
              console.log(doc);
              });
             const token = signToken(user);
           res.status(200).json({status:"success",message:"resetToken matched!",verificationtoken:token,userid:user._id});

   },
   additionalinfo: async(req, res, next) =>{
     console.log(req.params.id);
     const id = req.params.id;
     const name = req.body.name;
     const user =await User.findOne({"_id":id});
     console.log(user);
     if(!user){
        res.status(404).json({satus:"error",error:"invalid user or user not found"});
     }


       var myquery = {'_id':id};
       var a1= name +'.shopname';
       var a2=  name +'.fullname';
       var a3= name +'.address';
       var a4= name +'.location';

       var datas={[a1]:req.body.shopname,
                  [a2] :req.body.fullname,
                  [a3]:req.body.address,
                  [a4]:[req.body.location[0],req.body.location[1]]
                }
      console.log(datas);
      var myquery = {'_id':mongoose.Types.ObjectId(id)};
      var newvalues = {$set: datas };
      User.findOneAndUpdate(myquery,newvalues,{new:true},(err,doc)=>{
        if(err){
          console.log("error generated and not updated!");
          res.json({status:"error",message:"error generated and not updated!"});
        }
      });
      res.status(200).json({success:'info updated'});

   },
   googleOAuth: async (req, res, next) => {
  // Generate token

      const user11 = req.user.google.user;
      console.log("fuck you" + user11);
      const token = signToken(req.user);
      if(user11==="seller")
      {
            console.log(req.user.google.completeprofile);

            if(!req.user.google.completeprofile){
              console.log(req.user.google.completeprofile);
              res.status(200).json({status:'pending',message:'profile neededto be completed',userid:req.user._id,jwttoken:token});
            }
            else{
           res.status(200).json({status:'success',
                                 message:'seller has successfully logged in',
                                 userid:req.user._id,
                                 jwttoken:token,
                                 userid:req.user._id,
                                 fullname:req.user.google.fullname,
                                 address:req.user.google.address,
                                 location:req.user.google.location,
                                 email:req.user.google.email,
                                  });
             }
           }
             else{
               console.log("user is customer");
               res.status(200).json({status:'success',
                                     message:'user has successfully logged in',
                                     userid:req.user._id,
                                     jwttoken:token,
                                     userid:req.user._id,
                                     fullname:req.user.google.fullname,
                                     address:req.user.google.address,
                                     location:req.user.google.location,
                                     email:req.user.google.email,
                                     age:req.user.google.age,
                                     gender:req.user.google.gender
                                   });

             }
},

   linkGoogle: async (req, res, next) => {
  res.json({
    success: true,
    methods: req.user.methods,
    message: 'Successfully linked account with Google'
  });
},

   facebookOAuth: async (req, res, next) => {
      // console.log(req.user.local.completeprofile);
      console.log(req.user.facebook.user);
    const user11 = req.user.facebook.user;
    console.log(user11);
     const token = signToken(req.user);
    if(user11==="seller")
    {

       if(!req.user.facebook.completeprofile){
         console.log(req.user.facebook.completeprofile);
         res.status(200).json({status:'pending',message:'profile neededto be completed',userid:req.user._id,jwttoken:token});
       }
     else{
       res.status(200).json({status:'success',
                            message:'seller has successfully logged in',
                            jwttoken:token,
                            userid:req.user._id,
                            fullname:req.user.faceboook.fullname,
                            address:req.user.facebook.address,
                            location:req.user.facebook.location,
                            email:req.user.facebook.email,
                            });
        }
      }
      else{
                    res.status(200).json({status:'success',
                             message:'customer has successfully logged in',
                             jwttoken:token,
                             userid:req.user._id,
                             fullname:req.user.facebook.fullname,
                             address:req.user.facebook.address,
                              location:req.user.facebook.location,
                              email:req.user.facebook.email,
                              age:req.user.facebook.age,
                              gender:req.user.facebook.gender,
                           });

      }
},


   linkFacebook: async (req, res, next) => {
      res.json({
      success: true,
      methods: req.user.methods,
      message: 'Successfully linked account with Facebook'
      });
  },

 }
