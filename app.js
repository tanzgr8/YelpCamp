var express = require("express"),
 app = express(),
mongoose = require("mongoose"),      
bodyParser = require("body-parser"),
flash      = require("connect-flash");
passport   = require("passport");
LocalStrategy=require("passport-local"),
User       = require("./models/user"), 
methodOverride= require("method-override"),
campground = require("./models/campgrounds"),
Comment = require("./models/comment"),
seedDB     = require("./seeds");
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campground"),
    indexRoutes      = require("./routes/index");

// seedDB();
mongoose.connect("mongodb://localhost:27017/Yelpcamp", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method")); 
app.use(flash());
app.use(express.static(__dirname + "/public"));
app.use(require("express-session")({
	secret:"tanzeel",
	resave:false,
saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});
app.use( indexRoutes);
app.use( campgroundRoutes);
app.use( commentRoutes);
app.listen(process.env.port || 3000, process.env.IP,function(){
console.log("Server running");	
});