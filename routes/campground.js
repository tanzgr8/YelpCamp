var express = require("express");
var router  = express.Router();
var campground = require("../models/campgrounds");
var middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/camp",function(req,res){
	campground.find({},function(err,campgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/camp",{campgrounds:campgrounds});
		}
	});
	
});
router.post("/camp",middleware.isLoggedIn, function(req,res){
	var name = req.body.name;
	var price=req.body.price;
	var image = req.body.image;
	var description=req.body.description;
	var author={
		id:req.user._id,
		username:req.user.username
	}
	var newCamp = {name:name,price:price,image:image,description:description,author:author};
campground.create(newCamp,function(err,newCamp){
	if(err){
		console.log(err);
	}else{
		res.redirect("/camp");
	}
});
	
	
});
router.get("/camp/new",middleware.isLoggedIn ,function(req,res){
	res.render("campgrounds/new");
	
});
router.get("/camp/:id",function(req,res){
	campground.findById(req.params.id).populate("comments").exec(function(err,camp){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show",{campground:camp});
		}
	});
});
//Edit
router.get("/camp/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	campground.findById(req.params.id,function(err,Found){
		if(err){
			res.redirect("/camp");
		}else{
			res.render("campgrounds/edit",{campground:Found});
		}
	});
});
router.put("/camp/:id",middleware.checkCampgroundOwnership,function(req,res){
	campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updated){
		if(err){
			res.redirect("/camp");
		}else{
			res.redirect("/camp/"+req.params.id);
		}
	});
});
router.delete("/camp/:id",middleware.checkCampgroundOwnership,function(req,res){
	campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/camp");
		}else{
			res.redirect("/camp");
		}
	});
});

module.exports = router;