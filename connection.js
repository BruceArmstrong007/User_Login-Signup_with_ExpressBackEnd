const mysql = require("mysql");
//using Dotenv module
require('dotenv').config();

//connection to MySQL Server
const mysqlConnection = mysql.createConnection({
    host : process.env.HOST,
    user : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DATABASE,
    multipleStatements : true    
   });

   mysqlConnection.connect((err)=>{
   if(!err){
       console.log("Connected to MySQL Database!");
   }
   else{
       console.log("Connection failed"+err);
   }
   });

   module.exports = mysqlConnection;