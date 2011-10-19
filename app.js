
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.enable('jsonp callback');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'hushu' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  app.use(express.logger("dev"));
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.dynamicHelpers({
	session: function (req, res) {
		return req.session;
	}
});

/*****************************************************************************/
// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'KUSHU'
  });
});

app.get('/hello/:user', function(req, res){
	res.write("Hello, " + req.params.user);
	res.end();
});

app.get("/login", function (req, res) {
	if (req.session.username) {
		res.redirect("home");
		res.end();
	}
	res.render("login", {title: "Log in to Kushu"});
});

app.post("/login", function (req, res) {
	var username = req.body.username;
	req.session.username = username;
	res.redirect("/login");
	res.end();
});

app.get("/logout", function (req, res) {
	req.session.username = null;
	res.redirect("/");
	res.end();
});

app.get("/deck/:deckId", function (req, res) {
	var deck = [
		{q: "Capital of France", a: "Paris"},
		{q: "Capital of Germany", a: "Berlin"}
	];
	if (req.xhr) {
		res.send(deck);
	}
	res.render('deck', {title: "DECK No. " + req.params.deckId, deck: deck});
});


app.get("/deck/:deckId/:cardId", function (req, res) {

});

/*****************************************************************************/


var port = (process.argv.length > 2) ? process.argv[2] : 3000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);