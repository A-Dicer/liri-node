var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

// console.log(keys.spotifyKeys.id);

//------------------------------- Twitter -----------------------------------------

// var client = new Twitter({
//   consumer_key: keys.twitterKeys.consumer_key,
//   consumer_secret: keys.twitterKeys.consumer_secret,
//   access_token_key: keys.twitterKeys.access_token_key,
//   access_token_secret: keys.twitterKeys.access_token_secret,
// });
 
// var params = {screen_name: 'AndrewDicer'};
// client.get('statuses/user_timeline', params, function(error, tweets, response) {
//   if (!error) {
//   	console.log("");
//   	console.log("Twitter");
//   	console.log("-------------------");

//   	for (var i = 0; i < tweets.length && i < 20; i++){
//   		var text = tweets[i].text;
//   		var created = tweets[i].created_at;
//     	console.log(created);
//     	console.log(text);
//     	console.log("-------------------");
// 	}
// 	console.log("");
//   }
//   else {console.log(error)};
// });

//------------------------------- Spotify -----------------------------------------

	var spotify = new Spotify({
	  id: keys.spotifyKeys.id,
	  secret: keys.spotifyKeys.secret,
	});

	console.log("Spotify");

	spotify.search({ type: 'track', query: 'the sign',}, function(err, data) {
  		if (err) {
    		return console.log('Error occurred: ' + err);
  		}
  	var info = data.tracks.items;

 	for (var i = 0; i < info.length; i++){
 	console.log("-----------");
	console.log(info[i].name);
	console.log(info[i].artists[0].name)
	} 
	});

//------------------------------- imbd ---------------------------------------------

