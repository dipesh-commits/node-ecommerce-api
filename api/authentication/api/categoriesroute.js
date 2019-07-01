const express = require('express');
const router= express.Router();
var db = require('../models/db');
var Product = require('../models/product.model');
const Category= require('../models/category.model');
const multer = require('multer');
const upload = multer();

router.use(upload.array());

// //getting all the parent categories
// router.get('/',function(req,res,next){
//     var categories=[];
//     Category.find({parent:/^\/$/},function(err,data){
            


//             // for(var i =0 ; i<data.length;i++){
//             //     console.log(categories[i].category);
//     // }
//     res.json(data);
// });
        
// });

// //getting the categories next to the parent category
// router.get('/:secondcategory',function(req,res,next){
//     secondcategory = req.params.secondcategory;
//     console.log(secondcategory);
//     Category.find({"parent":{$regex:secondcategory}},function(err,data){
//         // if(err){
//         //     response = {"error":true,"message":data}
//         // }else{
//         //     response = {"error":false,"message":data}
//         // }
//         // console.log(response);
//         // res.json(response);
//         res.json(data);
//         console.log(data);
//     });
// });

// router.get('/:secondcategory/:thirdcategory',function(req,res,next){
//     secondcategory = req.params.secondcategory;
//     thirdcategory = req.params.thirdcategory;
//     Category.find({"parent":{$regex:secondcategory}},function(err,data){
//         if(err){
//             errresponse = {"error":true,"message":data}
//             res.json(errresponse);
//         }else{
//             Category.find({"name":{$regex:thirdcategory}},function(err,data){
//                 if(err){
//                     response={"error":true,"message":data}
//                 }else{
//                     response = {"error":false,"message":data}
//                 }
//                 res.json(response);

//             });
            
//         }
//     });
// });



// //getting the categories list
// router.get('/:categories',function(req,res){
//     category = req.params.categories;
    

//     Product.find({"name":category},function(err,data){
//         if(err){
//             response = {"error":true , "message":data};
//         }else{
//             response = {"error":false , "message":data};
//         }
//         res.json(response);
    

//     });
   
// });


// //getting the category list as said by front end
// router.get('/allcategory',function(req,res,next){
//     var categories=[];
//         Category.find({"parent":/^\/$/},function(err,data){
            
//             categories=data;
//             // categories.push(data);
//             if(err){
//                 res.send(err);
//             }else{
//                 for(i=0;i<categories.length;i++){
//                     name1=categories[i].name;
//                     Category.find({parent:{$regex:name1}
                        
//                     },function(err,data){
//                         if(err){
//                             res.json(err)
//                         }else{
//                             res.json(data);
//                         }
                
                
                

                
            
//             });
//                 }
//         }
//     });

// });


//adding the parent category
router.post('/parentcategory/add',function(req,res,next){
    console.log(req.body);
    var category = new Category({
        parent_category_name: req.body.category,
       
        created_at:Date.now(),
        updated_at : Date.now(),
    });
    category.save()
    .then(function(doc){
        res.json(doc);
    })
    .catch(function(err){
        console.error(err);
    });


});

//adding the child category
router.post("/childcategory/:parentcategory",function(req,res,next){
    parentcategory = req.params.parentcategory;
    Category.update({"parent_category_name":parentcategory},
    {
        
        $push:{
            child_category_name: req.body.child_category,
        
    }
    },{strict:false},function(err,data){
        if(err){
            res.json(err);
        }else{
            res.json(data);
        }
    })
})





//adding the child category list
router.post("/childsubcategory/:parentcategory/:childcategory",async function(req,res,next){
    parentcategory = req.params.parentcategory;
    childcategory = req.params.childcategory;
    await Category.find({"parent_category_name":parentcategory},async function(err,data){
        if(err){
            res.json(err);
        }else{
            await Category.update({"child_category_name":childcategory},{
                $push:{
                    child_subcategory_name : req.body.child_subcategory
                }
            },{strict:false},function(err,data){
                if(err){
                    res.json(err);
                }else{
                    res.json(data);
                }
            })
        }
    })
})








module.exports = router;
