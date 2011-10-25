var leitner = require("./leitner.js");

module.exports = function (app) {

	app.get('/', function(req, res){
	  res.render('index', {
	    title: 'Home'
	  });
	});

	app.get("/login", function (req, res, next) {
		if (req.session.username) {
			res.redirect("/decks");
		} else {
			res.render("login", {title: "Login"});			
		}
	});
	
	app.post("/login", function (req, res) {
		var username = req.body.username;
		var password = req.body.password;
		
		if (username && password) {
			app.models.db.query("SELECT * FROM User WHERE username=? AND password=?;" 
			, [username, password], function(err, result){
				if (result === undefined) {
					req.flash("error", "Login details incorrect");
					res.redirect("/login");
				} else {
					req.session.username = result[0].username;
					req.session.user_id = result[0].USER_ID;
					res.redirect("/login");
				}
			});
		} else {
			req.flash("error", "Bad username or password.");
			res.redirect("/login");
		} 
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
	
	app.get("/stats", function (req, res) {
		res.render("stats", {title: "Statistics"});
	});
	
	app.get("/register", function (req, res){
		if (req.session.username) {
			res.redirect("home");
		} else {
			res.render("register", {title: "Register"});
		}
	});

	app.post("/register", function (req, res){
		var username = req.body.username;
		var password = req.body.password;
		if (username && password) {
			app.models.registerUser(username, password, function(result) {
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
	
	app.get("/deck/:deck_id", function (req, res) {		
		
		var deckId = req.params.deck_id;
		var userId = req.session.user_id;		
		if (!userId) {
			res.redirect("/login");
		} else {
			
			app.models.getDeckState(userId, deckId, function(resultDeckState){
				//TODO: Handle case where there isn't a DeckState entry for user,deck combination
				var deckState = JSON.parse(resultDeckState[0].serialized_state);
				var cardIds = leitner.getCardsForCurrentRevision(deckState);
				var deck = [];

				app.models.getRowsFromTableWhere("Card", "DECK_ID" ,deckId, function(resultCards){
					
					console.log("Cards in deck:" + JSON.stringify(resultCards));
					var resultMap = [];
					for(var i in resultCards){
						resultMap[resultCards[i].CARD_ID] = resultCards[i];
					}
					console.log("ResultMap:" + JSON.stringify(resultMap));
					
					for(var i in cardIds){
						var currentCard = resultMap[cardIds[i]];
						if(currentCard){
							deck.push({ 
								"q" : currentCard.front,
								"a" : currentCard.back
							});
						}
					
					console.log("Deck to be sent:" + JSON.stringify(deck));
					
					}
					
					app.models.db.query("SELECT deck_name FROM Deck WHERE DECK_ID=?;", [deckId], function(err, result){
						var deckTitle = result[0].deck_name;
						res.render('deck', {title: deckTitle, deck: deck});						
					});
				});				
			});
		}
		//res.render('deck', {title: "DECK No. " + req.params.deckId, deck: deck});
	});
	
	app.get("/browse/:deckId", function (req, res) {		
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
		res.render('browse', {title: "DECK No. " + req.params.deckId, deck: deck});
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
	});	
};

