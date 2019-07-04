/* db setup */
const bcrypt = require('bcryptjs');
var appRoot = require('app-root-path');
var db = require(appRoot + '/models/db.js');
var passportLocalMongoose = require("passport-local-mongoose");
// mongoose.connect('mongodb:localhost/EcommerceDB');
const Schema = db.Schema;


const userSchema = new Schema({
  methods: {
            type: [String],
            required: true
           },
  local: {
            email: {
                     type: String,
                     unique: true,
                     sparse:true,
                    },
           profile_picture:{
                            type:String,
                          },

           fullname:{type: String,},
           gender:{ type:String},

           age:{type:String,},

           address:{type:String},

           status: {
                      type: String
                   },
           active : {
                    type: {type: Boolean, default: false}
                    },
          secretToken : String,

          password: {
                      type: String
                    },

          resetPasswordToken:{type: String},

          resetPasswordExpires: Date,

          following:[{
                        type: db.Schema.ObjectId,                 //following to other shops
                    }],


          location: {
                      type: Array, "default":[],

                    },

          shopkeeper: {
                        type:Boolean,
                      },

        shopname:{
                      type:String,
                    },



       shop_logo:{
                 type:String,
               },

      shop_picture:{
                   type:String,
                 },


          followers:[{
                        type:db.Schema.ObjectId,            //following by other shops
                    }],

          pan_no:{
                    type:String,
                  },

          contact_no:{
                      type:Number,
                     },


           created_at: {
                          type: Date,
                          default: Date.now,
                        },

           updated_at : {
                           type:Date,
                           default: Date.now,
},
  },
  facebook: {

    id:{type:String},

    email: {
      type: String,
      unique: true,
      sparse:true,

    },
    user:{
      type:String,
    },
    completeprofile:{
                      type:Boolean, Default:false
                    },
    fullname:{type: String,},

    address:{type:String},

    password: {
      type: String
    },


    following:[{
        type: db.Schema.ObjectId,                 //following to other shops
    }],

    location: {
        type: Array, "default":[],

    },

    shopkeeper: {
        type:Boolean,

    },

    shopname:{
        type:String,

    },


    shop_logo:{
                type:String,
              },

    shop_picture:{
                   type:String,
                 },

    followers:[{
        type:db.Schema.Types.ObjectId,            //following by other shops
    }],

    pan_no:{
        type:String,
    },

    contact_no:{
        type:Number,
    },


    created_at: {
        type: Date,
        default: Date.now,
    },

    updated_at : {
        type:Date,
        default: Date.now,
    },
  },

  google: {
    id: {
      type: String
    },
    email: {
      type: String,
      unique:true,
      sparse:true,
    },
    user:{
      type:String,
    },
    fullname:{
        type:String
      },

      location: {
          type: Array, "default":[],
      },
      completeprofile:{
                        type:Boolean, Default:false
                      },
      shop_logo:{
                  type:String,
                },

      shop_picture:{
                   type:String,
                },
          },

      pan_no:{
              type:String,
              },

     contact_no:{
                 type:Number,
            },

    created_at: {
                 type: Date,
                 default: Date.now,
                },

    updated_at : {
                   type:Date,
                   default: Date.now,
                 }

});
//userSchema.index({ "location.coordinates": "2dsphere" });

userSchema.pre('save', async function (next) {
  try {
    console.log('entered');
    if (!this.methods.includes('local')) {
      next();
    }
    //the user schema is instantiated
    const user = this;
    // if(user.password== null){
    //   console.log('password not found!')
    //   next();
    // }
    //check if the user has been modified to know if the password has already been hashed
    if (!user.isModified('local.password')) {
      next();
    }
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Generate a password hash (salt + hash)
      const passwordHash = await bcrypt.hash(this.local.password, salt);

    // Re-assign hashed version over original, plain text password
     this.local.password = passwordHash;

    console.log('exited');
    next();
  } catch (error) {
    console.log("error found");
    next(error);
  }
});


userSchema.methods.isValidPassword = async function (newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.local.password);
  } catch (error) {
    throw new Error(error);
  }
}

// Create a model
const User = db.model('user', userSchema);

// Export the model
module.exports = User;
