require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var selection = process.argv[3];

switch (command) {
  case 'spotify-this-song':
    searchSpotify(selection);
    break;
  case 'concert-this':
    break;
  case 'movie-this':
    break;
  case 'do-what-it-says':
    break;
}


function searchSpotify(searchTerm) {
  spotify.search({ type: 'track', query: searchTerm, limit: 1 }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    var artistName = data.tracks.items[0].album.artists[0].name;
    var songTitle = data.tracks.items[0].name;
    var previewLink = data.tracks.items[0].external_urls.spotify;
    var albumName = data.tracks.items[0].album.name;
    console.log(artistName);
    console.log(songTitle);
    console.log(previewLink);
    console.log(albumName);
  });

}
