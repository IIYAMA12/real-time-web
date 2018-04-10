// Request modules
const 
    path = require("path"),
    express = require("express"),
    bodyParser = require("body-parser"),
    session = require("express-session"),
    minifyHTML = require('express-minify-html')
;


var sess = {
    secret: "gfjisdhu5yvdist4fvhsdyutg47sydiywe45iadhwo8",
    cookie: {},
    resave: true,
    saveUninitialized: true
}


const app = express();

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

app.use(session(sess));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Define bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));


var socketApp = require('express')();
var server = require('http').Server(socketApp);
var io = require('socket.io')(server);

server.listen(4444);
console.log("Real-time-web socketApp listening at http://localhost:4444/");

// express().get('/', function (req, res) {
//   res.sendfile(__dirname + '/index.html');
// });

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on("stream-position", function (data) {
    console.log("on stream position");
  });
});
      

// https://socket.io/docs/#  

// app.get('/', function (req, res) {
//     res.sendfile(__dirname + "pages/index");
// });

// app.get("*", function(req, res, next)    {
//     next();
// });



app.get("/", function(req, res, next)    {
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
        /*
            {
                path: "/api",
                fileName: "example"
            }
        */
    ]
};
routers.init();





// Start server
app.listen(3333, function() {
    console.log("Real-time-web APP listening at http://localhost:3333/");
});
