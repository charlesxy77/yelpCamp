var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


    var campgrounds = [
        {name:"Salmon creek", image:"images/dragon.jpg"},
        {name:"Granite hills", image:"images/savage.jpg"},
        {name:"Mountain goat's Rest", image:"images/wolf.jpg"},
        {name:"Salmon creek", image:"images/gunman.jpg"},
        {name:"Granite hills", image:"images/wolf.jpg"},
        {name:"Mountain goat's Rest", image:"images/dragon.jpg"},
        {name:"Salmon creek", image:"images/wolf.jpg"},
        {name:"Granite hills", image:"images/dragon.jpg"},
        {name:"Mountain goat's Rest", image:"images/savage.jpg"}
];
        

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {campgrounds:campgrounds});
});

app.post("/campgrounds", function(req, res){
   //get data from form and add to campgrouds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image}
    campgrounds.push(newCampground);
   //redirect back to the campground page
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs"); 
});

app.listen(3000, process.env.IP, function(){
    console.log("YelpCamp has started!!!"); 
});