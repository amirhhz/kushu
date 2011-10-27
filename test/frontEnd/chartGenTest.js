ChartGenTest = TestCase("ChartGenTest");

Array.prototype.compareArrays = function(arr) {
    if (this.length != arr.length) return false;
    for (var i = 0; i < arr.length; i++) {
        if (this[i].compareArrays) { //likely nested array
            if (!this[i].compareArrays(arr[i])) return false;
            else continue;
        }
        if (this[i] != arr[i]) return false;
    }
    return true;
}

ChartGenTest.prototype.testSplitToThrees = function(){
	var longArray = [1,2,3,4,5,6,7,8,9];
	var twoDimArray = [[1,2,3], [4,5,6], [7,8,9]];

	assertTrue(twoDimArray.compareArrays(splitToThrees(longArray)));	
}

ChartGenTest.prototype.testSplitToThreesReturnsEmptyArrayForIncorrectData = function(){
	var longArray = [1,2,3,4,5,6,7,8,9,10];
	var emptyArray = new Array();

	assertTrue(emptyArray.compareArrays(splitToThrees(longArray)));	
}

ChartGenTest.prototype.testPieChartPercentagesAreGeneratedCorrectly = function(){
	var dStats = [  [3,5,2] , [6,10,4], [3,5,2] ];
	var testArray = [30,50,20];
	alert(getPieData(dStats));
	assertTrue(testArray.compareArrays(getPieData(dStats)));	
}

