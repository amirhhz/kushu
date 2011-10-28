
var deckNames = [""];
var deckNumbers;
	
/*
 * holds an array of deck IDs for the current user
 */

var userDecks = [];	

	
$.getJSON("/decks?format=json", function(data) {
	for (var i in data) {
		deckNames.push(data[i].deck_name);
	}
	for(var i in deckNumbers)
		userDecks[i] = deckNames[deckNumbers[i]];
});

/*
 * holds an array of deck IDs for the current user
 */
var userDecks = [];

/*
 * holds an array of the quantity of each answer type (correct etc)
 */
var deckStats = [ [] ]; 

/*
 * holds an array the card percentages for the pie chart
 */
var cardPercentages = [];

/*
 * holds an array of the Pie Chart Labels
 */
var chartLabels = new Array("Needs Work", "Unsure", "Correct" );

function splitToThrees(arr){
	
	if(arr.length % 3 != 0)
		return new Array();
	
	var len = arr.length / 3;
	var count = 0;
	var newArr = [];
	
	for(var i = 0; i < len; i++){
			newArr[i] = new Array();
		for(var j = 0; j < 3; j++){
			newArr[i][j] = arr[count];
			count++;
		}
	}	
	return newArr;
}

/*
 * generates the array of pie chart percentages for unsure, correct etc
 * also adds percentages to the chart labels array
 */
function getPieData(dStats){
	var needsWork = 0;
	var unsure = 0;
	var correct = 0;
	
	for(var i = 0; i < dStats.length; i++){
		needsWork += dStats[i][0];
		unsure += dStats[i][1];
		correct += dStats[i][2];
	}
	
	var total = needsWork + unsure + correct;
	
	var percentages = new Array((100 * needsWork / total) , (100 * unsure / total) , (100 * correct / total));
	
	return percentages;
	
}

/*
 * sums the elements of an array
 */
Array.prototype.sum = function(){
	var sum = 0;
	for(var i = 0; i < this.length; i++){
		sum += this[i];
	}
	return sum;
}

/*
 * converts the values in a 2 dimensional array so each sub array will hold the percentage of 
 * the total amount in the given array
 */
function convertToPercentages(twoDimArr){
	var newArray = [];
	
	for(var i = 0; i < twoDimArr.length; i++){
		var total = twoDimArr[i].sum();
		newArray[i] = [];
		for(var j = 0; j < twoDimArr[i].length; j++){
			newArray[i][j] =  parseInt((twoDimArr[i][j]/total) * 100) ;			
		}
	}
	return newArray;	
}

/*
 * extracts information from states and puts in local fields 
 */
function getData(states){
	
	var statArray = states.split(",");
	
	for(var i in statArray)
		statArray[i] = parseInt(statArray[i]);
	
	var arrayOfCards = splitToThrees(statArray);
	
	deckStats = convertToPercentages(arrayOfCards);
	cardPercentages = getPieData(deckStats);
	
	chartLabels[0] += " " + parseInt(cardPercentages[0]) + "%";
	chartLabels[1] += " " + parseInt(cardPercentages[1]) + "%";
	chartLabels[2] += " " + parseInt(cardPercentages[2]) + "%";
}

function getDeckIDs(decks){
	deckNumbers = decks.split(",");
	
	for(var i in deckNumbers)
		userDecks[i] = deckNames[deckNumbers[i]];
}

function showDiv(divID){
	document.getElementById('chartDiv1').style.display = 'none';
	document.getElementById('chartDiv2').style.display = 'none';
	document.getElementById('chartDiv3').style.display = 'none';
	document.getElementById(divID).style.display = 'block'; 	
}

