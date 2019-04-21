// EZCH Project

// A Dictionary project for chinese-english translation specifically designed
// for bulk text or book translation.
// EZCH name itself derives from 'easy' used as 'ez' (Check the urban dictionary
// ) and 'CH' as 'Chinese' combined together.

// EZCH-SERVER Written in Node.JS

// This server was originally written in python, flask, but then I got
// frustrating errors on the production environment so I decided that it maybe
// a great idea to rewrite the server in node.js, in python version there is no
// SSL handling.

// For Turkish people:
// Türkçe açıklama
// Bu sunucu ezch projem için python ile yazdığım ama sonrasında
// bir sürü hata aldığım için nodejs ile tekrardan yazmanın iyi bir fikir
// olduğunu düşündüğüm ezch-server'ının node.js hali. Ne yazık ki açıklamaları
// sadece ingilizce hazırladım çünkü iki ayrı dilde hazırlamak gerçekten
// uğraştırıcı ve burası global bir platform.



// Load required modules.
const http = require("http")
	, domain = "duohub.ga"
	, https = require("https")
	, express = require("express")
	, app = express(http)
	, fs = require("fs")
	, jieba = require("nodejieba")
	, cors = require('cors')
	, os = require("os")
	, bodyParser = require('body-parser')
	// Only allow from these domains.
	, corsOptions = {
  		origin: ["https://guvendegirmenci.ga", "https://duoquote.github.io"]
	};


// Load dictionaries (In sync because if not read before, the program will not
// be abled to proceed to gather data.)
var hanzilist = JSON.parse(fs.readFileSync("hanzi.json"));
var wordlist = JSON.parse(fs.readFileSync("words1.json"));

// These lines for local debugging purposes, as I do not have ssl certs set up
// locally that means, it will check whether running in production environment
// or debug. I currently use pop-os so it detects whether the system is pop-os
// or else it will deploy https server too.

var platform = "server";
if (os.hostname() == "pop-os") {
	platform = "desktop";
}

// Enable cors using corsOptions.
app.use(cors(corsOptions))

// Add JSON request handling to easily process the requested data.
app.use(bodyParser.json());

// Add JSON error checking because, if the request headers was set to
// application/json but the request data is not proper, the program would
// throw an error and would not return a proper response.
app.use(function(err, req, res, next){
	// Check if there is an actually error.
	if (err) {
		// Check if the error is JSON validation error (May not be correct but
		// should not cause any trouble.).
		if (err.type == "entity.parse.failed") {
			res.send(JSON.stringify({"status": "JSON format is not valid."}));
		} else {
			next();
		}
	} else {
		next();
	}
});

// Handle post requests on /text.
app.post("/text", (req, res)=> {
	// Check whether request type is in JSON format.
	if (req.headers["content-type"].indexOf("application/json") != -1) {
		// Check whether request data contains "text" key in request.
		if ("text" in req.body) {
			var data = req.body["text"];

			// Segmentation of words using jieba or in that case nodejieba module,
			// which is originally written in python.
			var words = jieba.cut(data);

			// Create a main dict for results.
			var result = {};

			// The words will be stored in this section and everything actually runs
			// on this. Everything is word oriented.
			result["words"] = [];

			// Will use that value later, line dictionary provides this data and was
			// not too hard to add here so I added.
			result["recog"] = "";

			// For each word in segmentation, process...
			for (var i = 0; i < words.length; i++){

				// Add current word to the result["recog"].
				result["recog"] += words[i];

				// Create a temporary location for words.
				var temp = {};

				// Set value to the actual word.
				temp["word"] = words[i];

				// Set an empty array for hanzis.
				temp["hanzis"] = [];

				// Check whether the word is in our dictionary.
				if (words[i] in wordlist) {
					temp["defs"] = wordlist[words[i]]["definitions"];
					temp["pinyin"] = wordlist[words[i]]["pinyin"];

				} else {
					temp["defs"] = false;
					temp["pinyin"] = false;
				}
				// Process each hanzis in the word.
				for (var x = 0; x < words[i].length; x++) {
					// I created the dataset for hanzis as the keys will be UTF-16 index
					// in integer format so get the UTF-16 index for the hanzi, turn it
					// into string and check whether the value is in the dictionary.
					var hanzichar = words[i][x].charCodeAt().toString();

					// An empty dictionary for the current hanzi's values.
					var hanziTemp = {};

					// Check whether the hanzi in the hanzi dictionary.
					if (hanzichar in hanzilist) {
						// Set the values accordingly.
						hanziTemp["hanzi"] = words[i][x];
						hanziTemp["def"] = hanzilist[hanzichar]["kDefinition"];
						hanziTemp["pinyin"] = hanzilist[hanzichar]["kMandarin"];
					} else {
						// Only set the hanzi if hanzi is not in the dictionary because
						// the client will display the hanzi according to this value.
						hanziTemp["hanzi"] = words[i][x];
						hanziTemp["def"] = false;
						hanziTemp["pinyin"] = false;
					}
					// Add the hanzi dictionary to the current word's hanzi array.
					temp["hanzis"].push(hanziTemp);
				}
				// Add the completed word to the result's word array.
				result["words"].push(temp);
			}
			// Send the gathered data.
			res.send(JSON.stringify({"status": "OK", result}))
		} else {
			res.send(JSON.stringify({"status": "Request does not contain 'text' key in dictionary."}))
		}
	} else {
		res.send(JSON.stringify({"status": "Request is not in json format."}));
	}
});

// Create http app with "app".
const httpServer = http.createServer(app);

// Listen http server on port 3000.
httpServer.listen(3000, ()=>{console.log("Listening http on *:3000")});

if (platform == "server") {
	// If the platform is server, production environment, set certificate
	// locations.
	const privateKey = fs.readFileSync('/etc/letsencrypt/live/'+domain+'/privkey.pem', 'utf8')
	, certificate = fs.readFileSync('/etc/letsencrypt/live/'+domain+'/fullchain.pem', 'utf8')
	, ca = fs.readFileSync('/etc/letsencrypt/live/'+domain+'/chain.pem', 'utf8')
	, credentials = {
		key: privateKey,
		cert: certificate,
		ca: ca
	};

	// Create https app for the production environment.
	const httpsServer = https.createServer(credentials, app);

	// Listen https server on port 3333.
	httpsServer.listen(3333, ()=>{console.log("Listening https on *:3333")});

	// I do not know whether it will be used or not but if necessary, this line
	// makes the httpsServer available outside of this scope.
	global.httpsServer = httpsServer;
};
