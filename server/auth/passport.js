const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const dotenv = require('dotenv').config()

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: 'http://localhost:4000/auth/google/callback',
      passReqToCallback: true,
      scope: ['profile', 'email'],
    },
    async (req, accessToken, refreshToken, profile, done) => {
      // let strid = (user.id).toString();
      // if (users.size == 0 || users.has(strid))
      // {
      //     users.set(strid, user);
      // }
      done(null, profile)
    }
  )
)

passport.serializeUser((user, done) => {
  // console.log("serialize");
  // let strid = (user.id).toString();
  // if (users.size == 0 || users.has(strid))
  // {
  //     users.set(strid, user);
  // }
  done(null, user)
})

passport.deserializeUser((user, done) => {
  // console.log("deserialize")
  // let strid = id.toString();
  // if (users.has(strid)){
  //     done(null, users[strid]);
  // }
  // else {
  //     done(null, user)
  // }
  done(null, user)
})
