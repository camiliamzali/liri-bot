require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require('node-spotify-api')
const inquirer = require("inquirer");
const axios = require("axios");
const moment = require('moment');
const spotify = new Spotify(keys.spotify);

// Concert function that will output the user's band tour dates, cities, countries and venues
const concertThis = () => {
  inquirer.prompt({
    type: "input",
    message: "Looking for concerts for a band you like? What's the name of the artist?",
    name: "artist"
  }).then(function (res) {
    axios.get("https://rest.bandsintown.com/artists/" + res.artist + "/events?app_id=codingbootcamp")
      .then(function (res) {
        let data = res.data;
        console.log(`Here's a list of concerts and their locations:`)

        for (let i = 0; i < data.length; i++) {
          let date = moment(data[i].datetime).format('MMM Do, YYYY [at] hh:mmA')
          console.log(`
========================

${data[i].venue.name} in ${data[i].venue.city}, ${data[i].venue.country}. Date: ${date}
`)
        }
      })
  })
}

const movieThis = () => {
  inquirer.prompt({
    type: "input",
    message: "What movie are you looking for?",
    name: "movie"
  }).then(function (res) {
    axios.get(`http://www.omdbapi.com/?s=${res.movie}&apikey=trilogy`)
      .then(function (res) {
        console.log(res.data);
      })
  })
}

inquirer.prompt([{
  type: "list",
  message: "Select a command to use.",
  choices: ["concert-this", "spotify-this-song", "movie-this", "do-this-thing"],
  name: "command"
}]).then(function (res) {
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