const router = require("express").Router();
// require("./passport");
const passport = require("passport");
const sessions = require("cookie-session");

router.get("/login/success", (req, res) => {
	// req.session.email = req.user;
	if (req.user) {
		// console.log(req.user);
		res.status(200).json({
			success: true,
			message: "Successfully Logged In",
			user: req.user,
		});
	} 
});

router.get("/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

// router.get("/google", passport.authenticate("google", {scope: ["profile", "email"]}));

router.get(
	"/google/callback",
	passport.authenticate("google", {
		successRedirect:  "http://localhost:3000/apps",
		failureRedirect: "/login/failed",
	}),
	(req, res) => {
		// console.log(req.user);
	}
);

router.get("/logout", (req, res) => {
	// req.session.destroy();
	req.logout();
	// res.redirect("http://localhost:3000/");
});

module.exports = router;    