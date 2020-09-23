const nodemailer = require('nodemailer');
require("dotenv").config();
const mysqlConnection = require("../connection");
//validation
const Joi = require("joi");


const Eschema = Joi.string().min(6).max(45).email().required();

function emailAuth(req,res,next){

const EMAIL_RECIEVER = req.body.email;
console.log(EMAIL_RECIEVER);
const { error } = Eschema.validate(EMAIL_RECIEVER);
if(error) return res.send(error.details[0].message);

const code = Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000; 

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_HOST_USER,
    pass: process.env.EMAIL_HOST_PASSWORD
  }
});

const mailOptions = {
    from: process.env.EMAIL_HOST_USER,
    to: EMAIL_RECIEVER,
    subject: 'Verification Code',
    text:'Dont reply to this Mail!',
    html : '<h3>Hey, here is your Verification Code</h3> <h2>'+code+'</h2>' 
  };
if (req.body.reg == true){
 mysqlConnection.query("insert into accounts(email,verify,user_id) values('"+EMAIL_RECIEVER+"','"+code+"',FLOOR(RAND()*(999999999-10+1))+10)",(err,rows)=>{     
  if(err){
         console.log(err.sqlMessage);
         res.status(400).json({result:"Email already Exist!"});
     }
     else{ 
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              res.status(400).json({result:"Error sending Verification code!"});
            } else {               
              console.log('Email sent: ' + info.response);
              next();
            }
          }); 
     }
 });
}else{
  mysqlConnection.query("update accounts set verify='"+code+"' where email='"+EMAIL_RECIEVER+"'",(err,rows)=>{     
    if(err){
           console.log(err.sqlMessage);
           res.status(400).json({result:"Error Updating Database"+err});
       }
       else{ 
          transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
                res.status(400).json({result:"Error sending Verification code!"});
              } else {               
                console.log('Email sent: ' + info.response);
                next();
              }
            }); 
       }
  });
}
}

module.exports = emailAuth;