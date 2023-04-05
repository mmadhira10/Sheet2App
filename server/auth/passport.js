const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/google/callback",
    passReqToCallback: true,
    scope: ["profile", "email"]
}, async (req, accessToken, refreshToken, profile, done) => {
    // const prof = profile._json;
    // const userData = {
    //     username: prof.email,
    //     firstname: prof.given_name,
    //     lastname: prof.family_name,
    //     picture: prof.picture
    // }
    // req._user = userData;
    // console.log(req.body);
    // console.log(accessToken);
    // console.log(refreshToken);
    // console.log(profile._json);
    // console.log(done(null, profile));
    done(null, profile);
}));

passport.serializeUser((user, done) => {
    // console.log("serialize");
	done(null, user);
});

passport.deserializeUser((user, done) => {
    // console.log("deserialize")
	done(null, user);
});

