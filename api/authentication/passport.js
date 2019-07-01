/* PASSPORT AUTHENTICATION*/
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const User = require('./models/index');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const config = require('./configuration/index');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/1";


// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.JWT_SECRET,
  passReqToCallback: true,
}, async (req, payload, done) => {
  try {
    // Find the user specified in token
    console.log(req.header.Authorization);
    const user = await User.findById(payload.sub);
    // If user doesn't exists, handle it
    if (!user) {
      return done(null, false);
    }
    // Otherwise, return the user

    req.user = user;
    done(null, user);
  } catch(error) {
    done(error, false);
  }
}));


 passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField:'password'
  }, async (email, password, done) => {

        try {
          // Find the user given the email
          const user = await User.findOne({ "local.email": email });

          // If not, handle it
          if (!user) {
            return done(null, "1");
          }

          // Check if the password is correct
          const isMatch = await user.isValidPassword(password);

          // If not, handle it
          if (!isMatch)
          return done(null,"2");
          // Otherwise, return the user
        return done(null, user);
        } catch(error) {
          done(error, false);
        }
}));


// Google OAuth Strategy

passport.use('googleToken', new GoogleTokenStrategy({
  clientID: config.oauth.google.clientID,
  clientSecret: config.oauth.google.clientSecret,
  passReqToCallback: true,
}, async (req, accessToken, refreshToken,profile, done) => {
  try {
    // Could get accessed in two ways:
    // 1) When registering for the first time
    // 2) When linking account to the existing one

    // Should have full user profile over here
    const user11 = req.body.user;
    console.log("he is google"+ user11);
    console.log('profile', profile);
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);

    if (req.user) {
      // We're already logged in, time for linking account!
      // Add Google's data to an existing account
      req.user.methods.push('google')
      req.user.google = {
        id: profile.id,
        email: profile.emails[0].value,

      }
      await req.user.save()
      return done(null, req.user);
    } else {
      // We're in the account creation process
      let existingUser = await User.findOne({ "google.id": profile.id });
      if (existingUser) {
        console.log(existingUser.google.email);

               MongoClient.connect(url, { useNewUrlParser: true } , function(err, db) {
               if (err) throw err;
               var dbo = db.db("1");
               var myquery = { 'google.email':existingUser.google.email};
               console.log("myquery"+ myquery);
               var newvalues = { $set: {'google.user':user11} };
               dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
                 if (err) throw err;
                      console.log(res.result.nModified + " document(s) updated");
                 db.close();
               });
             });


        return done(null, existingUser);
      }

      // Check if we have someone with the same email
      existingUser = await User.findOne({ "local.email": profile.emails[0].value })
      if (existingUser) {
        if(existingUser.local.shopkeeper){
          console.log("he is the registered seller");
        // We want to merge google's data with local auth
        existingUser.methods.push('google')
        existingUser.google = {
          id: profile.id,
          email: profile.emails[0].value,
          completeprofile:true,

        }
      }
        else{
          console.log("he was a  registered customer and now wants to be seller");
          existingUser.methods.push('google')
          existingUser.google = {
            id: profile.id,
            email: profile.emails[0].value,
            completeprofile:false,

          }

        }

        await existingUser.save()
        return done(null, existingUser);
      }

      const newUser = new User({
        methods: ['google'],
        google: {
          id: profile.id,
          email: profile.emails[0].value,
          completeprofile:false,
          user:user11,
        }
      });

      await newUser.save();
      done(null, newUser);
    }
  } catch(error) {
    console.log(error);
    done(error, false, error.message);
  }
}));

passport.use('facebookToken', new FacebookTokenStrategy({
  clientID: config.oauth.facebook.clientID,
  clientSecret: config.oauth.facebook.clientSecret,
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
     const user11 = req.body.user;
     console.log("he is facebook" + user11);
  //  console.log('profile', profile);
//console.log('fuckyou');
    if (req.user) {
      // We're already logged in, time for linking account!
      console.log('profile', profile);
      // Add Facebook's data to an existing account
      req.user.methods.push('facebook');
      req.user.facebook = {
        id: profile.id,
        fullname:profie.first_name + profile.last_name,
        email: profile.emails[0].value,

      }
      await req.user.save();
      return done(null, req.user);
    } else
     {
      // We're in the account creation process
      let existingUser = await User.findOne({ "facebook.id": profile.id });
      if (existingUser) {
                            MongoClient.connect(url, { useNewUrlParser: true } , function(err, db) {
                            if (err) throw err;
                            var dbo = db.db("1");
                            var myquery = { 'facebook.email':existingUser.facebook.email};
                            console.log("myquery"+ myquery);
                            var newvalues = { $set: {'facebook.user':user11} };
                            dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
                              if (err) throw err;
                                   console.log(res.result.nModified + " document(s) updated");
                              db.close();
                            });
                          });


        return done(null, existingUser);
      }

      // Check if we have someone with the same email
      existingUser = await User.findOne({ "local.email": profile.emails[0].value });
      if (existingUser) {
        if(existingUser.local.shopkeeper){
          existingUser.methods.push('facebook')
          existingUser.facebook = {
            id: profile.id,
            email: profile.emails[0].value,
            fullname: profile.displayName,
            completeprofile:true,

          }
        }
        else{
        // We want to merge facebook's data with local auth
        if(user11==='customer'){
        existingUser.methods.push('facebook')
        existingUser.facebook = {
          id: profile.id,
          email: profile.emails[0].value,
          completeprofile:false,
          fullname: profile.displayName,
          user:user11

        }
      }
      else{


        existingUser.methods.push('facebook')
        existingUser.facebook = {
          id: profile.id,
          email: profile.emails[0].value,
          fullname: profile.displayName,
          completeprofile:false,
          user:user11
        }

      }
      }
        await existingUser.save()
        return done(null, existingUser);
      }


    }

    const newUser = new User({
      methods: ['facebook'],
      facebook: {
        id: profile.id,
        fullname: profile.displayName,
        email: profile.emails[0].value,
        completeprofile:false,
        user:user11,
      }

    });
  //added by alok for testing
    await newUser.save();
    console.log('fuckyou')
    done(null, newUser);
  } catch(error) {
    done(error, false, error.message);
  }
}));
