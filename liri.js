
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs");
var inquirer = require("inquirer");


//------------------------------- Twitter -----------------------------------------
function myTweets(name){
	var client = new Twitter({
	  consumer_key: keys.twitterKeys.consumer_key,
	  consumer_secret: keys.twitterKeys.consumer_secret,
	  access_token_key: keys.twitterKeys.access_token_key,
	  access_token_secret: keys.twitterKeys.access_token_secret,
	});
	 
	var params = {screen_name: name};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	  	console.log("");
	  	console.log("Twitter");
	  	console.log("-------------------");

	  	for (var i = 0; i < tweets.length && i < 20; i++){
	  		var text = tweets[i].text;
	  		var created = tweets[i].created_at;
	    	console.log(created);
	    	console.log(text);
	    	console.log("-------------------");
		}
		console.log("");
	  }
	  else {console.log(error)};
	});
}

//------------------------------- Spotify -----------------------------------------
function spotifyThisSong(song){
	var spotify = new Spotify({
	  id: keys.spotifyKeys.id,
	  secret: keys.spotifyKeys.secret,
	});
	console.log("");
	console.log("Spotify");
	console.log("-------------------");
	spotify.search({ type: 'track', query: song}, function(err, data) {
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
}

//------------------------------- imdb ---------------------------------------------
function movieThis(){
	console.log("");
	console.log("IMDB");
	console.log("-------------------");
	
	var queryUrl = "http://www.omdbapi.com/?t=Tron&y=&plot=short&apikey=" + keys.imdbKeys.key;

	request(queryUrl, function(error, response, body) {
	  	if (!error && response.statusCode === 200) {
	  		console.log("Title: " + JSON.parse(body).Title);
	   		console.log("Release Year: " + JSON.parse(body).Year);
	   		console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
	   		console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
	   		console.log("Country: " + JSON.parse(body).Country);
	   		console.log("Language: " + JSON.parse(body).Language);
	   		console.log("Plot: " + JSON.parse(body).Plot);
	   		console.log("Actors: " + JSON.parse(body).Actors);
	  	}
	});
}

//------------------------------- fs -----------------------------------------------
function doWhatItSays(){
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
	    return console.log(error);
	  }
	  console.log(data);
	  var dataArr = data.split(",");
	  var song = dataArr[1];
	  spotifyThisSong(song);
	});
}

//------------------------------- inquirer -----------------------------------------
inquirer
  .prompt([
    {
      type: "list",
      message: "What would you like to do?",
      choices: ["My Tweets", "Spotify This Song", "Movie This", "Do What It Says"],
      name: "option1"
    },
  ])
  .then(function(response) {
  	if(response.option1 === "My Tweets"){
  	  inquirer
  		.prompt([
  			{
		      type: "input",
		      message: "Enter Twitter User Name: ",
		      name: "userName"
  			},
  		])
  		.then(function(response2) {
  			if(response2 !="")
	  		myTweets(response2.userName);
  		})
  	}	
  });
