const jwt = require("jsonwebtoken");

function authtoken(req,res,next){
    const token = req.cookies["auth-token"];
    if(!token) return res.status(401).send("Access Denied");
   //verify token
    try{
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        res.user = verified;
        next();
    }catch(err){
        res.status(400).send("Invalid Token");
    }
}
//in case
module.exports = authtoken;