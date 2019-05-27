const express = require('express');

const router = express.Router();
const User= require('../models/user.model');
const mongoose=require('mongoose');
const multer= require('multer');
const Product = require('../models/product.model');


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
    limits: {filesize:200000},
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


    //get user's profile
router.get('/:id',function(req,res,next){
    user_id = req.params.id;
    
    User.findOne({"_id":user_id,"shopkeeper":1},async function(err,data){

        shop_item_details_recent=[];
      try{  
        await Product.find({"shop_id":user_id}).sort({create_date:-1}).find(function(err,data){
            shop_item_details_recent.push(data);
        });

        shop_item_details_top_rated =[];
        await Product.find({"shop_id":user_id}).sort({'rating.values':-1}).find(function(err,data){
            shop_item_details_top_rated.push(data);
        });
        

        if(err){
            response= {"error":true,"message":data}
        }else{
            response = {"error":false,"message":data,"item_details_recent":shop_item_details_recent,"item_details_top_rated":shop_item_details_top_rated};
        }
        res.json(response);
    }catch(e){
        console.error(e);
    }
    });
});


//get shopkeeper's profile for editing
router.get('/:id/edit',function(req,res,next){
    user_id= req.params.id;
    

    User.findOne({"_id":user_id,"shopkeeper":1},function(err,data){
        if(err){
            response= {"error":true,"message":data}
        }else{
            response = {"error":false,"message":data}
        }
        res.json(response);
    });

});

//edit the shopkeeper profile
router.put('/:id/edit',upload.array("images",2),function(req,res,next){
   let shopid= req.params.id;

    let {
        firstname,
        lastname,
        shopname,
        location,
        pan_no,
        contact_no,
    }= req.body;

    let updateObj={};
    firstname && (updateObj.firstname = firstname);
    lastname && (updateObj.lastname = lastname);
    shopname && (updateObj.shopname = shopname);
    location && (updateObj.location = location);    
    pan_no && (updateObj.pan_no = pan_no);
    contact_no && (updateObj.contact_no = contact_no);
    
    updateObj.updated_at = Date.now();
    updateObj.images = {
        shop_logo : req.files[0].path,
        shop_picture : req.files[1].path,
    };
    
    User.find({"_id":shopid}).update(updateObj,function(err,data){
        if(err){
            res.json(err);
        }else{
            res.json(data);
        }
    });

    // console.log(req.body);

    // User.find({"_id":shopid}).update({
    //         pan_no: req.body.pan_no,
    //         contact_no : req.body.contact_no,
    //         images:{
    //             shop_logo:req.files[0].path,
    //             shop_picture: req.files[1].path,
    //         },
    //         shopname:req.body.shopname,
    //         updated_at: Date.now(),
    // },function(err,data){
    //     if(err){    
    //         res.json(err);
    //     }else{
    //         res.json(data);
    //     }
    // });
    
});


    
//     // User.findOneAndUpdate({"_id":shopid},{
//     //     $set:{
//     //         firstname:req.body.firstname,
//     //         lastname: req.body.lastname,
//     //         pan_no: req.body.pan_no,
//     //         contact_no : req.body.contact_no,
//     //         images:{
//     //             shop_logo:req.files[0].path,
//     //             shop_picture: req.files[1].path,
//     //         },
//     //         shopname:req.body.shopname,
//     //         updated_at: Date.now(),


          
//     //     },
//     // },
        
//     //     {
//     //         upsert:true,
//         //}

//     function(err,data){
//         if(err){
//             console.log(err);
//         }else{
//             res.json(data);
//             console.log(data);
//         }
//     });

    
// })


//signing up the user
router.post('/',function(req,res,next){
    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        shopname: req.body.shopname,
        email: req.body.email,
        password : req.body.password,
        location:{
            type:"Point",
            coordinates:[-112.1102492,36.098048]
        },
        // geo : [{lat:req.body.lat,lng:req.body.lng}],
        followers : req.body.followers,
        following : req.body.following,


        shopkeeper: '1',
        created_at: Date.now(),
        updated_at : Date.now(),

    });
    user.save()
    .then(function(doc){
        console.log(doc);
    })
    .catch(function(err){
        console.error(err);
    })
});

// router.put('/editprofile/:id',upload.array('images',2),function(req,res,next){
//     id= req.params.id;
//     console.log(req.files);
   
//     User.update({_id:id},
    
//         {
//             $set:{
//             shopname: req.body.shopname,
//             pan_no:req.body.pan_no,
//             contact_no:req.body.contact_no,
//             images:{
//                 shop_logo:req.files[0].path,
//                 shop_picture: req.files[1].path,
//             },
           
//         }
//     },
//     {
//         upsert:true,multi:true
//     }).then(doc=>{
//         console.log(doc);
//         res.json(doc);
//     }).catch(err=> 
//             {
//             console.error(err);
//         })
// });



module.exports = router;