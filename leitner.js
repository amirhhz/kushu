


//deckstate
//revision-date ¬¬¬ current card/e for end ¬¬¬ cards in group 1 ¬¬¬ cards in group 2 ¬¬¬ cards in group 3 

var deckState = {
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


exports.getCurrentCard = function(stateOfDeck){
	
	
	
	if(stateOfDeck.state.revision.rev_finished){
		return null;
	}else{
	return stateOfDeck.state.groups[
	stateOfDeck.state.next_due.group][stateOfDeck.state.next_due.card];
	}
}

exports.setAnswerOfCurrentCard = function(stateOfDeck, answer){
	stateOfDeck.answerQueue.push(answer);
}

exports.moveToNextCard = function(stateOfDeck){
	
	if(!stateOfDeck.state.revision.rev_finished){
		if(stateOfDeck.state.groups[stateOfDeck.state.next_due.group].length-1 == stateOfDeck.state.next_due.card) {
			stateOfDeck.state.next_due.group++;
			stateOfDeck.state.next_due.card=0;
		} else {
			stateOfDeck.state.next_due.card++;
		}
	}
	
	if (stateOfDeck.state.next_due.group == stateOfDeck.state.groups.length){
		stateOfDeck.state.revision.rev_finished = true;
	}
	
}

exports.updateCardWithAnswer = function(stateOfDeck){
	
}

exports.updateString = function(stateOfDeck){
	
}

function getGroupAndPosition(stateOfDeck){
	
	// the new state
	return ""; 
}