require('dotenv').config();
const fs = require('fs')
const keys = require('./keys.js');
const Spotify = require('node-spotify-api')
const inquirer = require('inquirer');
const axios = require('axios');
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
        console.log(data.length);

        data.forEach(concert => {
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

const movieThis = () => {
  inquirer.prompt({
    type: "input",
    message: "What movie are you looking for?",
    name: "movie",
    default: "Mr. Nobody"
  }).then(function (res) {

    axios.get(`http://www.omdbapi.com/?t=${res.movie}&apikey=trilogy`)
      .then(function (res) {
        let data = res.data;
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

const doThing = () => {
  
}

const spotifyThis = () => {
  inquirer.prompt({
    type: "input",
    message: "What song would you like to look up?",
    name: "song",
    default: "The Sign"
  }).then(function (res) {
    spotify.search({
      type: 'track',
      query: res.song
    }).then(function (res) {
      let data = res.tracks.items;
      console.log(data)
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