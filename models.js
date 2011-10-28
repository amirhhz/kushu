
var MYSQL = require('mysql');
var db; 
exports.db = db;
var leitner = require("./leitner");

exports.performQueries = function(queryMap, callback)
{
	var response = {};
	for ( var key in queryMap)
	{
		(function(key, queryString)
		{
			db.query(queryString, function(err, result)
			{	
				response[key] = result;
				if (Object.keys(response).length === Object.keys(queryMap).length)
					callback(response);
			});
		}(key, queryMap[key]))
	}
}

exports.getAllFromTableQuery = function(table, callback){
	
	db.query("SELECT * from "+table+";", function(err, result){
		if(err){
			throw err;
		}	
		callback(result);
	});
}

exports.getRowsFromTableWhere = function(table, field,  value, callback){
	
	db.query("SELECT * from "+table+" WHERE "+field+"="+value+";", function(err, result){
		if(err){
			throw err;
		}	
		callback(result);
	});
}

exports.registerUser = function(username, password, callback) {
	db.query("INSERT INTO User (username, password) VALUES (?, ?);", [username, password], function(err, result){
		callback(result);
	});
}

exports.insertDeckState = function(userId, deckId, callback) {

	exports.getRowsFromTableWhere("Card", "DECK_ID", deckId, function(result){
		var group = [];
		for (var card in result) {
			group.push(result[card].CARD_ID);
		}
		var deckState = leitner.createEmptyDeckState();
		deckState.state.groups[0] = randomizeArray(group);
		db.query("INSERT INTO DeckState (USER_ID, DECK_ID, date_modified, serialized_state) VALUES (" + 
			userId + ", " + deckId + ", " + "CURRENT_TIMESTAMP, ?);", [JSON.stringify(deckState)], function(err, insertResult) {
				callback(deckState);
			});
		
	});	
}

exports.updateDeckState = function(userId, deckId, deckState) {

	var makeTheUpdate = function() {
		db.query("UPDATE DeckState SET serialized_state=?, date_modified=CURRENT_TIMESTAMP WHERE USER_ID=" + 
			userId + " AND DECK_ID=" + deckId + ";", [JSON.stringify(deckState)]);		
	}

	if (deckState.answerQueue.length > 0) {
		makeTheUpdate();
	} else {
		exports.getRowsFromTableWhere("Card", "DECK_ID", deckId, function(cardResult){

			var cardsInState = [];
			for (var i in deckState.state.groups) {
				cardsInState = cardsInState.concat(deckState.state.groups[i]);
			}
			// If new cards have been added to this deck, update deckState data with them
			if (cardResult.length > cardsInState.length) {
				var cardsNotInState = [];
				for (var i in cardResult) {
					if (cardsInState.indexOf(cardResult[i].CARD_ID) < 0) {
						cardsNotInState.push(cardResult[i].CARD_ID);
					}
				}
				var newGroup0 = cardsNotInState.concat(deckState.state.groups[0]);
				deckState.state.groups[0] = newGroup0;
			}
			makeTheUpdate();
		});
	}

		
}

exports.getDeckState = function(userId, deckId, callback) {

	db.query("SELECT * FROM DeckState WHERE USER_ID="+userId+" AND DECK_ID="+deckId+";", function(err, result) {
		callback(result);
	});
}

exports.getAllDecksState = function(userId, callback) {

	db.query("SELECT * FROM DeckState WHERE USER_ID="+userId+" ORDER BY DECK_ID ASC;", function(err, result) {
		callback(result);
	});
}

exports.startClient = function(dbname){
	
	if((!db) || !db.connected){
		db = new MYSQL.createClient({
		  user: 'root',
		  password: 'hushu',
		  database: dbname,
		});
	}
	exports.db = db;
	return db;
}

exports.endClient = function(callback){
	db.end(callback);
}

var randomizeArray = function(array) {
	var randomized = [];
	while (array.length !== 0) {
		var randIndex = Math.floor(Math.random()*array.length);
		var item = array.splice(randIndex, 1);
		randomized.push(item[0]);
	}
	return randomized;
}
