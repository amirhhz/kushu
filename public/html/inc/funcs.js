	
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
			document.location.pathname = "";
			
		else
			incorrectPassword();
	
	}