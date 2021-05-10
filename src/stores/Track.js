import { observable, makeObservable } from 'mobx'

export default class Track {
    constructor(id, name, artists, img, preview_url) {
        this.id = id
        this.name = name
        this.artists = artists
        this.img = img
        this.preview_url = preview_url

        makeObservable(this, {
            id: observable,
            name: observable,
            artists: observable,
            img: observable,
            preview_url: observable
        })
    }
}