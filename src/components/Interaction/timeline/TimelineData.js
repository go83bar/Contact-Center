import moment from "moment-timezone";

class TimelineData {

    constructor(lead) {

        this.touchpoints = {
            timezone: lead.details.timezone,
            appointments: {total:0, date:"", time: ""},
            texts: {total: 0, incoming : 0, outgoing: 0},
            interactions: 0,
            emails : {total : 0, delivered: 0, opened : 0},
            notes : 0,
            calls : {total : 0, incoming:0, outgoing : 0},
            surveys: {total:0, date:"", time : ""}
        }
        this.timeline = [ ...lead.interactions]
        this.timeline.forEach(interaction =>  {
            interaction["events"] = []
            interaction["type"] = "interaction"
        })

        this.generateTimeline(lead)
    }
    processItems(type, items) {
        items.forEach(item => {
            item["type"] = type
            if (item.interaction_id) {
                let interaction = this.timeline.find(i => i.id === item.interaction_id && i.type === "interaction")
                if (interaction)
                    interaction.events.push(item)
                else
                    this.timeline.push(item)
            }
            else {
                this.timeline.push(item)
            }
        })
    }

    calculateTouchpoints(events) {
        events.forEach(event => {
            switch (event.type) {
                case "interaction":
                    this.touchpoints.interactions++
                    this.calculateTouchpoints(event.events)
                    break
                case "appointment":
                    this.touchpoints.appointments.total++
                    this.touchpoints.appointments.date = moment(event.created_at).format("MMM Do")
                    this.touchpoints.appointments.time = moment(event.created_at).tz(this.touchpoints.timezone).format("hh:mm a z")
                    break
                case "note":
                    this.touchpoints.notes++
                    break
                case "call":
                    this.touchpoints.calls.total++
                    event.direction === "outgoing" ? this.touchpoints.calls.outgoing++ : this.touchpoints.calls.incoming++
                    break
                case "email":
                    this.touchpoints.emails.total++
                    if (event.events && event.events.length > 0){
                        event.events.forEach(e => {
                            if (e.event === "Delivery")
                                this.touchpoints.emails.delivered++
                            else if (e.event === "Open")
                                this.touchpoints.emails.opened++
                        })
                    }

                    break
                case "survey":
                    this.touchpoints.surveys.total++
                    this.touchpoints.surveys.date = moment(event.created_at).format("MMM Do")
                    this.touchpoints.surveys.time = moment(event.created_at).tz(this.touchpoints.timezone).format("hh:mm a z")
                    break
                case "text":
                    this.touchpoints.texts.total++
                    event.direction === "outgoing" ? this.touchpoints.texts.outgoing++ : this.touchpoints.texts.incoming++
                    break
                default: break
            }
        })
    }

    generateTimeline(lead) {
        this.processItems("appointment", lead.appointments)
        this.processItems("email", lead.emails)
        this.processItems("note", lead.notes)
        this.processItems("survey", lead.surveys)
        this.processItems("text", lead.texts)
        //Add Additional Sections here

        //Sort Main Level by date.
        this.timeline.sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
        this.timeline.forEach(item => {
            if (item.type === "interaction") {
                item.events.sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
            }
        })
        this.calculateTouchpoints(this.timeline)
    }

    getTouchpoints() {
        return this.touchpoints
    }
    getTimeline() {
        return this.timeline
    }

}
export default TimelineData;
