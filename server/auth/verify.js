module.exports.verifyUser = (req, res, next) => {
    // console.log(req.cookies);
    if(req.user)
    {
        next();
    }
    else{
        res.status(401).send("Must be loggedIn");
    }
}