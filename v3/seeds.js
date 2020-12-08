var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");


var data = [
    {
        name:"Cloud's Rest",
        image:"images/cloud.jpg",
        description:"blah blah blah"
    },
    {
        name:"Desert Mesa",
        image:"images/star.jpg",
        description:"blah blah blah"
    },
    {
        name:"Canyon Floor",
        image:"images/mountain.jpg",
        description:"blah blah blah"
    }
]

function seedDB(){
    //Removed all campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("Removed campground!");
        }
        // Add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err)
                } else{
                    console.log("Added a campground!");
                    // Create a comment
                    Comment.create(
                        {
                            text: "This place is great, But i wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err)
                            } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created new comment");
                            }
                        })
                }
            }); 
        });
    });
    
    // Add a few commennt
}



    

module.exports = seedDB;