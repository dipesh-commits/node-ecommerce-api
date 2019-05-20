const mongoose = require('mongoose');
const db = require('./db');

var UserSchema= db.Schema({
    firstname : {
        type: String,
        required: true,
    },
    lastname: {
        type:String,
        required: true,
    },
    
    email: {
        type: String,
        required: true,
        unique : true,
    },

    password:{
        type: String,
        required: true,
    },


    following:{
        type: mongoose.Schema.ObjectId,
    },


    location: {
        type: [Number],
        index : '2d',
    },

    // geo:{
    //     // // type:{
    //     // //     type:String,
    //     // //     enum:['Point'],
    //     // //     required: true,
    //     // },
    //     coordinates:{
    //         type:[Number],
    //         required:true,
    //     }
    // },



    shopkeeper: {
        type:Boolean,
        required:true,
    },

    created_at: {
        type: Date,
        default: Date.now,
    },

    updated_at : {
        type:Date,
        default: Date.now,
    },
});

module.exports = db.model('User',UserSchema);