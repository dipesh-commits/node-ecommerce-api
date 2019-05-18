const express = require('express');
const router = express.Router();
var Product = require('../models/product.model');
var db = require('../models/db');
const path= require('path');
const multer = require('multer');
const sharp = require('sharp');


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


router.post('/',upload.array('image',3),(req,res)=>{
    console.log(req.files);
    res.json({'msg':'File uploaded successfully!',
        'file':req.files});
    });
    

//     console.log('req.myImage');
//     upload(req,res,(err)=>{
//         if(err){
//             response={"error":true,"message":"Image uplaoded failed"}
//         }else{
//             response={"error":false,"message":req.file.filename}
//             console.log(response);
//         }
//         res.json(response);
//     });
 

module.exports = router;