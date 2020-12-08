var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");

// INDEX - Show all campgrounds
router.get("/", function(req, res){
    //Get all campground from DB
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err)
        } else {
             res.render("campgrounds/index", {campgrounds:allCampgrounds});
        }
    });
});


//CREATE - add all campgrounds to DB
router.post("/", function(req, res){
   //get data from form and add to campgrouds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc}
    // campgrounds.push(newCampground);
    //Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if (err){
            console.log(err);
        } else {
            //redirect back to the campground page
            res.redirect("/campgrounds")
        }
    });
});


//NEW - show form to create new campgrounds
router.get("/new", function(req, res){
    res.render("campgrounds/new.ejs"); 
});


//SHOW - show more info about one campground
router.get("/:id", function(req, res){
    //Find the campgrounds with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, FoundCampground){
        if (err){
            console.log(err);
        } else {
            console.log(FoundCampground);
            //Render show template with that campgrounds
            res.render("campgrounds/show", {campground: FoundCampground});
        }
    });
});

module.exports = router;