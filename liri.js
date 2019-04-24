// import all packages and files
require('dotenv').config();
const fs = require('fs')
const keys = require('./keys.js');
const Spotify = require('node-spotify-api')
const inquirer = require('inquirer');
const axios = require('axios');
const moment = require('moment');
const spotify = new Spotify(keys.spotify);
//initial prompt to the user to choose a command
inquirer.prompt([{
  type: "list",
  message: "Select a command to use.",
  choices: ["concert-this", "spotify-this-song", "movie-this", "do-this-thing"],
  name: "command"
}]).then(function (res) {
  //depending on user's choice, run respective function
  switch (res.command) {
    case "concert-this":
      concertThis();
      break;

    case "spotify-this-song":
      spotifyThis();
      break;

    case "movie-this":
      movieThis();
      break;

    case "do-this-thing":
      doThing();
      break;

    default:
      "Please pick a valid command";
      break;
  }
})
// Concert function that will output the user's band tour dates, cities, countries and venues
const concertThis = () => {
  // ask for user to input a band or artist
  inquirer.prompt({
    type: "input",
    message: "Looking for concerts for a band you like? What's the name of the artist?",
    name: "artist"
  }).then(function (res) {
    // get info from bandsintown api
    axios.get("https://rest.bandsintown.com/artists/" + res.artist + "/events?app_id=codingbootcamp")
      .then(function (res) {
        let data = res.data;
        console.log(`Here's a list of concerts and their locations:`)
        console.log(data.length);
        // loop through array to get proper info to display
        data.forEach(concert => {
          // convert api's given datetime to something easier to read
          let date = moment(concert.datetime).format('MMM Do, YYYY [at] hh:mmA')
          return console.log(`
========================

${concert.venue.name} in ${concert.venue.city}, ${concert.venue.country}. Date: ${date}
`)
        })

      })
      .catch(function (err) {
        console.log(err);
      });
  })
}
// Movie function that will output movie details for user's given movie. Defaults to Mr. Nobody is no response is given.
const movieThis = () => {
  //Ask user for input
  inquirer.prompt({
    type: "input",
    message: "What movie are you looking for?",
    name: "movie",
    // if no input is given, search Mr. Nobody
    default: "Mr. Nobody"
  }).then(function (res) {
    // get info from omdb api for specified movie
    axios.get(`http://www.omdbapi.com/?t=${res.movie}&apikey=trilogy`)
      .then(function (res) {
        let data = res.data;
        // output data
        return console.log(`
Title: ${data.Title}

Year Released: ${data.Year}

IMDB Rating: ${data.imdbRating}

${data.Ratings[1].Source}: ${data.Ratings[1].Value}

Country: ${data.Country}

Available Languages: ${data.Language}

Plot: ${data.Plot}

Actors: ${data.Actors}
          `)
      })
      .catch(function (err) {
        console.log(err);
      });
  })
}
// Function that reads random.txt and lists songs with query inside of it. Same info as concertThis function
const doThing = () => {
  // read fiile
  fs.readFile('random.txt', 'utf8', function (error, data) {
    if (error) {
      return console.log(error);
    }
    // turn file into array, splitting by the comma
    let song = data.split(',');
    // use spotify's search method to input the song in the random.txt 
    spotify.search({
      type: 'track',
      query: song[1]
    }).then(function (res) {
      // output data to user
      let data = res.tracks.items;
      data.forEach(songs => {
        return console.log(`
      Artist(s): ${songs.artists[0].name}
      Song Name: ${songs.name}
      Preview URL: ${songs.preview_url}
      Album: ${songs.album.name}

              `);
      })
    })
  })
}
// Function that gives user list of songs by given song name. Data about artist, album, song, and url to spotify is given.
const spotifyThis = () => {
  // prompt user for input
  inquirer.prompt({
    type: "input",
    message: "What song would you like to look up?",
    name: "song",
    // default song is The Sign if user gives no input
    default: "The Sign"
  }).then(function (res) {
    //use spotify's search method to output list of songs, artists, album and spotify url
    spotify.search({
      type: 'track',
      query: res.song
    }).then(function (res) {
      let data = res.tracks.items;
      data.forEach(songs => {
        return console.log(`
Artist(s): ${songs.artists[0].name}
Song Name: ${songs.name}
Preview URL: ${songs.preview_url}
Album: ${songs.album.name}
        
        `);
      })
    })
  })
}