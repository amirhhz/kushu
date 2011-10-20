var testCase = require('nodeunit').testCase;
var models = require("../models");

module.exports = testCase({
    setUp: function(callback) {
    	models.startClient("kushu_test");
        callback();
    },
    
    tearDown: function(callback) {
        models.endClient();
        callback();
    },
    
    testGetDeckWithIdOne: function(test) {
        models.getRowsFromTableWhere("Deck","DECK_ID", 1, function(result){
        	var expected = [ { DECK_ID: 1, deck_name: 'Capitals', reversible: 1 } ];
        	test.deepEqual(expected, result);
        	test.done();
        }); 
    },
    
    testGetAllUsers: function(test) {
    	models.getAllFromTableQuery("User", function(result){
        	test.ok(result.length==5);
        	test.equal("Adam", result[2].username);
        	test.equal("passwordG", result[0].password);
        	test.done();
        });
    },
    
    testNumberOfCardsInDeckThreeIsFour: function(test) {
    	var queryMap = {
    		deckThree : "SELECT * FROM Card where DECK_ID=3;"
    	};
    	
    	models.performQueries(queryMap, function(result){
    		test.equal(4, result["deckThree"].length);
    		test.done(); 
    	});
    },
    
    testMultipleQueriesReturnResultsOfCorrectLength: function(test) {
    	var queryMap = {
    		decks : "SELECT * FROM Card where DECK_ID=1;",
    		cards : "SELECT front FROM Card WHERE DECK_ID=2;",
    		users : "SELECT username, USER_ID FROM User;"
    	};
    	
    	models.performQueries(queryMap, function(result){
    		test.equal(10, result["decks"].length);
    		test.equal(10, result["cards"].length);
    		test.equal(5, result["users"].length);    		
    		test.done(); 
    	});
    },
    
    testDBIsDisconnectedOnEndingClient: function(test) {
    	models.endClient(function(){
	    	test.ok(models.db.connected == false);
	    	test.done();
    	});
    }
});
