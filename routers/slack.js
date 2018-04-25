/*
    Use a specific environment for the slack keys!
*/
require('dotenv').config()

const express = require('express');
const router = express.Router();
const fetchUrl = require("fetch").fetchUrl;

router.get("/oauth", function (req, res, next) {
    /*
        The slack API!
    */
    fetchUrl("https://slack.com/api/oauth.access?client_id=" + process.env.client_id + "&client_secret=" + process.env.client_secret + "&code=" + req.query.code + "&redirect_uri=http://localhost:3000/oauth", function(error, meta, data) {
        if (error == undefined) {
            data = JSON.parse(data);
            /*
                Save in a session if you want. (make sure to download the express session module)
            */
            req.session.slackAccessToken = data.access_token;
            req.session.slackUsername = data.user.name;
            res.redirect("/");
        }
    });
});

module.exports = router;


