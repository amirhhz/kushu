var users = {};


module.exports = function (app) {

	app.get('/', function(req, res){
	  res.render('index', {
	    title: 'Home'
	  });
	});

	app.get("/login", function (req, res, next) {
		if (req.session.username) {
			res.redirect("home");
			res.end();
		} else {
			res.render("login", {title: "Login"});			
		}
	});
	
	app.post("/login", function (req, res) {
		var username = req.body.username;
		var password = req.body.password;
		if (username in users) {
			users[username]["password"] === password ? req.session.username = username : null ;
		} else {
			req.flash("error", "Bad username or password.");
		} 
		res.redirect("/login");
		res.end();
	});
	
	app.get("/logout", function (req, res) {
		req.session.username = null;
		res.redirect("/");
		res.end();
	});
	
	app.get("/index", function (req, res) {
		res.render("index", {title: "Home"});
	});
	
	app.get("/about", function (req, res) {
		res.render("about", {title: "About"});
	});
	
	app.get("/register", function (req, res){
		res.render("register", {title: "Register"});
	});

	app.post("/register", function (req, res){
		var username = req.body.username;
		var password = req.body.password;
		console.log("Registering: " + username + ", " + password);
		if (username && password) {
			app.models.registerUser(username, password, function(result) {
				console.log(result);
				if (result === undefined){
					req.flash("error", "Username already exists");
					res.redirect("/register");
				} else {
					res.redirect("/login");
				}
			});
		} else {
			req.flash("error", "Bad username or password");
			res.redirect("/register");
		}
	});
	
	app.get("/deck/:deckId", function (req, res) {		
		
		var deck = [
			{q: "Capital of France", a: "Paris"},
			{q: "Capital of Austraila", a: "Canberra"},
			{q: "Capital of Estonia", a: "Tallinn"},
			{q: "Capital of England", a: "London"},
			{q: "Capital of Yemen", a: "Sana'a"},
			{q: "Capital of Germany", a: "Berlin"}
		];
		if (req.xhr) {
			res.send(deck);
		}
		res.render('deck', {title: "DECK No. " + req.params.deckId, deck: deck});
	});
	
	app.get("/decks", function (req, res) {
		
		var queryMap = {
			allDecks: "SELECT * FROM Deck ORDER BY DECK_ID ASC;",
			cardCounts: "SELECT DECK_ID, COUNT(*) AS card_count FROM Card GROUP BY DECK_ID ORDER BY DECK_ID ASC;"
		};
		
		app.models.performQueries(queryMap, function(result) {
			var decks = result["allDecks"];
			var countResults = result["cardCounts"];
			
			for(var index in decks){
				decks[index].card_count = countResults[index].card_count;
			}
			
			res.render("decks", {decks: decks, title: "Decks"});
		});
		/*
		app.models.getAllFromTableQuery("Deck", function(result){
			res.render("decks", {decks: result, title: "Decks"});
		});*/
	});	
};

