const express = require('express');
const router = express.Router();
var Product = require('../models/product.model');
var db = require('../models/db');
const path= require('path');
const multer = require('multer');
const sharp = require('sharp');
const Category =require('../models/category.model');




//Creating the Storage engine

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/product_images/')
    },
    filename: function(req,file,cb){
        
        cb(null,file.fieldname+'-'+Date.now()+"-"+
         file.originalname);
    }
});

//Init Upload
const upload=multer({
    storage: storage,
    limits:{fileSize:2000000},
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
});

// //Check File Type
function checkFileType(file,cb){
    // const filetypes ='/jpeg|jpg|png|gif';
    // const extname =filetypes.test(path.extname(file.originalname).toLowerCase());
    // const mimetype = filetypes.test(file.mimetype);

    // if(mimetype && extname){
    //     return cb(null,true);
    // }else{
    //     cb('Error:Image Only!');
    // }
    if(file.mimetype ==='image/jpeg' || file.mimetype==='image/png' || file.mimetype==='image/gif' ||file.mimetype ==='image/jpg'){
        cb(null,true);

        }else
        {
            cb(null,false); //rejects storing a file
        }
    }


//getting the categories for adding the new product
router.get('/',function(req,res,next){
    Category.find({}).find(function(err,data){
        if(err){
            response= {"error":true,"message":data}
        }else{
            response = {"error":false,"message":data}
        }
        res.json(response);
    });
});


//creating the product
router.post('/',upload.array('productImages',3),function(req,res,next){

    
    console.log(req.files);

  
    
    const prod = new Product({
        
        name: req.body.name,
        specs: {
        
        description: req.body.description,
        price: req.body.price,
        discount: req.body.discount,
        gender: req.body.gender,
        size: [{
            size_value : req.body.size_value,
       
            color_details : [{
                        color_value : req.body.color_value,
                        quantity : req.body.quantity
        }],
        }],
           tags: req.body.tags,
        },
        
        productImages:{
            image1:req.files[0].path,
            image2: req.files[1].path,
            image3: req.files[2].path,
        },
        
        brand: req.body.brand,

        product_details : req.body.product_details,
        shop_id : req.body.shop_id,

        views:req.body.views,

    //    rating:[{
    //         userid:req.body.userid,
    //         values: req.body.values
    //     }],

    //     review : [{

    //     user_id:req.body.user_id,
            
    //         comment_details:{

    //             comment: req.body.comment,
    //             likes: req.body.likes,
    //         },  

    //         created_at :Date.now,
    //         }],
        
        categories: req.body.categories,

        status:'1',
        created_at : Date.now(),
        updated_at : Date.now()
    });

    

    // prod.save(function(err,data){
    //     if(err){
    //         response = {"error":true,"message":data}
    //     }else{
    //         response = {"error":false,"message":data}
    //     }
    //     res.json(response);

    // });
    prod.save()
        .then(function(doc){
            res.json(doc);
        })

//     .then(doc=>{
//         // console.log(JSON.stringify(doc,null,4));
//         res.json(doc);
//     })
// }

    // catch(err){
    //     // console.log(err.message);
    //     res.json(err.message);
    // }
    .catch(err=>{
        console.error(err);
        res.send(err);
    })
 });

 //update the rating and review of the product
 



//update the product
router.put('/:id',function(req,res,next){
    product_id= req.params.id;
    Product.findByIdAndUpdate({'_id':product_id},{
        $set:{
            name: req.body.name,
            specs: {
            
            description: req.body.description,
            price: req.body.price,
            gender: req.body.gender,
            size: [{
                size_value : req.body.size_value,
           
            color_details : [{
                color_value : req.body.color_value,
                quantity : req.body.quantity
            }],
            }],
               tags: req.body.tags,
            },
            
            productImages:{
                image1:req.files[0].path,
                image2: req.files[1].path,
                image3: req.files[2].path,
            },

            shop_id: req.body.shop_id,
            
            brand: req.body.brand,
    
           rating:{
            values: req.body.values
        },
            // rating: req.body.rating,
            
            // values:req.body.values,
            
            review : [{
    
            user_id:req.body.user_id,
                
                comment_details:{
    
                    comment: req.body.comment,
                    likes: req.body.likes,
                },  
                }],
            
           categories: {
            parent_category:req.body.parent_category,
            child_category:req.body.child_category,
        },
            
            
            updated_date : Date.now(),
        }
    },function(err,data){
        if(err){
            response={"error":true,"message":data}
        }else{
            response={"error":false,"message":data}
        }
        res.json(response);
    });
    
});





//delete the product
 router.delete('/:id',function(req,res,err){
     productid= req.params.id;
     Product.findByIdAndUpdate({'_id':productid},{
     $set:{
        status:'0',
     
    }
},
     function(err,data){
         if(err){
             response= {"error":true,"message":data};
         }else{
             response={"error":false,"message":data};
         }
     });
 });




module.exports = router;