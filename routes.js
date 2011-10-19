module.exports = function (app) {

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
};

