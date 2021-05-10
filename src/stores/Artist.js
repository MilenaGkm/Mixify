import { observable, makeObservable } from 'mobx'

export default class Artist {
    constructor(id, name) {
        this.id = id
        this.name = name
        // this.img = img
        this.preferred = false
        this.feat = 1

        makeObservable(this, {
            id: observable,
            name: observable,
            // img: observable,
            preferred: observable,
            feat: observable
        })
    }
}