require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Our routes go here:

app.get('/', (req, res) => {
  res.render('index');
});

app.get("/artist-search", (req,res)=>{
  spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
      console.log('The received data from the API: ', data.body.artists.items);
      res.render("artist-search-results",{artistsListArr: data.body.artists.items})
  })
  .catch(err => console.log('Error while getting the artists: ', err));
})

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then((data) => {
      console.log('albums', data.body.items);
      res.render("albums", {albumsArr: data.body.items})
  })
  .catch(err => console.log('The error while searching albums occurred: ', err));
})

app.get('/album-tracks/:albumId', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then((data) => {
      console.log('album-tracks', data.body);
      res.render("album-tracks", {albumsTracksArr: data.body.items})
  })
  .catch(err => console.log('The error while searching albums occurred: ', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
