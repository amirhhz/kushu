
var testCase = require('nodeunit').testCase;
var leitner = require("../leitner");

module.exports = testCase({
    
    setUp: function (callback) {
    	this.deckState = {
			state: {
				revision: {
					rev_no: 0,
					rev_date: "",
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
    	leitner.setAnswerOfCurrentCard(this.deckState, 1);
    	var expected = [1];
    	test.deepEqual(expected , this.deckState.answerQueue);
    	test.done();
    },
    
    testAferMovingToTheNextCardTheCurrentCardIsSecondFromFirstGroup: function(test) {
    	leitner.moveToNextCard(this.deckState);
    	test.equal(2, leitner.getCurrentCard(this.deckState));
    	test.done();
    }, 
    
    testWhenAtTheEndOfTheFirstGroupGettingNextCardMovesToFirstCardOfSecondGroup: function(test) {   	
    	this.deckState.state.next_due.card = 3;
    	leitner.moveToNextCard(this.deckState); 
    	test.equal(5, leitner.getCurrentCard(this.deckState));
    	test.done();
    },
    
    testWhenAtTheEndDeckTheNextCardIsNull: function(test) {
    	this.deckState.state.next_due.group = 2;
    	this.deckState.state.next_due.card = 1;
    	leitner.moveToNextCard(this.deckState);
    	test.equal(null, leitner.getCurrentCard(this.deckState));
    	test.done();
    }

    
});