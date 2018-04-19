// Request modules
const 
    path = require("path"),
    express = require("express"),
    bodyParser = require("body-parser"),
    minifyHTML = require("express-minify-html"),
    fetchUrl = require("fetch").fetchUrl
;


const session = require("express-session")({
    secret: "gfjisdhu5yvdist4fvhsdyutg47sydiywe45iadhwo8",
    resave: true,
    saveUninitialized: true
});




const app = express();

app.use(session);

app.use(minifyHTML({
    override:      true,
    exception_url: false,
    htmlMinifier: {
        removeComments:            true,
        collapseWhitespace:        true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes:     true,
        removeEmptyAttributes:     true,
        minifyJS:                  true
    }
}));


 

const socket = require("./scripts/socket.js")(app, session);


// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Define bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));


app.get("*", function(req, res, next)    {
    res.locals.dataContainer = {};
    next();
});


app.get("/", function(req, res, next)    {
    res.locals.dataContainer.slackUserName = req.session.slackUserName;
    res.render("pages/index")
});

// Routers
const routers = {
    init: function () {
        const path = this.path;
        const allData = this.allData;
        for (var i = 0; i < allData.length; i++) {
            const data = allData[i];
            var module = require(path + data.path + "/" + data.fileName);
            app.use(data.path, module);
        }
        delete this.init;
    },
    path: "./routers",
    allData: [
        {
            path: "",
            fileName: "slack"
        }
    ]
};
routers.init();





// Start server
app.listen(3000, function() {
    console.log("Real-time-web APP listening at http://localhost:3000/");
});
