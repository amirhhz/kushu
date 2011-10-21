
var testCase = require('nodeunit').testCase;
var leitner = require("../leitner");

module.exports = testCase({
    
    setUp: function (callback) {
    	this.deckState = {
			state: {
				revision: {
					rev_no: 1,
					rev_finished: false
				},
				next_due: {
					group: 0, card: 0
				},
				groups: [
					[1,2,3,4],
					[5,6,7,8],
					[9,10]
				],		
			},
			answerQueue: []
		};
		this.expectedUpdatedDeck = {
			state: {
				revision: {
					rev_no: 2,
					rev_finished: false
				},
				next_due: {
					group: 0, card: 0
				},
				groups: [
					[1,8],
					[2,3,5,6,7,9],
					[4,10]
				],		
			},
			answerQueue: []
		};
		this.testAnswers = [0,1,1,2,1,1,1,0,1,2];
        callback();
    },
    
    tearDown: function (callback) {
        callback();
    },
    
    testGetCurrentCardIsFirstCardFromFirstGroup: function(test) {
        test.equal(1, leitner.getCurrentCard(this.deckState));
        test.done();
    },
    
    testSettingTheAnswerOfCardAddsToTheAnswerQueue: function(test){
    	leitner.answerCurrentCard(this.deckState, 1);
    	var expected = [1];
    	test.deepEqual(expected , this.deckState.answerQueue);
    	test.done();
    },
    
    testAferAnsweringCurrentCardTheCurrentCardIsSecondFromFirstGroup: function(test){
    	leitner.answerCurrentCard(this.deckState, 0);
    	test.equal(2, leitner.getCurrentCard(this.deckState));
    	test.done();
    }, 
    
    testWhenAtTheEndOfTheFirstGroupAnsweringCurrentCardMovesToFirstCardOfSecondGroup: function(test) {   	
    	this.deckState.state.next_due.card = 3;
    	leitner.answerCurrentCard(this.deckState, 0); 
    	test.equal(5, leitner.getCurrentCard(this.deckState));
    	test.done();
    },
    
    testWhenAnsweringTheLastCardInDeckTheNextCardIsNull: function(test) {
    	this.deckState.state.next_due.group = 2;
    	this.deckState.state.next_due.card = 1;
    	leitner.answerCurrentCard(this.deckState, 0);
    	test.equal(null, leitner.getCurrentCard(this.deckState));
    	test.done();
    },
    
    testWhenUpdatingStateCardsAreCorrectlyRearranged: function(test) {
   
   		for(var index in this.testAnswers){
   			leitner.getCurrentCard(this.deckState);
   			leitner.answerCurrentCard(this.deckState, this.testAnswers[index]);
   		}

    	var updatedDeck = leitner.updateState(this.deckState);
    	test.deepEqual(this.expectedUpdatedDeck, updatedDeck);
    	test.done();	
    }

    
});