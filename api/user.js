const express = require('express');

const router = express.Router();
const User= require('../models/user.model');


router.get('/:id',function(req,res,next){
    user_id = req.params.id;
    User.findOne({"_id":user_id,"shopkeeper":0},function(err,data){
        if(err){
            response= {"error":true,"message":data}
        }else{
            response = {"error":false,"message":data}
        }
        res.json(response);
    });
    
});


router.post('/',function(req,res,next){
    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password : req.body.password,
        location:[req.body.location[0],req.body.location[1]],
        // geo : [{lat:req.body.lat,lng:req.body.lng}],

        shopkeeper: '1',
        created_at: req.body.created_at,
        updated_at : req.body.updated_at

    });
    user.save()
    .then(function(doc){
        console.log(doc);
    })
    .catch(function(err){
        console.error(err);
    })
});

module.exports = router;