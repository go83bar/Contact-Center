import sendRequest from './fetch'

export default class AppointmentAPI {
    constructor(name) {
        this.name = name
    }

    bob() {
        console.log(this.name)
    }
}