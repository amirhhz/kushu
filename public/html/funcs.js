	
	function incorrectPassword(){
		document.getElementById("divWrongPassword").innerHTML = "Incorrect password. Please try again"			
	}
	
	var passwordArray = new Array();
	
	passwordArray['Bob'] = 'passwordB';
	passwordArray['Dan'] = 'passwordD';
	passwordArray['James'] = 'passwordJ';
	passwordArray['Bodrul'] = 'passwordB';
	passwordArray['Amir'] = 'passwordA';
	
	function checkPassword() {
		
		var login = document.getElementById("username").value;
		var pass = document.getElementById("password").value;
		
		if (passwordArray[login] == pass)
			document.location.pathname = "html/DeckChoice.html";
			
		else
			incorrectPassword();
	
	}
	
	/*
	 * The next function is a constructor to create a card pairing. followed by some card creations
	 */
	
	function Card(id, deckId, question, answer){
	 	this.id = id;
	 	this.deckId = deckId;
	 	this.question = question;
	 	this.answer = answer;
	 	this.difficulty = 3;
	 	
	}

	var cards = new Array(10);

	cards[1] = new Card(1,1,"Scotland", "Edinburgh");
	cards[2] = new Card(2,1,"France", "Paris");
	cards[3] = new Card(3,1,"England", "London");
	cards[4] = new Card(4,1,"Iceland", "Oslo");
	cards[5] = new Card(5,1,"Finland", "Helsinki");
	cards[6] = new Card(6,1,"Estonia", "Tallinn");
	cards[7] = new Card(7,1,"Croatia", "Zagreb");
	cards[8] = new Card(8,1,"Albania", "Tirana");
	cards[9] = new Card(9,1,"Phillippines", "Manila");
	cards[10] = new Card(10,1,"Uruguay", "Montevideo");
	
	var currentQ = 1;
	var currentA = 1;
	var count = 1;
	
	function getNextQuestion(){
		return cards[currentQ++].question; 
	}
	
	function getNextAnswer(){
		return cards[currentA++].answer;
	}
	
	/*
	 * this changes the "question div" in the temp quiz page flipping from question to answer
	 */
	function doNext(){
		var input2;
		var QA;
		
		if(currentA == cards.length)
			document.getElementById("question").innerHTML = "END OF SESSION";
		
		else if(count % 2 == 0)
		{	document.getElementById("question").innerHTML = "<font size='13'>" + getNextAnswer() + "</font> </br></br> " +
			"<button class='myButton' onClick='doNext()'>Incorrect</button>" +
			"<button class='myButton' onClick='doNext()'>Nearly</button>" +
			"<button class='myButton' onClick='doNext()'>Correct</button>" ;
			count++;
		}
			
		else
		{	
			document.getElementById("question").innerHTML = "<font size='13'>" + getNextQuestion() + "</font> </br></br> " +
			"<button class='myButton' onClick='doNext()'>Get Answer</button>";
			count++;
		}
			
		
	}

	
	
	
	