require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require('axios');
var moment = require('moment')

var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var searchTerm = process.argv[3];

switch (command) {
    case 'spotify-this-song':
        getSpotifyData(searchTerm);
        break;
    case 'concert-this':
        getConcertData(searchTerm);
        break;
    case 'movie-this':
        getMovie(searchTerm);
        break;
    case 'do-what-it-says':
        break;
}


function getMovie(movie) {
    axios.get("http://www.omdbapi.com/?t=" + movie + "&apiKey=trilogy"
    )
        .then(function (response) {
            console.log();
            var title = response.data.Title;
            var year = response.data.Year;
            var imdb = response.data.imdbRating;
            // var rotTom = response.data
            var country = response.data.Country;
            var language = response.data.Language;
            var plot = response.data.Plot;
            var actors = response.data.Actors;
            //
            var info = {
                title: {
                    text: title,
                    label: 'Title: '
                },
                year: {
                    text: year,
                    label: 'Release Year : '
                },
                imdb: {
                    text: imdb,
                    label: 'IMDB Rating: '
                },
                country: {
                    text: country,
                    label: 'Country: ',
                },
                language: {
                    text: language,
                    label: 'Language : ',
                },
                plot: {
                    text: plot,
                    label: 'Plot: ',
                },
                actors: {
                    text: actors,
                    label: 'Actors: ',
                }
            };
            updateUI(info);
        })
        .catch(function (error) {
            console.log(error);
        });

}



function getConcertData(artist) {
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    )
        .then(function (response) {
            var venueName = response.data[0].venue.name;
            var venueLocation = response.data[0].venue.region;
            var date = response.data[0].datetime;
            var formattedDate = moment(date).format('MM/DD/YYYY');

            var info = {
                venueName: {
                    text: venueName,
                    label: 'Venue: '
                },
                venueLocation: {
                    text: venueLocation,
                    label: 'Venue Location: '
                },
                date: {
                    text: formattedDate,
                    label: 'Date: ',
                }
            };
            updateUI(info);
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
                text: albumName,
                label: 'Album Name: '
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
