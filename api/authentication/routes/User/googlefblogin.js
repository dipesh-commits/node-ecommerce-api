const express = require('express');
const router  = express.Router();
const passport = require('passport');
const passportJWT = passport.authenticate('jwt', { session: false });
const UsersController = require('../../controllers/users');
const multer= require('multer');

var upload = multer();
router.use(upload.array());


router.route('/oauth/google')
   .post(passport.authenticate('googleToken',{session:false}), UsersController.googleOAuth);


router.route('/oauth/facebook')
  .post(passport.authenticate('facebookToken', { session: false }), UsersController.facebookOAuth);

router.route('/oauth/link/google')
  .post( passport.authorize('googleToken', { session: false }), UsersController.linkGoogle)

  router.route('/oauth/link/facebook')
    .post(passport.authorize('facebookToken', { session: false }), UsersController.linkFacebook)
module.exports = router;
