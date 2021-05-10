const qs = require('qs');
const express = require('express')
const router = express.Router()
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;


router.post('/callback/', async (req, res) => {
    const code = req.body.code;

    const headers = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
            username: clientId,
            password: client_secret,
        },
    };

    const data = {
        code: code,
        redirect_uri: 'http://localhost:3000/callback/',
        grant_type: 'authorization_code'
    };

    const response = await axios.post('https://accounts.spotify.com/api/token', qs.stringify(data), headers);
    const access_token = await response.data.access_token

    const userHeaders = {
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    }
    const user = await axios.get(`https://api.spotify.com/v1/me`, userHeaders)
    const user_id = await user.data.id


    if (req.body.tracksId.length > 100) {
        const CreatePlaylist = {
            method: 'POST',
            url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: { name: 'Mixify Playlist' }
        };

        const playlist = await axios.request(CreatePlaylist)
        const playlist_id = await playlist.data.id
        let tracks = req.body.tracksId
        let tracks2 = tracks.splice(100)

        const appendTracksToPlaylist = {
            method: 'POST',
            url: `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + access_token
            },
            data: { uris: tracks }
        };

        const appendTracks2ToPlaylist = {
            method: 'POST',
            url: `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + access_token
            },
            data: { uris: tracks2 }
        };

        const response = await axios.request(appendTracksToPlaylist)
        const response2 = await axios.request(appendTracks2ToPlaylist)
    } else {
        const CreatePlaylist = {
            method: 'POST',
            url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: { name: 'Mixify Playlist' }
        };

        const playlist = await axios.request(CreatePlaylist)
        const playlist_id = await playlist.data.id
        const tracks = req.body.tracksId

        const appendTracksToPlaylist = {
            method: 'POST',
            url: `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + access_token
            },
            data: { uris: tracks }
        };

        const response = await axios.request(appendTracksToPlaylist)
    }
    res.send("done")
})

router.get('/token', async (req, res) => {
    const headers = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
            username: clientId,
            password: client_secret,
        },
    };

    const data = {
        grant_type: 'client_credentials',
    };
    const response = await axios.post('https://accounts.spotify.com/api/token', qs.stringify(data), headers);
    res.send(response.data.access_token)
})

router.get('/search/:track/:token', async (req, res) => {
    const track = req.params.track.replace(/\s/g, '%20')
    const token = req.params.token
    const headers = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
    const tracks = await axios.get(`https://api.spotify.com/v1/search?q=${track}&type=track&limit=12`, headers)
    res.send(tracks.data.tracks.items)
})

router.get('/recommendations/:artistsId/:tracksId/:playlistSize/:token', async (req, res) => {
    const artistsId = req.params.artistsId.replace(/,/g, '%2C')
    const tracksId = req.params.tracksId.replace(/,/g, '%2C')
    const playlistSize = req.params.playlistSize
    const token = req.params.token
    const headers = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }

    const tracksFeatures = await axios.get(`https://api.spotify.com/v1/audio-features?ids=${tracksId}`, headers)
    const audioFeatures = await tracksFeatures.data.audio_features

    const target_instrumentalness = await audioFeatures.map(t => t.instrumentalness).reduce((a, b) => a + b, 0) / audioFeatures.map(t => t.instrumentalness).length
    const target_acousticness = await audioFeatures.map(t => t.acousticness).reduce((a, b) => a + b, 0) / audioFeatures.map(t => t.acousticness).length
    const target_danceability = await audioFeatures.map(t => t.danceability).reduce((a, b) => a + b, 0) / audioFeatures.map(t => t.danceability).length
    const target_speechiness = await audioFeatures.map(t => t.speechiness).reduce((a, b) => a + b, 0) / audioFeatures.map(t => t.speechiness).length
    const target_liveness = await audioFeatures.map(t => t.liveness).reduce((a, b) => a + b, 0) / audioFeatures.map(t => t.liveness).length
    const target_loudness = await audioFeatures.map(t => t.loudness).reduce((a, b) => a + b, 0) / audioFeatures.map(t => t.loudness).length
    const target_energy = await audioFeatures.map(t => t.energy).reduce((a, b) => a + b, 0) / audioFeatures.map(t => t.energy).length
    const target_tempo = await audioFeatures.map(t => t.tempo).reduce((a, b) => a + b, 0) / audioFeatures.map(t => t.tempo).length
    const target_valence = await audioFeatures.map(t => t.valence).reduce((a, b) => a + b, 0) / audioFeatures.map(t => t.valence).length

    const RecommendationsTracksTarget = await axios.get(`https://api.spotify.com/v1/recommendations?limit=${playlistSize}&seed_tracks=${tracksId}&target_acousticness=${target_acousticness}&target_danceability=${target_danceability}&target_energy=${target_energy}&target_instrumentalness=${target_instrumentalness}&target_liveness=${target_liveness}&target_loudness=${target_loudness}&target_speechiness=${target_speechiness}&target_tempo=${target_tempo}&target_valence=${target_valence}`, headers)
    const RecommendationsArtistsTarget = await axios.get(`https://api.spotify.com/v1/recommendations?limit=${playlistSize}&seed_artists=${artistsId}&target_acousticness=${target_acousticness}&target_danceability=${target_danceability}&target_energy=${target_energy}&target_instrumentalness=${target_instrumentalness}&target_liveness=${target_liveness}&target_loudness=${target_loudness}&target_speechiness=${target_speechiness}&target_tempo=${target_tempo}&target_valence=${target_valence}`, headers)

    const RecommendTracksIds = new Set(RecommendationsTracksTarget.data.tracks.map(t => t.id))
    const mergedTracks = [...RecommendationsTracksTarget.data.tracks, ...RecommendationsArtistsTarget.data.tracks.filter(t => !RecommendTracksIds.has(t.id))]
    res.send(mergedTracks)
})

module.exports = router