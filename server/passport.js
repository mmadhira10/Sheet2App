const googleStrat = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const dotenv = require('dotenv');

passport.use(
    new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "",
        scope: ["profile", "email"]
    },
    function (accessToken, refreshToken, profile, callback) {
        callback(null, profile);       
    }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((user, done) => {
    done(null, user);
})