
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs");
var inquirer = require("inquirer");


//------------------------------- Twitter -----------------------------------------
function myTweets(name){
	var client = new Twitter(keys.twitterKeys);
	 
	var params = {screen_name: name};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	  	console.log("");
	  	console.log("Twitter Search: " + name);
	  	console.log("-------------------");

	  	for (var i = 0; i < tweets.length && i < 20; i++){
	  		var text = tweets[i].text;
	  		var created = tweets[i].created_at;
	    	console.log(created);
	    	console.log(text);
	    	console.log("-------------------");
		}
		console.log("-----------------------------------------------");
		console.log("");
		append(", The Twitter Account " + name + " was searched.")
		restart();
	  }
	  else {console.log(error)};
	});
}

//------------------------------- Spotify -----------------------------------------
function spotifyThisSong(song){
	var spotify = new Spotify(keys.spotifyKeys);
	
	console.log("");
	console.log("Spotify Search: " + song);
	console.log("-------------------");
	
	spotify.search({ type: 'track', query: song, limit: 5}, function(err, data) {
  		if (err) {
    		return console.log('Error occurred: ' + err);
  		}
  		var info = data.tracks.items;
	 	for (var i = 0; i < info.length; i++){
		 	console.log("-----------");
			console.log(info[i].name);
			console.log(info[i].artists[0].name);
			console.log(info[i].preview_url);
			console.log(info[i].album.name);
		}
		console.log("-----------------------------------------------");
		console.log("");
		append(", The Song " + song + " was searched.")
		restart();
	});
}

//------------------------------- imdb ---------------------------------------------
function movieThis(movie){
	console.log("");
	console.log("IMDB Search: " + movie);
	console.log("-------------------");
	
	var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + keys.imdbKeys.key;

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
		console.log("-----------------------------------------------");
		console.log("");
		append(", The Movie " + movie + " was searched.")
		restart();
	});
}

//------------------------------- fs -----------------------------------------------
function doWhatItSays(){
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
	    return console.log(error);
	  }
	  var dataArr = data.split(",");
	  var song = dataArr[1];
	  spotifyThisSong(song);
	});
}

//------------------------------- append --------------------------------------------
function append(info){
	fs.appendFile("log.txt", info, function(err) {
	    if (err) {
	    	return console.log(err);
	    }
	 });
}

//------------------------------- restart -------------------------------------------
function restart(){
	inquirer
	  	.prompt([
		    {
			    type: "confirm",
			    message: "Would you like to start over?",
			    name: "confirm",
			    default: true
		    }
		])
		.then(function(response) {
		    if (response.confirm) { inquire()}
		    else { console.log("See you next time!")}
	  	});
}

//------------------------------- inquirer -----------------------------------------
function inquire(){
	inquirer
	  	.prompt([
		    {
		      	type: "list",
		      	message: "What would you like to do?",
		      	choices: ["My Tweets", "Spotify This Song", "Movie This", "Do What It Says", "What Has Been Searched"],
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
		  		.then(function(response) {
		  			var info = response.userName.trim();
		  			if(info !=""){
			  			myTweets(info);
			  		} else { myTweets("AndrewDicer")}
		  		})
		  	}

		  	else if(response.option1 === "Spotify This Song"){
		  	  inquirer
		  		.prompt([
		  			{
				        type: "input",
				    	message: "Enter A Song Title: ",
				   	    name: "song"
		  			},
		  		])
		  		.then(function(response) {
		  			var info = response.song.trim();
		  			if(info !=""){
			  			spotifyThisSong(info);
			  		} else { 
			  			var song = "track:'The Sign' artist:'Ace of Base'";
			  			spotifyThisSong(song);
			  		}
		  		})
		  	}

		  	else if(response.option1 === "Movie This"){
		  	  inquirer
		  		.prompt([
		  			{
				        type: "input",
				    	message: "Enter A Movie Title: ",
				   	    name: "movie"
		  			},
		  		])
		  		.then(function(response) {
		  			var info = response.movie.trim();
		  			if(info !=""){
			  			movieThis(info);
			  		} else { movieThis("Tron")}
		  		})
		  	}

		  	else if(response.option1 === "Do What It Says"){ doWhatItSays()}

		  	else if(response.option1 === "What Has Been Searched"){
		  	  	fs.readFile("log.txt", "utf8", function(error, data) {
					if (error) {
		    			return console.log(error);
		  			} else {
					 
					 	var dataArr = data.split(",");
					 	for(var i = 1; i < dataArr.length; i++){
					 		console.log(i + ": " +dataArr[i]);
					 	}
					restart();
		  			}
				})	  
		  	}	
		 });
}

inquire();