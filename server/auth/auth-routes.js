const router = require("express").Router();
// require("./passport");
const passport = require("passport");
const sessions = require("cookie-session");
const { verifyUser } = require("./verify.js");

router.get("/test", verifyUser, (req, res) => {
	res.send("It works!");
})

router.get("/login/success", (req, res) => {
	if (req.user) {
		// console.log("14");
		res.status(200).json({
			success: true,
			message: "Successfully Logged In",
			user: req.user
		});
		// console.log(res);
	} 
	else{
        res.status(401).send("Must be loggedIn");
    }
});

router.get("/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

router.get("/google", passport.authenticate("google", {scope: ["profile", "email"]}));

router.get(
	"/google/callback",
	passport.authenticate("google", {
		scope: ["profile", "email"],
		successRedirect:  "http://localhost:3000/",
		failureRedirect: "/login/failed",
	}),
	(req, res) => {
		//console.log("hi");
	}	
);

router.get("/logout", (req, res) => {
	// console.log(req);
	req.logout();
	res.clearCookie("session");
	res.status(200).json({});
});

module.exports = router;    