var mongodb = require('mongodb');
var _ = require('underscore');

var db = mongodb.Db('school', new mongodb.Server('localhost', 27017), {safe: true});

db.open(function(err, client) {
	if(err) {
		console.log('Error opening connection' + err);
	}
	var collection = new mongodb.Collection(client, 'students');
	collection.find({"scores.type": "homework"}).toArray(function(err, results) {
		if (err) {
			console.log(err);
		}
		var removed = 0;
		_.each(results, function(student) {
			var lowest = {
				index: null,
				score: null
			};
			_.each(student.scores, function(score, index) {
				if (score.type === 'homework') {
					if (lowest.score === null || lowest.score > score.score) {
						lowest.score = score.score;
						lowest.index = index;
					}
				}
			});
			student.scores.splice(lowest.index, 1);
			console.log({"_id": student._id});
			console.log(student);
			collection.update({"_id": student._id}, student, function (err, result) {
				if (err) {
					console.log(err);
					return;
				}
				removed++;
			});
		});
		console.log('Removed: ' + removed);
		client.close();
	});
});
