var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    passport   = require("passport"),
    localStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"), 
    User       = require("./models/user"),
    seedDB     = require("./seeds")

seedDB();     
mongoose.connect("mongodb://localhost:27017/yelp_camp_v6",{useNewUrlParser: true, useUnifiedTopology: true});
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"Once again rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

// Campground.create(
//     {
//         name:"Granite hills",
//         image:"images/savage.jpg",
//         description: "This is a huge Granite hill, No Bathrooms. No water. Beautiful Granite!"
//     }, function(err, campground){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("NEWLY CREATED CAMPSITE");
//             console.log(campground);
//         }
//     });

//     var campgrounds = [
//         {name:"Salmon creek", image:"images/dragon.jpg"},
//         {name:"Granite hills", image:"images/savage.jpg"},
//         {name:"Mountain goat's Rest", image:"images/wolf.jpg"},
//         {name:"Salmon creek", image:"images/gunman.jpg"},
//         {name:"Granite hills", image:"images/wolf.jpg"},
//         {name:"Mountain goat's Rest", image:"images/dragon.jpg"},
//         {name:"Salmon creek", image:"images/wolf.jpg"},
//         {name:"Granite hills", image:"images/dragon.jpg"},
//         {name:"Mountain goat's Rest", image:"images/savage.jpg"}
// ];
        

app.get("/", function(req, res){
    res.render("landing");
});

// INDEX - Show all campgrounds
app.get("/campgrounds", function(req, res){
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
app.post("/campgrounds", function(req, res){
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
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new.ejs"); 
});


//SHOW - show more info about one campground
app.get("/campgrounds/:id", function(req, res){
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

//=======================
// COMMENT ROUTES
//=======================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    // Find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    //Lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id)
                }
            });
        }
    });
    //Create new comment
    //Connect new comments to campground
    //Redirect campground to show page
});

//==============
// AUTH ROUTES
//==============

// Show register form
app.get("/register", function(req, res){
    res.render("register");
});

// Handle signup logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds")
        });
    });
});

// Show login form
app.get("/login", function(req, res){
    res.render("login");
});

//Handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
    }),  function(req, res){
});

// Logic Routes
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000, process.env.IP, function(){
    console.log("YelpCamp has started!!!"); 
});