var leitner = require("./leitner.js");

module.exports = function (app) {

	app.get('/', function(req, res){
	  res.render('index', {
	    title: 'Home'
	  });
	});

	app.get("/login", function (req, res, next) {
		if (req.session.username) {
			if (req.session.takeMeTo) {
				var destination = req.session.takeMeTo;
				req.session.takeMeTo = null;
				res.redirect(destination);
			} else {
				res.redirect("home");
			}
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
		req.session.user_id = null;
		res.redirect("/");
		res.end();
	});
	
	app.get("/index", function (req, res) {
		res.redirect("home");
	});
	
	app.get("/about", function (req, res) {
		res.render("about", {title: "About"});
	});
	
	app.get("/stats" , function (req, res){
		var userId = req.session.user_id;
		
		if (!userId) {
			req.session.takeMeTo = req.path;
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
			req.session.takeMeTo = req.path;
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
								deckId: deckId
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

		var isDeckOwner = false;
		var userId = req.session.user_id;
		if(!userId){
			userId = null;
		}
		
		app.models.getRowsFromTableWhere("Deck", "OWNER_USERID",userId, function(resultOwner){
			if(resultOwner.length != 0){
				isDeckOwner = true;
			}
			
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
					res.render('cards', {title: deckTitle, deck: deck, deckId: deckId, deckOwner: isDeckOwner});						
				});			
			});
			
		});	
	});
	
	app.post("/deck/:deck_id/cards", function(req, res) {
		
		var deckId = req.params.deck_id;
		var questions = req.body.questions;
		var answers = req.body.answers;
		
		var queryMap = [];
		for(var i in questions){

			queryMap.push("INSERT INTO Card "
						+ "(DECK_ID, front, back) "
						+ "VALUES("+deckId+ "," 
								 +"'"+questions[i]+"',"
								 +"'"+answers[i]+"'"
								 +");");
		}
		
		
		app.models.performQueries(queryMap, function(result){
			console.log(result);
			res.redirect("/deck/"+deckId+"/cards");
		});
		
	});
	
	app.get("/decks", function (req, res) {
		
		var userId = req.session.user_id;
		
		var queryMap = {
			allDecks: "SELECT * FROM Deck ORDER BY DECK_ID ASC;",
			cardCounts: "SELECT DECK_ID, COUNT(*) AS card_count FROM Card GROUP BY DECK_ID ORDER BY DECK_ID ASC;",
			deckStates: "SELECT * FROM DeckState WHERE USER_ID="+userId+" ORDER BY DECK_ID ASC;"
		};
		
		app.models.performQueries(queryMap, function(result) {
			var decks = result["allDecks"];
			var countResults = result["cardCounts"];
			var deckStates = result["deckStates"];
			
			for(var index in decks){
				decks[index].card_count = countResults[index].card_count;
			}
			
			var correctStatesArray = [];
			var deckIdArray = [];
				
			for(var i in deckStates){
				var dState = JSON.parse(deckStates[i]["serialized_state"]);
				var bucketLength = dState.state.groups[2].length;
				correctStatesArray[i] = bucketLength;
				deckIdArray[i] = deckStates[i].DECK_ID;
			}
			
			if(!userId){
				userId = null;
				correctStatesArray = null;
			}	
			
			if(req.query.format) {
				req.query.format == "json" ? res.json(decks) : res.send(404);
			} else {
				res.render("decks", {decks: decks, title: "Decks", correctDeckStates: correctStatesArray, deckIdArray: deckIdArray});				
			}
		});
	});
	
	app.get("/buildDeck", function (req, res) {
		if(req.session.user_id){
			res.render("buildDeck", {title: "Build a deck", usedName: false});
		}else{
			req.session.takeMeTo = req.path;
			res.redirect("/login");
		}
	});	
	
	app.post("/buildDeck", function (req, res) {
		
		console.log(req.body.nameOfDeck);
		var isNameInUse = true;
		var oldName = req.body.nameOfDeck;
	
		app.models.getRowsFromTableWhere("Deck","deck_name",("'"+oldName+"'"), function(result){
			
			if(result.length>0){
				console.log("name in use");
				res.render("buildDeck", {title: "Build a deck", usedName: isNameInUse, oldName: oldName});
			}else{
				app.models.db.query("", function(err, result){
					
				});
			}
		})
		
	});	
};

