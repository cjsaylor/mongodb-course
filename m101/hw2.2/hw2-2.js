var mongodb = require('mongodb');
var _ = require('underscore');

var db = mongodb.Db('students', new mongodb.Server('localhost', 27017), {safe: true});

db.open(function(err, client) {
	if(err) {
		console.log('Error opening connection' + err);
	}
	var collection = new mongodb.Collection(client, 'grades');
	collection.find({type: 'homework'}, {sort: [['student_id', 'asc'], ['score', 'desc']]}).toArray(function(err, results) {
		if (err) {
			console.log(err);
		}
		var currentId = results[0].student_id,
			currentDocId = results[0]._id,
			removed = 0;
		_.each(results, function(grade, index) {
			if (grade.student_id !== currentId || index === results.length - 1) {
				currentId = grade.student_id
				collection.remove({_id: currentDocId}, function(err, result) {});
				removed++;
			}
			currentDocId = grade._id;
		})
		console.log('Removed: ' + removed);
		client.close();
	});
});
