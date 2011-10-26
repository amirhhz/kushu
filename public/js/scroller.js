var windowHeight = document.height;
var windowWidth = document.width;

var numberOfCardsInDeck;
var currentPositionInDeck = 0;

var currentResponseToAnswer = null;
var listOfCurrentResponses = new Array();


var WIDTH = 640;
var HEIGHT = 386;

var selectedButton;

if(windowWidth < 480){
	WIDTH = 320;
	HEIGHT = 192;
}else if(windowWidth < 640){
	WIDTH = 480;
	HEIGHT = 288;
}else if(windowWidth < 800){
	WIDTH = 640;
	HEIGHT = 386;	
}else{
	WIDTH = 800;
	HEIGHT = 480;	
}

$(function(){
      $("#myScroll").mbScrollable({
		dir:"vertical",
        width:WIDTH,
        elementsInPage:1,
        elementMargin:0,
        height:HEIGHT,
        controls:"#controls",
        slideTimer:600,
        autoscroll:false,
        scrollTimer:2000 
      });
    });


function setDeckLength(lengthOfDeck) {
	//times by 2 as there are 2 sides of each card
	numberOfCardsInDeck = lengthOfDeck * 2;
}

function showHideDifficultyButtons() {
	currentPositionInDeck++;	
	resetColorOfButtons();
	
	var difficultyButtons = document.getElementById("difficultyButtons");	
	
	if(currentPositionInDeck < numberOfCardsInDeck - 1){
		if(currentPositionInDeck % 2 != 0){
			document.getElementById("nextCardButton").style.display = "none";
			document.getElementsByClassName("next")[0].innerHTML = "<div align=\"center\">Next Question!</div>";
			difficultyButtons.style.display = "block";
		}else{
			listOfCurrentResponses.push(currentResponseToAnswer);
			document.getElementsByClassName("next")[0].innerHTML = "<div align=\"center\">Show Answer!</div>";
			difficultyButtons.style.display = "none";
			currentResponseToAnswer = null;
		}
	}else{
		document.getElementById("controls").innerHTML = "<div align=\"center\"><p><b>End Of Deck!</b></p></div>";
		difficultyButtons.style.display = "block";
	}
}

function updateCorrectButton(buttonId) {
	
	document.getElementById("nextCardButton").style.display = "block";
	
	resetColorOfButtons();
	
	if(buttonId == 0){
		currentResponseToAnswer = 2;
		document.getElementsByClassName("positive")[0].style.backgroundColor = "#529214";
		document.getElementsByClassName("positive")[0].style.color = "#FFF";
		selectedButton = 0;
	}else if(buttonId == 1){
		currentResponseToAnswer = 1;
		document.getElementsByClassName("almost")[0].style.backgroundColor = "#6299c5";
		document.getElementsByClassName("almost")[0].style.color = "#FFF";
		selectedButton = 1;
	}else{
		currentResponseToAnswer = 0;
		document.getElementsByClassName("negative")[0].style.backgroundColor = "#d12f19";
		document.getElementsByClassName("negative")[0].style.color = "#FFF";
		selectedButton = 2;
	}
}

function resetColorOfButtons(){
	document.getElementsByClassName("positive")[0].style.backgroundColor = "";
	document.getElementsByClassName("positive")[0].style.color = "";
	document.getElementsByClassName("almost")[0].style.backgroundColor = "";
	document.getElementsByClassName("almost")[0].style.color = "";
	document.getElementsByClassName("negative")[0].style.backgroundColor = "";
	document.getElementsByClassName("negative")[0].style.color = "";
}

function saveAndExit(){
	
	if(currentPositionInDeck < numberOfCardsInDeck - 1){
		if(currentPositionInDeck % 2 != 0){
			if(currentResponseToAnswer != null){
				listOfCurrentResponses.push(currentResponseToAnswer);
				currentResponseToAnswer = null;
				postAnswersAndRedirect();
			}else{
				window.alert("You must select a response to exit!");
			}
			
		}else{
			postAnswersAndRedirect();
		}
	}else{
		if(currentResponseToAnswer != null){
			listOfCurrentResponses.push(currentResponseToAnswer);
			postAnswersAndRedirect();
		}else{
			window.alert("You must select a response to exit!");
		}
	
	}
}

function postAnswersAndRedirect() {
	// deckId should be set in the EJS template
	$.post("/deck/"+deckId, { 'answers': listOfCurrentResponses });
	window.location="/decks";
}
