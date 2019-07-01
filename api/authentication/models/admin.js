const bcrypt = require('bcryptjs');
var passportLocalMongoose = require("passport-local-mongoose");


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/1');
const Schema = mongoose.Schema;

const userSchema = new Schema({
   username: {type:
          String,
   },
   email:{type:
         String,
       },
   password:{type:
           String,
   },
   status:{type:
           String,
   },
})
const User = mongoose.model('admin',userSchema,'admin');

 module.exports = User;
