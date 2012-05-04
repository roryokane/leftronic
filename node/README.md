### Node.js Leftronic Package documentation

Instantiate the Leftronic client as follows:

```javascript
var Leftronic = require('leftronic').createClient('my_api_key');
```

Then use the various push... functions as follows:

```javascript
Leftronic.pushNumber({streamName: 'numberStream', 
		      number: 35,
		      suffix: '%'},
		      function(err, result) {
		          if (err) console.log(err);
			  console.log(result);
			  });
```

More docs coming soon.