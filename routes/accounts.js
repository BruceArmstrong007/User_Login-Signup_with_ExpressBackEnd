const express = require("express");
const Router = express.Router();
const mysqlConnection = require("../connection");
const emailAuth = require("./emailAuth");


//validation
const Joi = require("joi");

//jwt web token
const jwt = require("jsonwebtoken");

//encrypting password
const bcrypt = require('bcryptjs'); 

//schema for validation
const Rschema = Joi.object({
     email : Joi.string().min(6).max(45).email().required(),
     password : Joi.string().min(6).max(45).required(),
     repeat_password: Joi.ref('password'),
     verify: Joi.number().min(8).required(),
     _csrf: Joi.string().required(),
});

const Lschema = Joi.object({
    email : Joi.string().min(6).max(45).email().required(),
    password : Joi.string().min(6).max(45).required(),
    _csrf: Joi.string().required(),
});

Router.get("/register",(req,res) => {
    res.render("register",{csrfToken : req.csrfToken()});
});

Router.post("/verify",emailAuth,async(req,res)=>{
    res.json({result:"Verification Code sent to your Email!"});
});


Router.post("/register",async(req,res) => { 
    const { error } = Rschema.validate(req.body);
    if(error) return res.json({result:error.details[0].message});
    //hashing passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);
    mysqlConnection.query("update accounts set password='"+hashPassword+"',sdate=CURDATE(),verify=Null where email = '"+req.body.email+"' and verify = "+req.body.verify+";",(err,rows,fields)=>{  
         if(!err){
              res.redirect("/accounts/login");
          }else{
              console.log(err);
              res.status(400).json({result:"Enter Valid Email/Verification Code and Try again !"+err});
          }
    });
});

Router.get("/login",(req,res) => {
    res.render("login",{csrfToken : req.csrfToken()});

});

Router.post("/login",async(req,res) => {
    const { error } = Lschema.validate(req.body);
    if(error) return res.json({result:error.details[0].message});
     mysqlConnection.query("Select user_id,password from accounts where email ='"+req.body.email+"'",async(err,rows)=>{     
        if (rows.length == 0) {
            return res.status(400).json({result:"Email is not Registered yet!"});
        }
        if(!err){
            const validPass = await bcrypt.compare(req.body.password,rows[0].password);
            if(!validPass) return res.status(400).json({result:"Invalid Password!"});
           
        //create and assign jwt token
        //cookie maxAge includes 1000 milli seconds where jwt token doesnt!,its 1 day on both
        const maxAge = 60*60*24;
        const token = jwt.sign({_id : rows[0].user_id}, process.env.TOKEN_SECRET,{expiresIn:maxAge});
        res.cookie('auth-token',token,{HttpOnly:true,secure : false,maxAge:1000*maxAge}).redirect("/user/"+rows[0].user_id);
        }else{
        return res.status(400).json({result:"Email is not Registered"});
    }
    });
});

Router.get("/logout",(req,res) => {
res.clearCookie('auth-token');
req.session.destroy();
res.redirect('/');
});


Router.get("/reset-password",(req,res)=>{
    res.render("reset_password",{csrfToken : req.csrfToken()});
});

Router.post("/reset-password",async(req,res)=>{
    const { error } = Rschema.validate(req.body);
    if(error) return res.json({result:error.details[0].message});
    //hashing passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);
    mysqlConnection.query("update accounts set password='"+hashPassword+"',verify=Null where email = '"+req.body.email+"' and verify = "+req.body.verify+";",(err,rows)=>{  
         if(!err){
              res.redirect("/accounts/login");
          }else{
              console.log(err);
              res.status(400).json({result:"Enter Valid Email/Verification Code and Try again !"+err});
          }
    });

});

module.exports = Router;