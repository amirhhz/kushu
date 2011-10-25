
var testCase = require('nodeunit').testCase;
var leitner = require("../leitner");

module.exports = testCase({
    
    setUp: function (callback) {
    	this.deckState = {
			state: {
				revision: {
					rev_no: 2,
					rev_finished: false
				},
				next_due:0,
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
					rev_no: 3,
					rev_finished: false
				},
				next_due: 0,
				groups: [
					[1,8],
					[2,3,5,6,7],
					[4,9,10]
				],		
			},
			answerQueue: []
		};
		this.testAnswers = [0,1,1,2,1,1,1,0];
        callback();
    },
    
    tearDown: function (callback) {
        callback();
    },
    
    testWhenUpdatingStateCardsAreCorrectlyRearranged: function(test) {
   		
    	var updatedDeck = leitner.updateDeckStateWithPartialAnswers(this.deckState, this.testAnswers);
    	test.deepEqual(this.expectedUpdatedDeck, updatedDeck);
    	test.done();	
    },
    
    testUpdatingWithPartialAnswersResultsInDifferentCurrentRevisionCards: function(test) {
		
		var partiallyUpdated = leitner.updateDeckStateWithPartialAnswers(this.deckState, [1,0,1,2,1]);    
    	test.equal(5, partiallyUpdated.state.next_due);
    	test.deepEqual([6,7,8], leitner.getCardsForCurrentRevision(partiallyUpdated));
    	test.done();
    },
    
    testUpdatingRevisionThreeWithPartialAnswersResultsInDifferentCurrentRevisionCards: function(test) {
		
		this.deckState.state.revision.rev_no=3;
		var partiallyUpdated = leitner.updateDeckStateWithPartialAnswers(this.deckState, [1,0,1,2]);    
    	test.equal(4, partiallyUpdated.state.next_due);
    	test.deepEqual([9,10], leitner.getCardsForCurrentRevision(partiallyUpdated));
    	test.done();
    },
    
    testUpdateWithTwoPartialAnswersThatAddUpToAFullAnswerProgressesToNextRev: function(test) {
    	
    	var updatedState = leitner.updateDeckStateWithPartialAnswers(this.deckState, [0,1,1,2]);
    	updatedState = leitner.updateDeckStateWithPartialAnswers(updatedState, [1,1,1,0]);
    	
    	test.deepEqual([1,8,4,9,10],leitner.getCardsForCurrentRevision(updatedState));
    	test.equal(0,updatedState.state.next_due);
    	test.deepEqual([],updatedState.answerQueue);
    	test.equal(3, updatedState.state.revision.rev_no);
    	test.done();
    },
    
    testTheCardsForRevisionTwoGetsTheCardsFromGroupOneAndTwoButNotThree: function(test) {
    	
    	var expectedResult = [1,2,3,4,5,6,7,8];
    	this.deckState.state.revision.rev_no=2;
    	var currentRevisionCards = leitner.getCardsForCurrentRevision(this.deckState);
    	test.deepEqual(expectedResult, currentRevisionCards);
    	test.done();
    }

    
});