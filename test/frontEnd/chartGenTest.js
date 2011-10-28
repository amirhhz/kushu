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

ChartGenTest.prototype.testSplitToThreesForSingleArray = function(){
	var longArray = [1,2,3];
	var expectedArray = [[1,2,3]];

	assertTrue(expectedArray.compareArrays(splitToThrees(longArray)));	
}

ChartGenTest.prototype.testSplitToThreesForOneEmptyOneFull = function(){
	var longArray = [1,2,3,0,0,0];
	var expectedArray = [[1,2,3],[0,0,0]];

	assertTrue(expectedArray.compareArrays(splitToThrees(longArray)));	
}

ChartGenTest.prototype.testSplitToThreesReturnsEmptyArrayForIncorrectData = function(){
	var longArray = [1,2,3,4,5,6,7,8,9,10];
	var emptyArray = new Array();

	assertTrue(emptyArray.compareArrays(splitToThrees(longArray)));	
}

ChartGenTest.prototype.testSplitToThreesWillReturnEmptyArray = function(){
	var longArray = [];
	var emptyArray = new Array();

	assertTrue(emptyArray.compareArrays(splitToThrees(longArray)));	
}

ChartGenTest.prototype.testPieChartPercentagesAreGeneratedCorrectly = function(){
	var dStats = [  [3,5,2] , [6,10,4], [3,5,2] ];
	var expectedArray = [30,50,20];
	assertTrue(expectedArray.compareArrays(getPieData(dStats)));	
}

ChartGenTest.prototype.testPieChartPercentagesAreGeneratedForSingleArray = function(){
	var dStats = [  [2,5,3] ];
	var expectedArray = [20,50,30];
	assertTrue(expectedArray.compareArrays(getPieData(dStats)));	
}

ChartGenTest.prototype.testPieChartPercentagesAreGeneratedForZeroValues = function(){
	var dStats = [  [0,0,5], [5,0,0] ];
	var expectedArray = [50,0,50];
	assertTrue(expectedArray.compareArrays(getPieData(dStats)));	
}

ChartGenTest.prototype.testPieChartPercentagesAreGeneratedForArrayOfZeros = function(){
	var dStats = [  [0,0,0], [1,1,2] ];
	var expectedArray = [25,25,50];
	assertTrue(expectedArray.compareArrays(getPieData(dStats)));	
}

ChartGenTest.prototype.testPieChartPercentagesAreGeneratedWithSingleArrayOfZeros = function(){
	var dStats = [  [1,0,0] , [0,0,1] , [0,0,0], [0,1,1] ];
	var expectedArray = [25,25,50];
	assertTrue(expectedArray.compareArrays(getPieData(dStats)));	
}
