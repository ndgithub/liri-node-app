require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require('axios');
var moment = require('moment')
var fs = require('fs');

var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var searchTerm = process.argv[3];

makeRequest(command, searchTerm);

function makeRequest(request, query) {
  switch (request) {
    case 'spotify-this-song':
      getSpotifyData(query);
      break;
    case 'concert-this':
      getConcertData(query);
      break;
    case 'movie-this':
      getMovie(query);
      break;
    case 'do-what-it-says':
      doWhatItSays();
      break;
  }
}

function doWhatItSays() {
  fs.readFile('random.txt', 'utf8', function (err, data) {
    if (err) { console.log(err) };
    var data = data.split(',');
    makeRequest(data[0], data[1])
  });
}

function getMovie(movie) {
  axios.get("http://www.omdbapi.com/?t=" + movie + "&apiKey=trilogy"
  )
    .then(function (response) {

      var info = {
        title: {
          text: response.data.Title,
          label: 'Title: '
        },
        year: {
          text: response.data.Year,
          label: 'Release Year : '
        },
        imdb: {
          text: response.data.imdbRating,
          label: 'IMDB Rating: '
        },
        country: {
          text: response.data.Country,
          label: 'Country: ',
        },
        language: {
          text: response.data.Language,
          label: 'Language : ',
        },
        plot: {
          text: response.data.Plot,
          label: 'Plot: ',
        },
        actors: {
          text: response.data.Actors,
          label: 'Actors: ',
        }
      };
      updateUI(info);
      updateLog(info);
    })
    .catch(function (error) {
      console.log(error);
    });

}

function getConcertData(artist) {
  axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
  )
    .then(function (response) {
      var date = response.data[0].datetime;
      var formattedDate = moment(date).format('MM/DD/YYYY');

      var info = {
        venueName: {
          text: response.data[0].venue.name,
          label: 'Venue: '
        },
        venueLocation: {
          text: response.data[0].venue.region,
          label: 'Venue Location: '
        },
        date: {
          text: formattedDate,
          label: 'Date: ',
        }
      };
      updateUI(info);
      updateLog(info);
    })
    .catch(function (error) {
      console.log('error');
    });

}

function getSpotifyData(searchTerm) {
  var info = {};
  spotify.search({ type: 'track', query: searchTerm, limit: 1 }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    info = {
      artistName: {
        text: data.tracks.items[0].album.artists[0].name,
        label: 'Artist Name: '
      },
      songTitle: {
        text: data.tracks.items[0].name,
        label: 'Song Title: '
      },
      previewLink: {
        text: data.tracks.items[0].external_urls.spotify,
        label: 'Preview: '
      },
      albumName: {
        text: data.tracks.items[0].album.name,
        label: 'Album Name: '
      },
    };
    updateUI(info);
    updateLog(info);
  });
}

function updateUI(infoObject) {
  for (var key in infoObject) {
    console.log(infoObject[key].label + infoObject[key].text);
  }
}

function updateLog(infoObject) {
  fs.appendFile('log.txt', '\n', function (err) {
    if (err) {
      console.log('there was a problem adding a new line to log.txt');
    }
  })
  for (var key in infoObject) {
    fs.appendFile('log.txt', infoObject[key].label + infoObject[key].text + '\n', function (error) {
      if (error) { console.log('There was a problem logging the data') };
    });
  }
}