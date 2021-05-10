import Track from "./Track"
import Artist from "./Artist"
import { observable, computed, action, runInAction, makeObservable } from 'mobx'
const axios = require('axios');
const qs = require('qs');

export class HomeStore {
    constructor() {
        this.token = "";
        this.artists = [];
        this.tracks = [];
        this.inputTracks = [];
        this.recommendedTracks = [];
        this.playlistSize = 10;
        this.trigger = false;
        this.hash = false;
        this.userID = "";

        makeObservable(this, {
            artists: observable,
            tracks: observable,
            inputTracks: observable,
            recommendedTracks: observable,
            playlistSize: observable,
            trigger: observable,
            hash: observable,
            userID: observable,
            getToken: action,
            searchTrack: action,
            addTrack: action,
            removeTrack: action,
            removeRecommendedTrack: action,
            day: action,
            night: action,
        })
    }


    getToken = async () => {
        const token = await await axios.get('http://localhost:8888/token')
        this.token = token.data
    }

    searchTrack = async (e) => {
        if (e.key === "Enter") {
            const tracks = await axios.get(`http://localhost:8888/search/${e.target.value}/${this.token}`)
            const songs = await tracks.data.map(t => new Track(t.id, t.name, t.artists, t.album.images[1].url, t.preview_url))
            runInAction(() => {
                this.inputTracks = songs
                e.target.value = ""
            })
        }
    }

    addTrack = track => {
        if (this.tracks.length < 5) {
            if (this.tracks.some(x => x.id == track.id) === false) {
                this.tracks.push(track)
            }

            for (let i of [...track.artists]) {
                if (this.artists.some(x => x.id == i.id)) {
                    let updateArtists = this.artists.find(a => a.id === i.id)
                    updateArtists.feat++
                } else {
                    const artist = new Artist(i.id, i.name)
                    this.artists.push(artist)
                }
            }
        }
        this.inputTracks = []
    }
    
    removeTrack = track => {
        const trackIndex = this.tracks.indexOf(track)
        this.tracks.splice(trackIndex, 1)
        for (let i of track.artists) {
            let updateArtists = this.artists.find(a => a.id === i.id)
            if (updateArtists.feat === 1) {
                const artistIndex = this.artists.indexOf(updateArtists)
                this.artists.splice(artistIndex, 1)
            } else {
                updateArtists.feat--
            }
        }
    }
    
    setPlaylistSize = e => {
        this.playlistSize = e
        console.log(this.playlistSize);
    }
    
    choosePreferredArtists = (e) => {
        const artist = this.artists.find(a => a.name == e.target.name);
        runInAction(() => {
            artist.preferred = !artist.preferred
        });
    }
    
    searchSimilarTracks = async () => {
        if (this.artists.length <= 5 || this.artists.some(x => x.preferred)) {
            const artistsId = this.artists.some(a => a.preferred) ? this.artists.filter(a => a.preferred).map(a => a.id) : this.artists.map(a => a.id);
            const tracksId = this.tracks.map(t => t.id);
            const recommendations = await axios.get(`http://localhost:8888/recommendations/${artistsId}/${tracksId}/${this.playlistSize}/${this.token}`);
            const recommended = await recommendations.data.map(t => new Track(t.id, t.name, t.artists, t.album.images[1].url, t.preview_url));
            runInAction(() => {
                this.recommendedTracks = recommended;
                this.tracks = [];
                this.inputTracks = [];
                this.trigger = false;
            });
        } else {
            runInAction(() => {
                this.trigger = true;
                this.inputTracks = [];
            });
        }
    }

    removeRecommendedTrack = track => {
        const trackIndex = this.recommendedTracks.indexOf(track)
        this.recommendedTracks.splice(trackIndex, 1)
    
    }
    
    day = (Url) => {
        localStorage.setItem("recommendedTracks", JSON.stringify([...this.recommendedTracks]));
        window.open(Url ,'',' scrollbars=yes, menubar=no, width=500, height=700, resizable=yes, toolbar=no, location=no, status=no')
    }
    
    night = async (code) => {
        const storedTracks = JSON.parse(localStorage.getItem("recommendedTracks"));
        const tracksId = storedTracks.map(t => "spotify:track:" + t.id);
        const idk = {code, tracksId}
        const playlist = await axios.post(`http://localhost:8888/callback/`, idk)
        setTimeout(function () { window.close(); }, 1000);
    }
}
 