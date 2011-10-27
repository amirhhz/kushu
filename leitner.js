
exports.createEmptyDeckState = function (){
	var emptyDeck = {
		state: {
			revision: {
				rev_no: 1,
				rev_finished: false
			},
			next_due: 0,
			groups: [
				[],
				[],
				[]
			],		
		},
		answerQueue: []
	};
	return emptyDeck;
}

exports.updateDeckStateWithPartialAnswers = function(stateOfDeck, partialAnswers){
	
	for(var i in partialAnswers){
		stateOfDeck.answerQueue.push(parseInt(partialAnswers[i]));	
	}
	stateOfDeck.state.next_due += partialAnswers.length;
	
	if(getLengthOfCurrentRevision(stateOfDeck) == stateOfDeck.answerQueue.length){
		return exports.updateDeckStateWithFullAnswers(stateOfDeck);
	}else{
		return stateOfDeck;
	}
}

exports.updateDeckStateWithFullAnswers = function(stateOfDeck){
	
		var answers = stateOfDeck.answerQueue;
		var currentGroups = stateOfDeck.state.groups;
		var updatedGroups = [];
		var rev_no = stateOfDeck.state.revision.rev_no;
		for(var i=0; i<currentGroups.length; i++){
			updatedGroups.push(new Array());
		}
		
		for(var i in currentGroups) {
			var group = currentGroups[i];		
			var properIndex = parseInt(i);
			properIndex++;
			// If this group was played
			if((rev_no % properIndex)==0){
				for(var index in group){
					// go through each item in answers to find a group and then push the card onto that group
					updatedGroups[answers.shift()].push(group[index]);
				}
			} else {
				for(var index in group){
					updatedGroups[i].push(group[index]);
				}
			}
		}
		
		var updatedDeckState = exports.createEmptyDeckState();
		updatedDeckState.state.revision.rev_no = (stateOfDeck.state.revision.rev_no+1);
		updatedDeckState.state.groups = updatedGroups;
		while(getLengthOfCurrentRevision(updatedDeckState)==0){
			updatedDeckState.state.revision.rev_no++;
		}
		return updatedDeckState; 
}

exports.getCardsForCurrentRevision = function(stateOfDeck){
	
	var revisionCards = [];
	var rev_no = stateOfDeck.state.revision.rev_no;
	var groups = stateOfDeck.state.groups;
	
	for(var i in groups){
		var subGroup = groups[i];
		var properIndex = parseInt(i);
		properIndex++;
		if((rev_no % properIndex)==0){
			for(var index in subGroup){
				revisionCards.push(subGroup[index]);
			}
		}
	}
	var cards = revisionCards.slice(stateOfDeck.state.next_due);
	return cards;
}

var getLengthOfCurrentRevision = function(stateOfDeck){
	
	var rev_no = stateOfDeck.state.revision.rev_no;
	var groups = stateOfDeck.state.groups;
	var revisionLength=0;
	for(var i in groups){
		var subGroup = groups[i];
		var properIndex = parseInt(i);
		properIndex++;
		if((rev_no % properIndex)==0){
			revisionLength += subGroup.length; 
		}
	}
	return revisionLength;
}