function generateStreamChart2()
        {	
	
			if(deckStats.length == 0){
					return 0;
			}
	
			showDiv('chartDiv1');

            var chart1 = new RGraph.Bar('chart1', deckStats );
            chart1.Set('chart.title', 'Deck Progress');
            chart1.Set('chart.text.font', 'Arial Bold');
            chart1.Set('chart.text.size', 10);
            chart1.Set('chart.title.vpos', 0.5);
            chart1.Set('chart.colors', ['#c0504d', '#4f81bd', '#9bbb59']);
            chart1.Set('chart.gutter.left', 40);
            chart1.Set('chart.gutter.right', 5);
            chart1.Set('chart.gutter.top', 40);
            chart1.Set('chart.gutter.bottom', 60);
            chart1.Set('chart.shadow', true);
            chart1.Set('chart.shadow.color', '#aaa');
            chart1.Set('chart.background.barcolor1', 'white');
            chart1.Set('chart.background.barcolor2', 'white');
            chart1.Set('chart.background.grid.hsize', 5);
            chart1.Set('chart.background.grid.vsize', 5);
            chart1.Set('chart.grouping', 'stacked');
            chart1.Set('chart.labels', userDecks);
            //chart1.Set('chart.labels.above', true);
            chart1.Set('chart.key', ['Needs Work', 'Unsure', 'Correct']);
            chart1.Set('chart.key.background', 'rgba(255,255,255,0.7)');
            chart1.Set('chart.key.position', 'gutter');
            chart1.Set('chart.key.position.gutter.boxed', false);
            chart1.Set('chart.key.position.y', chart1.Get('chart.gutter.top') - 15);
            chart1.Set('chart.key.border', false);
            chart1.Set('chart.background.grid.width', 0.3); // Decimals are permitted
            chart1.Set('chart.text.angle', 25);
            chart1.Set('chart.strokestyle', 'rgba(0,0,0,0)');
            chart1.Set('chart.tooltips.event', 'onmousemove');
            
            if (!RGraph.isIE8()) {
                tooltipFunc = function (i)
                {
                    var r = i % 3;
                    
                    if (r == 2) return 'Correct';
                    else if (r == 1) return 'Unsure';
                    else if (r == 0) return 'Needs Work';
                }
                chart1.Set('chart.tooltips', tooltipFunc);
            }

            if (!RGraph.isIE8()) {
                RGraph.Effects.Bar.Grow(chart1);
            } else {
                chart1.Draw();
            }
        }
		
		function generatePie(){
			
			if(deckStats.length == 0){
				return 0;
			}
				
			showDiv('chartDiv2');
			
		    var chart2 = new RGraph.Pie('chart2', cardPercentages); // Create the pie object
            chart2.Set('chart.labels', chartLabels);
            chart2.Set('chart.labels.sticks', true);
            chart2.Set('chart.colors', ['#c0504d', '#4f81bd', '#9bbb59']);
            chart2.Set('chart.gutter.left', 35);
            chart2.Set('chart.gutter.right', 35);
            chart2.Set('chart.gutter.top', 50);
            chart2.Set('chart.gutter.bottom', 35);
            chart2.Set('chart.title', "Card Percentages");
            chart2.Set('chart.title.vpos', 0.3);
            chart2.Set('chart.shadow', false);
            chart2.Set('chart.tooltips.effect', 'fade');
            chart2.Set('chart.tooltips.event', 'onmousemove');
            chart2.Set('chart.tooltips', [
                                        'Needs Work',
                                        'Unsure',
                                        'Correct'                                        
                                       ]
                                      );
            chart2.Set('chart.highlight.style', '2d');
            chart2.Set('chart.linewidth', 2);
            chart2.Set('chart.strokestyle', 'rgba(255,255,255,1)');
            chart2.Set('chart.shadow', true);
            chart2.Set('chart.shadow.offsetx', 0);
            chart2.Set('chart.shadow.offsety', 0);
            chart2.Set('chart.shadow.blur', 15);
            chart2.Set('chart.exploded', [0,0,20,20]);
            
            if (RGraph.isIE8()) {
                chart2.Draw();
            } else {
                RGraph.Effects.Pie.Grow(chart2);
            }
		
		
		}
		
        function generateStreamChart()
        {
        	showDiv('chartDiv3');
        	
            var chart3 = new RGraph.Bar('chart3', [[12,15,19], [11,14, 9], [10,15,3], [3,1,2], [12,9,20], [15,2,8], [19,6,2]]);
            //chart3.Set('chart.units.pre', '$');
            chart3.Set('chart.title', '1Wk Progress (cards viewed)');
            chart3.Set('chart.title.vpos', 0.5);
            chart3.Set('chart.colors', ['#c0504d', '#4f81bd', '#9bbb59']);
            chart3.Set('chart.gutter.left', 40);
            chart3.Set('chart.gutter.right', 5);
            chart3.Set('chart.gutter.top', 40);
            chart3.Set('chart.gutter.bottom', 50);
            chart3.Set('chart.shadow', true);
            chart3.Set('chart.shadow.color', '#aaa');
            chart3.Set('chart.background.barcolor1', 'white');
            chart3.Set('chart.background.barcolor2', 'white');
            chart3.Set('chart.background.grid.hsize', 5);
            chart3.Set('chart.background.grid.vsize', 5);
            chart3.Set('chart.grouping', 'stacked');
            chart3.Set('chart.labels', ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
            chart3.Set('chart.labels.above', true);
            chart3.Set('chart.key', ['Needs Work', 'Unsure', 'Correct']);
            chart3.Set('chart.key.background', 'rgba(255,255,255,0.7)');
            chart3.Set('chart.key.position', 'gutter');
            chart3.Set('chart.key.position.gutter.boxed', false);
            chart3.Set('chart.key.position.y', chart3.Get('chart.gutter.top') - 15);
            chart3.Set('chart.key.border', false);
            chart3.Set('chart.background.grid.width', 0.3); // Decimals are permitted
            chart3.Set('chart.text.angle', 0);
            chart3.Set('chart.strokestyle', 'rgba(0,0,0,0)');
            chart3.Set('chart.tooltips.event', 'onmousemove');
            
            if (!RGraph.isIE8()) {
                tooltipFunc = function (i)
                {
                    var r = i % 3;
                    
                    if (r == 2) return 'Correct';
                    else if (r == 1) return 'Unsure';
                    else if (r == 0) return 'Needs Work';
                }
                chart3.Set('chart.tooltips', tooltipFunc);
            }

            if (!RGraph.isIE8()) {
                RGraph.Effects.Bar.Grow(chart3);
            } else {
                chart3.Draw();
            }
        }