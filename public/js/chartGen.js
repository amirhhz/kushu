/* temp deck names array - need to be grabbed from the decks tables*/

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
	
	for(i in dStats){
		needsWork += dStats[i][0];
		unsure += dStats[i][1];
		correct += dStats[i][2];		
	}
	
	var total = needsWork + unsure + correct;
	
	var percentages = new Array((100 * needsWork / total) , (100 * unsure / total) , (100 * correct / total));
	
	chartLabels[0] += " " + parseInt(100 * needsWork / total) + "%";
	chartLabels[1] += " " + parseInt(100 * unsure / total) + "%";
	chartLabels[2] += " " + parseInt(100 * correct / total) + "%";
	
	return percentages;
	
}

/*
 * extracts information from states and puts in local fields 
 */
function getData(states){
	
	var statArray = states.split(",");
	
	for(var i in statArray)
		statArray[i] = parseInt(statArray[i]);
	
	deckStats = splitToThrees(statArray);
	cardPercentages = getPieData(deckStats);
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
			showDiv('chartDiv1');

            var chart1 = new RGraph.Bar('chart1', deckStats );
            chart1.Set('chart.title', 'Deck Progress');
            chart1.Set('chart.title.vpos', 0.5);
            chart1.Set('chart.colors', ['purple', 'blue', 'green']);
            chart1.Set('chart.gutter.left', 40);
            chart1.Set('chart.gutter.right', 5);
            chart1.Set('chart.gutter.top', 40);
            chart1.Set('chart.gutter.bottom', 50);
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
			showDiv('chartDiv2');
			
		    var chart2 = new RGraph.Pie('chart2', cardPercentages); // Create the pie object
            chart2.Set('chart.labels', chartLabels);
            chart2.Set('chart.labels.sticks', true);
            chart2.Set('chart.gutter.left', 30);
            chart2.Set('chart.gutter.right', 30);
            chart2.Set('chart.gutter.top', 35);
            chart2.Set('chart.gutter.bottom', 35);
            chart2.Set('chart.title', "Card Percentages");
            chart2.Set('chart.title.vpos', 0.3);
            chart2.Set('chart.shadow', false);
            chart2.Set('chart.tooltips.effect', 'fade');
            chart2.Set('chart.tooltips.event', 'onmousemove');
            //chart2.Set('chart.exploded', [0,0,15,25]);
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
            chart3.Set('chart.colors', ['red', 'blue', 'green']);
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