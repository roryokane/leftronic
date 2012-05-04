var https = require('https'); 

function LeftronicClient(api_key) {
    this.apiUrl = 'https://www.leftronic.com/customSend';
    this.pushNumber = function(obj, callback) { 
	var number = obj.number;
	var prefix = obj.prefix;
	var suffix = obj.suffix;
	var timestamp = obj.timestamp;
	if (Array.isArray(number)) {
	    if (!Array.isArray(timestamp) || (timestamp.length != number.length) ) {
		if (callback) return callback(new Error("Need to pass an array of timestamps of equal length as the array of numbers."));
		return;
	    }
	    var point = [];
	    for (var i in number) {
		var p =  {'number': number[i], 'timestamp': timestamp[i]};
		if (prefix && prefix[i]) p.prefix = prefix[i];
		if (suffix && suffix[i]) p.suffix = suffix[i];
		point.push(p);
	    }
	}

	else {

	    var point = {'number': number};
	    if (prefix) {
		point.prefix = prefix;
	    }
	    if (suffix) {
		point.suffix = suffix;
	    }
	    if (timestamp) {
		point.timestamp = timestamp;
	    }
	}
	this.postData(obj.streamName, point, null, callback);
    
    }
    
    this.pushText = function(obj, callback) { 
	var title = obj.title;
	var msg = obj.msg;
	var imgUrl = obj.imgUrl;

	if (Array.isArray(title)) {
	    if (!Array.isArray(msg) || (msg.length != title.length)) {
		if (callback)
		    return callback(new Error("Need to pass an array of text feed messages of equal length as the array of titles."));
		return;
	    }
	    var point = [];
	    for (var i in title) {
		var p = {'title': title[i], 'msg': msg[i]};
		if (imgUrl && imgUrl[i]) p.imgUrl = imgUrl[i];
		point.push(p);
	    }
	}
	else {

	    var point = {'msg': msg, 'title': title};
	    if (imgUrl)
		point.imgUrl = imgUrl;
	}
	this.postData(obj.streamName, point, null, callback);
    }

    this.pushLeaderboard = function(obj, callback) {
	/* [{'name': 'Cheryl', 'value': 88, 'prefix': '$'}....] */
	var leaderArray = obj.leaderboard;

	var point = {'leaderboard': leaderArray};
	this.postData(obj.streamName, point, null, callback);
    }

    this.pushGeo = function(obj, callback) { 
	var latitude = obj.latitude;
	var longitude = obj.longitude;
	var color = obj.color;

	if (Array.isArray(latitude)) {
	    if (!Array.isArray(longitude) || (longitude.length != latitude.length) ) {
		if(callback) 
		    return callback(new Error("Latitude and longitude arrays must be the same length"));
		return;
	    }
	    var point = [];
	    for (var i in latitude) {
		var p = {'latitude': latitude[i], 'longitude': longitude[i]};
		if (color && color[i]) p.color = color[i];
		point.push(p);
	    }

	}
	else {
	    var point = {'latitude': latitude, 'longitude': longitude};
	    if (color) {
		point.color = color;
	    }
	}
	this.postData(obj.streamName, point, null, callback);

    }

    this.pushList = function(obj, callback) {
	/* list is just ['item 1', 'item 2', ....] */
	var list = obj.list;
	for (var i in list) {
	    list[i] = {'listItem': list[i]};
	}
	var point = {'list': list};
	this.postData(obj.streamName, point, null, callback);

    }

    this.pushImage = function(obj, callback) {
	var imgUrl = obj.imgUrl;
	var point = {'imgUrl': imgUrl};
	this.postData(obj.streamName, point, null, callback);

    }

    this.pushLabel = function(obj, callback) {
	var label = obj.label;
	var point = {'label': label};
	this.postData(obj.streamName, point, null, callback);
    }

    this.pushPair = function(obj, callback) {
	var x = obj.x;
	var y = obj.y;

	if (Array.isArray(x)) {
	    if (!Array.isArray(y) || (y.length != x.length) ) {
		if (callback) 
		    return callback(new Error("x and y arrays must be of equal length"));
		return;
	    }
	    var point = [];
	    for (var i in x) {
		var p = {'x': x[i], 'y': y[i]};
		point.push(p);
	    }
	}
	else {
	    var point = {'x': x, 'y': y};
	}
	this.postData(obj.streamName, point, null, callback);

    }

    this.pushTable = function(obj, callback) {
	var header = obj.header;
	var data = obj.data;

	var extend = [header];
	extend.push.apply(extend, data);
	var point = {'table': extend};
	this.postData(obj.streamName, point, null, callback);
    }

    this.pushHtml = function(obj, callback) { 
	var html = obj.html;
	var point = {'html': html};
	this.postData(obj.streamName, point, null, callback);
    }


    this.sendClear = function(streamName, callback) {
	this.postData(streamName, null, 'clear', callback);
    }
    

    this.postData = function(streamName, point, command, callback) {
        var obj = {'streamName': streamName,
		   'accessKey': api_key};

	if (point) {
	    obj.point = point;
	}
	else if (command) {
	    obj.command = command;
	}


	var json = JSON.stringify(obj);
	var post_options = {
	    host: 'www.leftronic.com',
	    path: '/customSend',
	    method: 'POST',
	    headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': json.length
	    }
	}
	
	var post_req = https.request(post_options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			if (callback) {
			    return callback(null, chunk);
			}
		});

	});
	post_req.on('error', function(e) {
		if (callback) {
		    return callback(e);
		}
	});
	post_req.write(json);
	post_req.end();
    }
}

exports.createClient = function(api_key) {
    var leftronic;
    leftronic = new LeftronicClient(api_key);
    
    return leftronic;
}

