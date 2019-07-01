const express = require('express');
const router  = express.Router();
const passport = require('passport');
const User = require('../../models/index');
const UsersController = require('../../controllers/users');
const {validateBody,schemas}=require('../helper/routehelper');
const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });
const multer= require('multer');
var upload = multer();
router.use(upload.array());
//for registration
router.post('/',function(req,res){
    console.log(req.body);
     res.status(200).json({success:true,message:"successfully posted"});
});
router.route('/signup').post(validateBody(schemas.authSchema), UsersController.signUp);

//for verification
router.post('/verify/:id',passportJWT,UsersController.verify);

//for login
router.post('/login',passportSignIn,UsersController.signIn);



router.post('/edit/:id',passportJWT,upload.array("images",1),UsersController.edit );

 // GET route after registering
 router.get('/profile/:id',passportJWT, async (req, res, next)=> {
    const user1 =  await User.findOne({"_id":req.params.id});
        res.json({status:'success',
                  fullname:user1.local.fullname,
                  address:user1.local.address,
                  age:user1.local.age,
                  gender:user1.local.gender
                });
      });

//for generating reset keyp
router.route('/forgot').post(UsersController.forgot);

 //for reseting password
 router.post('/resetpassword',UsersController.resetpassword);

//for generating new password
 router.post('/newpassword/:id',passportJWT,UsersController.newpassword);

module.exports = router;
