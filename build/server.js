/**
 * this is the server where the main work is being done
 * it handles all the routing related to the project
 */
var express = require ('express');
var app = express ();

var parser = require ('body-parser');
var SnippetsRouter = require ('./routers/snippet-router.js');

app.use (parser.json());
app.use ('/api/snippets', SnippetsRouter);

app.get ('/search', function (req, res) {
    res.sendFile (__dirname +'/views/index.html');
});

app.get ('/dummycontent', function (req, res) {
    res.sendFile (__dirname +'/views/content-detail.html');
})

app.get ('/search/:domain', function (req, res) {
    res.sendFile (__dirname+ '/views/content.html');
});

app.get ('/img/:filename', function( req, res) {
    var filename = req.params.filename;
    res.sendFile (__dirname +'/img/'+filename);
});
app.get ('/script/:filename', (req, res) => res.sendFile (__dirname+ '/js/'+ req.params.filename));
app.get ('/stylesheets/:filename', (req, res) => res.sendFile (__dirname+ '/style/'+ req.params.filename));

// html components
app.get ('/component/:filename', (req, res) => res.sendFile (__dirname +'/views/components/'+ req.params.filename +'.html'));

app.listen (3000, function (success) {
    console.log ('application running on port 3000');
});