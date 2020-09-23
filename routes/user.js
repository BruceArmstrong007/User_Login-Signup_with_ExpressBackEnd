const express = require("express");

const Router = express.Router();
const mysqlConnection = require("../connection");

//verify token middleware
const verify = require("./tokenverify");

//validation
const Joi = require("joi");


//schema for validation
const schema = Joi.object({
    name : Joi.string().min(3),
    age : Joi.number().min(1),
    dob : Joi.date(),
    _csrf:Joi.string()
});

Router.get("/:id",verify,(req,res) => {   
    //For displaying user
     mysqlConnection.query("Select * from user where user_id ="+req.params.id,(err,rows)=>{
        if (rows.length == 0) {
            return res.status(400).json({result:"Invalid User!"});
        }
        if(!err){
            res.render('user',{rows,user_id:req.params.id}); 
        }else{
            (err);
            res.status(400).json({result:"Invalid User!"});
        }
    });
});

Router.get("/edit/:id",verify,async(req,res) => {
    //for editing them
    const { error } = schema.validate(req.body);
    if(error) return res.json({result:error.details[0].message});
    mysqlConnection.query("Select * from user where user_id ="+req.params.id,(err,rows)=>{
        if (rows.length == 0) {
            return res.status(400).json({result:"Invalid User!"});
        }
        if(!err){
            res.render('user_edit',{rows,user_id:req.params.id, csrfToken : req.csrfToken()}); 
        }else{
            console.log(err);
            res.status(400).json({result:"Invalid User!"+err});
        }
    });
});

Router.post("/edit/:id",verify,async(req,res) => {
    const { error } = schema.validate(req.body);
    if(error) return res.json({result:error.details[0].message});
    mysqlConnection.query("update user set name='"+req.body.name+"',age='"+req.body.age+"',dob='"+req.body.dob+"' where user_id ='"+req.params.id+"'",(err,rows)=>{
        if(!err){
            res.redirect("/user/"+req.params.id); 
        }else{
            res.status(400).json({result:"Error Updating Database"+err});
        }
    });
});

module.exports = Router;