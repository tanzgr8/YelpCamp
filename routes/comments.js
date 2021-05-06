var express = require("express");
var router  = express.Router({mergeParams: true});
var campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware");
router.get("/camp/:id/comments/new",middleware.isLoggedIn, function(req, res){
    // find campground by id
    campground.findById(req.params.id, function(err, camp){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {camp: camp});
        }
    });
});
router.post("/camp/:id/comments",middleware.isLoggedIn, function(req,res){
	campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){ req.flash("error", "Something went wrong");
					console.log(err);
				}else{
					comment.author.id = req.user._id;
               comment.author.username = req.user.username;
					//
					comment.save();
					campground.comments.push(comment);
			campground.save();
					  req.flash("success", "Successfully added comment");
			res.redirect('/camp/'+campground._id);
				}
			});
		}
	});
});
router.get("/camp/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundc){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit",{camp_id:req.params.id,comment:foundc});
		}
	});
});
router.put("/camp/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,uodatedC){
		if(err){
			res.redirect("back");
			
		}else{
			res.redirect("/camp/"+req.params.id);
		}
	});
});
router.delete("/camp/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
		}else{ req.flash("success", "Comment deleted");
			res.redirect("/camp/"+req.params.id);
		}
	})	;	  
});

module.exports = router;