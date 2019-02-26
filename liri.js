require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var searchTerm = process.argv[3];

switch (command) {
  case 'spotify-this-song':
    getSpotifyData(searchTerm);
    break;
  case 'concert-this':
    break;
  case 'movie-this':
    break;
  case 'do-what-it-says':
    break;
}

function getSpotifyData(searchTerm) {
  var info = {};
  spotify.search({ type: 'track', query: searchTerm, limit: 1 }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    var artistName = data.tracks.items[0].album.artists[0].name;
    var songTitle = data.tracks.items[0].name;
    var previewLink = data.tracks.items[0].external_urls.spotify;
    var albumName = data.tracks.items[0].album.name;
    info = {
      artistName: {
        text: artistName,
        label: 'Artist Name: '
      },
      songTitle: {
        text: songTitle,
        label: 'Song Title: '
      },
      previewLink: {
        text: previewLink,
        label: 'Preview: '
      },
      albumName: {
        text: albumName, label: 'Album Name: '
      },
    };
    updateUI(info);
  });

}

function updateUI(infoObject) {
  for (var key in infoObject) {
    console.log(infoObject[key].label + infoObject[key].text);
  }
}