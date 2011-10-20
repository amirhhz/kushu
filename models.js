
var MYSQL = require('mysql');
var db; 
exports.db = db;

exports.performQueries = function(queryMap, callback)
{
	var response = {};
	for ( var key in queryMap)
	{
		(function(key, queryString)
		{
			db.query(queryString, function(err, result)
			{	
				response[key] = result;
				if (Object.keys(response).length === Object.keys(queryMap).length)
					callback(response);
			});
		}(key, queryMap[key]))
	}
}

exports.getAllFromTableQuery = function(table, callback){
	
	db.query("SELECT * from "+table+";", function(err, result){
		if(err){
			throw err;
		}	
		callback(result);
	});
}

exports.getRowsFromTableWhere = function(table, field,  value, callback){
	
	db.query("SELECT * from "+table+" WHERE "+field+"="+value+";", function(err, result){
		if(err){
			throw err;
		}	
		callback(result);
	});
}

exports.startClient = function(dbname){
	
	if((!db) || !db.connected){
		db = new MYSQL.createClient({
		  user: 'root',
		  password: 'hushu',
		  database: dbname,
		});
	}
	exports.db = db;
	return db;
}

exports.endClient = function(callback){
	db.end(callback);
}



