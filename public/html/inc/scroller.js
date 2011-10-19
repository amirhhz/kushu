var windowHeight = document.height;
var windowWidth = document.width;


var numberOfCardsInDeck = 4;
var currentPositionInDeck = 0;

if(windowWidth > 666){

}


$(function(){
      $("#myScroll").mbScrollable({
		dir:"vertical",
        width:666,
        elementsInPage:1,
        elementMargin:0,
        height:406,
        controls:"#controls",
        slideTimer:600,
        autoscroll:false,
        scrollTimer:2000 
      });
    });
    

function getCorrectButton () {
	currentPositionInDeck++;
	if(currentPositionInDeck < numberOfCardsInDeck - 1){
		if(currentPositionInDeck % 2 != 0){
			document.getElementsByClassName("next")[0].innerHTML = "Get Next Question!";
		}else{
			document.getElementsByClassName("next")[0].innerHTML = "Get Answer!";
		}
	}else{
		document.getElementsByClassName("next")[0].innerHTML = "End of Deck!";
	}
}