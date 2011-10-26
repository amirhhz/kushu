var leitner = require("./leitner.js");

module.exports = function (app) {

	app.get('/', function(req, res){
	  res.render('index', {
	    title: 'Home'
	  });
	});

	app.get("/login", function (req, res, next) {
		if (req.session.username) {
			res.redirect("/index");
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

				if (result.length === 0) {
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
	
	app.get("/stats" , function (req, res){
		var userId = req.session.user_id;
		
		if (!userId) {
			res.redirect("/login");
		} else {
			app.models.getAllDecksState(userId, function(result){				

				var statesArray = [  ];
				var deckIDs = [];
				
				for(var i in result){
					statesArray[i] = [];
					deckIDs[i] = JSON.parse(result[i]["DECK_ID"]);
					var dState = JSON.parse(result[i]["serialized_state"]);
					
					for(var j in dState.state.groups){
						var len = dState.state.groups[j].length;
						statesArray[i][j] = len;
					}					
				}	
				
				res.render('stats', {title: "stats", statesArray: statesArray, deckIDs: deckIDs});				
			});		
		}		
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
				
				if (resultDeckState.length === 0) {					
					app.models.insertDeckState(userId, deckId, function() {
						res.redirect("/deck/"+deckId);
					});
				} else {
					var deckState = JSON.parse(resultDeckState[0].serialized_state);
					var cardIds = leitner.getCardsForCurrentRevision(deckState);
					var deck = [];
					
					
					app.models.getRowsFromTableWhere("Card", "DECK_ID" ,deckId, function(resultCards){
						
						var resultMap = [];
						for(var i in resultCards){
							resultMap[resultCards[i].CARD_ID] = resultCards[i];
						}
						
						for(var i in cardIds){
							var currentCard = resultMap[cardIds[i]];
							if(currentCard){
								deck.push({ 
									"q" : currentCard.front,
									"a" : currentCard.back
								});
							}
						}
						
						app.models.db.query("SELECT deck_name FROM Deck WHERE DECK_ID=?;", [deckId], function(err, result){
							var deckTitle = result[0].deck_name;
							res.render('deck', {
								title: deckTitle, 
								deck: deck,
								deckId: deckId,
								imageOrText: function(question) {
									console.log("Image or text?;")
									if(question.length > 4) {
										questionStringFileType = question.substr(question.length - 4);
											if(questionStringFileType.toLowerCase() == (".jpg" || ".png" || ".gif" || ".bmp")){
												return "<img src='/deckImages/"+question+"' />";
											} else {
												return question;
											}		
									} else {
										return question;
									}
								}
							});						
						});
					});
				}
			});
		}
	});
	
	app.post("/deck/:deck_id", function(req, res) {
		
		//TODO: only for logged in users
		//TODO: should verify existence of answers and deck_id
		var userId = req.session.user_id;
		var deckId = req.params.deck_id;
		var answers = req.body.answers;
		
		app.models.getDeckState(userId, deckId, function(result){
			var currState = JSON.parse(result[0].serialized_state);
			var updatedState = leitner.updateDeckStateWithPartialAnswers(currState, answers);			
			app.models.updateDeckState(userId, deckId, updatedState);
		});
	});
	
	app.get("/deck/:deck_id/cards", function (req, res) {		

		var deckId = req.params.deck_id;				
		var deck = [];
		app.models.getRowsFromTableWhere("Card", "DECK_ID" ,deckId, function(resultCards){
			
			for(var i in resultCards){
				deck.push({ "q" : resultCards[i].front,
							"a" : resultCards[i].back 
				});
			}
			app.models.db.query("SELECT deck_name FROM Deck WHERE DECK_ID=?;", [deckId], function(err, result){
				var deckTitle = result[0].deck_name;
				res.render('cards', {title: deckTitle, deck: deck});						
			});			
		});
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
			
			if(req.query.format) {
				req.query.format == "json" ? res.json(decks) : res.send(404);
			} else {
				res.render("decks", {decks: decks, title: "Decks"});				
			}
		});
	});	
};

