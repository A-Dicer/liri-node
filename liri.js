
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs");
var inquirer = require("inquirer");


//------------------------------- Twitter -----------------------------------------
//function for twitter search.  name = the twitter user being searched
function myTweets(name){
	//get the twitter keys from the keys.js
	var client = new Twitter(keys.twitterKeys);
	//set the parameters for the twitter search
	var params = {screen_name: name};
	//start the twitter search
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		//if there is no error while searching
		if (!error) {
		  	console.log("");
		  	console.log("Twitter Search: " + name);
		  	console.log("-------------------");
		  	//run a loop getting the info for the last 20 tweets
		  	for (var i = 0; i < tweets.length && i < 20; i++){
		  		var text = tweets[i].text;
		  		var created = tweets[i].created_at;
		    	console.log(created);
		    	console.log(text);
		    	console.log("-------------------");
			}
			console.log("-----------------------------------------------");
			console.log("");
			//append log.txt 
			append(", The Twitter Account " + name + " was searched.")
			//give option to restart or quit
			restart();
		}
		// else log the error
		else {console.log(error)};
	});
}

//------------------------------- Spotify -----------------------------------------
//function for spotify search.  song = the song title being searched
function spotifyThisSong(song){
	//get the spotify keys from the keys.js
	var spotify = new Spotify(keys.spotifyKeys);
	console.log("");
	console.log("Spotify Search: " + song);
	console.log("-------------------");
	//start the spotify search
	spotify.search({ type: 'track', query: song, limit: 5}, function(err, data) {
  		//if there is an error console log it
  		if (err) {
    		return console.log('Error occurred: ' + err);
  		}
  		//run a loop getting info for 5 results
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
		//append log.txt 
		append(", The Song " + song + " was searched.")
		//give option to restart or quit
		restart();
	});
}

//------------------------------- imdb ---------------------------------------------
//function for imdb search.  movie = the movie title being searched
function movieThis(movie){
	console.log("");
	console.log("IMDB Search: " + movie);
	console.log("-------------------");
	//create a variable to hold search url for imdb
	var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + keys.imdbKeys.key;
	//start the imdb search
	request(queryUrl, function(error, response, body) {
		//if there is no error and the search is found place console log info
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
		//append log.txt
		append(", The Movie " + movie + " was searched.");
		//give option to restart or quit
		restart();
	});
}

//------------------------------- fs -----------------------------------------------
//function to read the random.txt file 
function doWhatItSays(){
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
	    return console.log(error);
	  }
	  //take the string and split it into an array at every ","
	  var dataArr = data.split(",");
	  //grabs the song title from the array that was made
	  var song = dataArr[1];
	  //runs spotify function passing the the song title into it
	  spotifyThisSong(song);
	});
}

//------------------------------- append --------------------------------------------
//function for appending log.txt. info = the text being added to the file
function append(info){
	fs.appendFile("log.txt", info, function(err) {
	    if (err) {
	    	return console.log(err);
	    }
	 });
}

//------------------------------- restart -------------------------------------------
//function to restart the inquirer
function restart(){
	inquirer.prompt([
	    {
		    type: "confirm",
		    message: "Would you like to start over?",
		    name: "confirm",
		    default: true
	    }
	])
	.then(function(response) {
		//if they say yes run inquire function
	    if (response.confirm) {inquire()}
	    //if they say no say bye
	    else { 
	    	console.log("");
	    	console.log("");
	    	console.log("See you next time!")
	    	console.log("");
	    	console.log("");
	    }
  	});
}

//------------------------------- next question ------------------------------------
//function for running a second inquirer. 
//question = the question being asked.
//method = the function to run.
//defaultInfo = the default search if no search parameters are given by user.
function nextQuestion(question, method, defaultInfo){
	inquirer.prompt([
		{
	        type: "input",
	    	message: question,
	   	    name: "info"
		},
	])
	.then(function(response) {
		var info = response.info.trim();
		//if info is not blank
		if(info !=""){method(info)} 
		//else do search with default info
		else {method(defaultInfo)}
	})
}

//------------------------------- searched -----------------------------------------
//function for searching log.txt
function searched(){
	fs.readFile("log.txt", "utf8", function(error, data) {
		//if there is an error console log it
		if (error) {return console.log(error)}
		//else split the data string into an array.
		else { 
		 	var dataArr = data.split(",");
		 	//run a loop getting the searches from the array
		 	for(var i = 1; i < dataArr.length; i++){
		 		console.log(i + ": " +dataArr[i]);
		 	}
		//give option to restart or quit
		restart();
		}
	})
}

//------------------------------- inquirer -----------------------------------------
//function for inquirer 
function inquire(){
	//askes the first question
	inquirer.prompt([
	    {
	      	type: "list",
	      	message: "What would you like to do?",
	      	choices: ["My Tweets", "Spotify This Song", "Movie This", "Do What It Says", "What Has Been Searched"],
	      	name: "option1"
	    },
	])
	.then(function(response) {
		//runs nextQuestion functin and passes in information based on what was chosen
	  	if(response.option1 === "My Tweets"){ 
	  		nextQuestion("Enter Twitter User Name: ", myTweets, "AndrewDicer");
	  	} else if(response.option1 === "Spotify This Song") { 
	  		nextQuestion("Enter A Song Title: ", spotifyThisSong, "track:'The Sign' artist:'Ace of Base'");
	  	} else if(response.option1 === "Movie This"){
	  	   	nextQuestion("Enter A Movie Title: ", movieThis, "Tron");
	  	} else if(response.option1 === "Do What It Says"){ 
	  		doWhatItSays();
	  	} else if(response.option1 === "What Has Been Searched"){ 
	  		searched(); 		  
	  	}	
	});
}

//run inquire function
inquire();