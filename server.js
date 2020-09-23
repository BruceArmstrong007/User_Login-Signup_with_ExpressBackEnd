const express = require("express");
require("dotenv").config();
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require("body-parser");
const csrf = require("csurf");
const mysqlConnection = require("./connection");

var app = express();

// setup route middlewares
//static files
app.use(express.static('public'));
//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//json in express
app.use(express.json());
//secure headers
app.use(helmet(
    {contentSecurityPolicy: false,}
  ));
//cookie parsing
app.use(cookieParser());
//adding session to MySQL Database   
const sessionStore = new MySQLStore({},mysqlConnection);
//session handler
app.use(session({secret :process.env.SESSION,
key:'Session',
resave:false,
saveUninitialized : true,
store: sessionStore,
cookie:{ maxAge:1000 * 60 * 60 * 24}
}));
//csrf
app.use(csrf({ cookie: true }));

//view engine
app.set('view engine','ejs');

//Import Routes
const UserRoutes = require("./routes/user");
const AuthRoutes = require("./routes/accounts");
const HomeRoutes = require("./routes/home"); 

//Route Middlewares
app.use("/",HomeRoutes);
app.use("/accounts",AuthRoutes);
app.use("/user",UserRoutes);

app.listen(3000,()=>{console.log('Server is Running!')});