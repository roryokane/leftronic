var https = require('https'); 

function LeftronicClient(api_key) {
    this.apiUrl = 'https://www.leftronic.com/customSend';
    this.pushNumber = function(streamName, number) {
	this.postData({'accessKey': api_key,
		       'streamName': streamName,
		       'point': {'number': number} });
    }
    
    this.pushText = function() {

    }


    this.postData = function(obj) {
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
			console.log('Response: ' + chunk);
		});

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

