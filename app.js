
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();
var routes = require("./routes");
var models = require("./models");

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.enable('jsonp callback');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'hushu' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  app.use(express.logger("dev"));
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.helpers({
	imageOrText: function(question) {
		var imgPattern = new RegExp("^(.+)\.(jpg|png|gif|jpeg)$", "i");
		var match = imgPattern.exec(question);
		if(match) {
			return "<img src='/content/cards/"+question+"' />";
		} else {
			return question;
		}
	},
	// Returns a map with the question and its answer, or 
	// null if question is not a math one.
	generateMathQA: function(question) {
		
		var MAX_ARG = 20;
		
		var mathPattern = new RegExp("^\\$([+*/\-])\\$$", "i");
		var match = mathPattern.exec(question);
		if(match) {
			 var opCode = " " + match[1] + " ";
			 var arg1 = 1 + Math.floor(Math.random()*MAX_ARG);
			 var arg2 = 1 + Math.floor(Math.random()*MAX_ARG);
			 
			 var questionText = arg1 + opCode + arg2;
			 var answerText = "" + eval(questionText);
			 return {q: questionText, a: answerText};			 
		} else {
			return null;
		}
	}	
});

app.dynamicHelpers({
	session: function (req, res) {
		return req.session;
	},
	messages: require('express-messages')
});

models.startClient("kushu_test");
app.models = models;

// Routes
routes(app);

var port = (process.argv.length > 2) ? process.argv[2] : 3000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);