const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose=require('mongoose');

const User= require('../../authentication/models/index.js');

const ControllersUser = require('../../authentication/controllers/users');
const {validateBody, schemas} = require('../../authentication/routes/helper/routehelper');
const passportJWT = passport.authenticate('jwt', { session: false });
const multer= require('multer');
var MongoClient = require('mongodb').MongoClient;
var url = require('../../authentication/models/db')
const Product = require('../../../models/product.model');
var upload = multer();
router.use(upload.array());


// //My part
//     //get user's profile
//     router.get('/:id',function(req,res,next){
//       user_id = req.params.id;
      
//       User.findOne({"_id":user_id,"shopkeeper":1},async function(err,data){
  
//           shop_item_details_recent=[];
//         try{  
//           await Product.find({"shop_id":user_id}).sort({create_date:-1}).find(function(err,data){
//               shop_item_details_recent.push(data);
//           });
  
//           shop_item_details_top_rated =[];
//           await Product.find({"shop_id":user_id}).sort({'rating.values':-1}).find(function(err,data){
//               shop_item_details_top_rated.push(data);
//           });
          
  
//           if(err){
//               response= {"error":true,"message":data}
//           }else{
//               response = {"error":false,"message":data,"item_details_recent":shop_item_details_recent,"item_details_top_rated":shop_item_details_top_rated};
//           }
//           res.json(response);
//       }catch(e){
//           console.error(e);
//       }
//       });
//   });



// //get shopkeeper's profile for editing
// router.get('/:id/edit',function(req,res,next){
//   user_id= req.params.id;
  

//   User.findOne({"_id":user_id,"shopkeeper":1},function(err,data){
//       if(err){
//           response= {"error":true,"message":data}
//       }else{
//           response = {"error":false,"message":data}
//       }
//       res.json(response);
//   });

// });

// //edit the shopkeeper profile
// router.put('/:id/edit',upload.array("images",2),function(req,res,next){
//   let shopid= req.params.id;

//    let {
//        firstname,
//        lastname,
//        shopname,
//        location,
//        pan_no,
//        contact_no,
//    }= req.body;

//    let updateObj={};
//    firstname && (updateObj.firstname = firstname);
//    lastname && (updateObj.lastname = lastname);
//    shopname && (updateObj.shopname = shopname);
//    location && (updateObj.location = location);    
//    pan_no && (updateObj.pan_no = pan_no);
//    contact_no && (updateObj.contact_no = contact_no);
   
//    updateObj.updated_at = Date.now();
   
//    updateObj.images = {
//        shop_logo : req.files[0].path,
//        shop_picture : req.files[1].path,
//    };
   
//    User.find({"_id":shopid}).update(updateObj,function(err,data){
//        if(err){
//            res.json(err);
//        }else{
//            res.json(data);
//        }
//    });




// //following the shop
// router.post('/follow/:id',passwortJWT,function(req,res,next){
    
//   var shopid= req.params.id;
//   console.log(shopid);
//   var userid="5cebf007d4a8bb31c3b49ddd";

//   User.findByIdAndUpdate({"_id":shopid},{
//       $push:{
//           followers:{
//               userid:userid
//           }
//       }
//   },function(err,data){
//       if(err){
//           res.json(err)
//       }else{
//           User.findByIdAndUpdate({"_id":userid},{
//               $push:{
//                   following:{
//                       shopid:shopid,
//                   }
//               }
//           },function(err,data){
//               if(err){
//                   res.json(err)
//               }else{
//                   res.json(data);
//               }
//           });
//       }
//     });
//   });

//   });
  
//       //unfollow the shop
//       router.post("/unfollow/:id",function(req,res,next){
//         shopid= req.params.id;
//         userid="5cebf007d4a8bb31c3b49ddd";
//         User.findByIdAndUpdate({"_id":shopid},{
//             $pull:{
//                 following:{
//                     userid: userid
//                 }
//             }
//         },function(err,data){
//             if(err){
//                 res.json(err)
//             }else{
//                 User.findByIdAndUpdate({"_id":userid},{
//                     $pull:{
//                         following:{
//                             shopid:shopid,
//                         }
//                     }
//                 },function(err,data){
//                     if(err){
//                         res.json(err);
//                     }else{
//                         res.json(data);
//                     }
//                 });
//             }
//         });
//     });




   //chake part



router.post('/completeprofile/:id',async(req, res, next)=>{


  const id = req.params.id;
  console.log(id);
  const name = req.body.name;
  const user = User.findOne({"_id":id});
  
  if(!user){
     res.status(404).json({satus:"error",error:"invalid user or user not found"});
  }

    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = url
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


//shop sign up
router.post('/signup',validateBody(schemas.authSchema1),ControllersUser.shopsignup);



//get shopkeeper's profile info
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
