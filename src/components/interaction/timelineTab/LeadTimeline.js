import React, {Component} from 'react'
import {
    MDBBox,
    MDBCardHeader,
    MDBCardBody,
    MDBCard, MDBChip, MDBStepper, MDBStep

} from "mdbreact";

import TimelineTouchpoints from "./TimelineTouchpoints";
import Interaction from "./cards/Interaction";
import {connect} from "react-redux";
import TimelineData from "./TimelineData";
import Appointment from "./cards/Appointment";
import Note from "./cards/Note";
import AgentCall from "./cards/AgentCall";
import IncomingCall from "./cards/IncomingCall";
import Document from "./cards/Document";
import Merge from "./cards/Merge";
import Email from "./cards/Email";
import Survey from "./cards/Survey";
import Reward from "./cards/Reward";
import Text from "./cards/Text";
import moment from "moment";
import Lead from "./cards/Lead";
import SimpleLog from "./cards/SimpleLog";
import RewardResend from "./cards/RewardResend";

class LeadTimeline extends Component {

    constructor(props) {
        super(props);

        this.toggleFilter = this.toggleFilter.bind(this)

        this.state = {
            filters: []
        };
    }

    toggleFilter(filter) {
        let filters = this.state.filters
        if (filter === "all")
            filters = []
        else if (filter === "calls") {
            // we like having a single filter for calls but the timeline items are broken into separate card types
            filters = this.adjustFilters(["calls", "incoming_calls", "agent_calls"], filters)
        } else {
            filters = this.adjustFilters([filter], filters)
        }
        this.setState({filters})
    }

    adjustFilters(filtersToToggle, existingFilters) {
        filtersToToggle.forEach( filter => {
            const index = existingFilters.indexOf(filter)
            if (index > -1) existingFilters.splice(index, 1)
            else existingFilters.push(filter)
        })

        return existingFilters
    }


    buildTimeline(td) {
        let date = undefined
        const filters = this.state.filters
        const timeline = td.map((item, index) => {
            let result = []
            let showInteraction = false
            if (item.type === "interaction") {
                if (filters.length === 0 || ( filters.includes("interactions")))
                    showInteraction = true
                else {
                    item.events.forEach(intItem => {
                        if (filters.includes(intItem.type + "s"))
                            showInteraction = true
                    })
                }
            }
            if (filters.length === 0 || (item.type === "interaction" ? false : filters.includes(item.type +"s")) || showInteraction) {
                const itemDate = moment(item.created_at).format("YYYY") !== moment().format("YYYY") ?
                    moment(item.created_at).format("MMM D, YYYY").toUpperCase() :
                    moment(item.created_at).format("MMM D").toUpperCase()
                if (date === undefined || date !== itemDate) {
                    date = itemDate
                    result.push(
                        <MDBStep className="mb-4" key={itemDate}>
                            <div className="" style={{width: "140px", zIndex: 2}}>
                                <MDBChip className="m-0 ml-2 timelineChip font-weight-bold">{itemDate}</MDBChip>
                            </div>
                        </MDBStep>
                    )
                }
                switch (item.type) {
                    case "interaction":
                        result.push(
                            <MDBStep className="mb-4" key={"event-" + index}>
                                <Interaction data={item} filters={filters}/>
                            </MDBStep>
                        )
                        break
                    case "appointment":
                        result.push(
                            <MDBStep className="mb-4" key={"item-" + index}>
                                <Appointment data={item}/>
                            </MDBStep>
                        )
                        break
                    case "note":
                        result.push(
                            <MDBStep className="mb-4" key={"item-" + index}>
                                <Note data={item}/>
                            </MDBStep>
                        )
                        break
                    case "reward":
                        result.push(
                            <MDBStep className="mb-4" key={"item-" + index}>
                                <Reward data={item}/>
                            </MDBStep>
                        )
                        break
                    case "reward_resend":
                        result.push(
                            <MDBStep className="mb-4" key={"item-" + index}>
                                <RewardResend data={item}/>
                            </MDBStep>
                        )
                        break
                    case "agent_call":
                        result.push(
                            <MDBStep className="mb-4" key={"item-" + index}>
                                <AgentCall data={item}/>
                            </MDBStep>
                        )
                        break
                    case "incoming_call":
                        result.push(
                            <MDBStep className="mb-4" key={"item-" + index}>
                                <IncomingCall data={item}/>
                            </MDBStep>
                        )
                        break
                    case "document":
                        result.push(
                            <MDBStep className="mb-4" key={"item-" + index}>
                                <Document data={item}/>
                            </MDBStep>
                        )
                        break
                    case "email":
                        result.push(
                            <MDBStep className="mb-4" key={"item-" + index}>
                                <Email data={item}/>
                            </MDBStep>
                        )
                        break
                    case "survey":
                        result.push(
                            <MDBStep className="mb-4" key={"item-" + index}>
                                <Survey data={item}/>
                            </MDBStep>
                        )
                        break
                    case "text":
                        result.push(
                            <MDBStep className="mb-4" key={"item-" + index}>
                                <Text data={item}/>
                            </MDBStep>
                        )
                        break
                    case "merge":
                        result.push(
                            <MDBStep className="mb-4" key={"item-" + index}>
                                <Merge data={item}/>
                            </MDBStep>
                        )
                        break
                    case "log":
                        result.push(
                            <MDBStep className="mb-4" key={"item-" + index}>
                                <Lead data={item}/>
                            </MDBStep>
                        )
                        break
                    case "appt_log":
                        result.push(
                            <MDBStep className="mb-4" key={"item-" + index}>
                                <SimpleLog data={item}/>
                            </MDBStep>
                        )
                        break
                    default:
                        break
                }
            }
            return result
        })
        return timeline
    }
    render() {
        if (this.props.active === true) {
            const td = new TimelineData(this.props.lead)
            //console.log("TimelineData: ", td)
            const tp = td.getTouchpoints()
            return (
                <MDBBox className="d-flex flex-row overflow-auto flex-1 p-0 m-0 w-auto">
                    <TimelineTouchpoints data={tp} toggleFilter={this.toggleFilter} filters={this.state.filters}/>
                    <MDBCard className="d-flex order-1 overflow-auto w-100 border-0 backgroundColorInherit">
                        <MDBCardHeader
                            className="d-flex card-header-no-back-no-border bg-white mb-3 f-s py-2 px-3 justify-content-end">
                                <span
                                    className={"p-0 px-2 pointer " + (this.state.filters.length === 0 ? "skin-primary-color" : "skin-secondary-color")}
                                    onClick={() => this.toggleFilter("all")}>
                                    All
                                </span>
                            <span
                                className={"p-0 px-2 pointer " + (tp.surveys.total > 0 ? (this.state.filters.includes("surveys") ? "skin-primary-color" : "skin-secondary-color") : "disabledColor")}
                                onClick={tp.surveys.total > 0 ? () => this.toggleFilter("surveys") : null}>
                                    Surveys
                                </span>
                            <span
                                className={"p-0 px-2 pointer " + (tp.interactions > 0 ? (this.state.filters.includes("interactions") ? "skin-primary-color" : "skin-secondary-color") : "disabledColor")}
                                onClick={tp.interactions > 0 ? () => this.toggleFilter("interactions") : null}>
                                    Interactions
                                </span>
                            <span
                                className={"p-0 px-2 pointer " + (tp.calls.total > 0 ? (this.state.filters.includes("calls") ? "skin-primary-color" : "skin-secondary-color") : "disabledColor")}
                                onClick={tp.calls.total > 0 ? () => this.toggleFilter("calls") : null}>
                                    Calls
                                </span>
                            <span
                                className={"p-0 px-2 pointer " + (tp.texts.total > 0 ? (this.state.filters.includes("texts") ? "skin-primary-color" : "skin-secondary-color") : "disabledColor")}
                                onClick={tp.texts.total > 0 ? () => this.toggleFilter("texts") : null}>
                                    Texts
                                </span>
                            <span
                                className={"p-0 px-2 pointer " + (tp.emails.total > 0 ? (this.state.filters.includes("emails") ? "skin-primary-color" : "skin-secondary-color") : "disabledColor")}
                                onClick={tp.emails.total > 0 ? () => this.toggleFilter("emails") : null}>
                                    Emails
                                </span>
                            <span
                                className={"p-0 px-2 pointer " + (tp.notes > 0 ? (this.state.filters.includes("notes") ? "skin-primary-color" : "skin-secondary-color") : "disabledColor")}
                                onClick={tp.notes > 0 ? () => this.toggleFilter("notes") : null}>
                                    Notes
                                </span>
                            <span
                                className={"p-0 px-2 pointer " + (tp.appointments.total > 0 ? (this.state.filters.includes("appointments") ? "skin-primary-color" : "skin-secondary-color") : "disabledColor")}
                                onClick={tp.appointments.total > 0 ? () => this.toggleFilter("appointments") : null}>
                                    Appointments
                                </span>
                        </MDBCardHeader>
                        <MDBCardBody className="d-flex overflow-auto m-0 p-0 flex-column">
                            <MDBStepper vertical className="m-0 p-0 px-3 timelineStepperRight">
                                {this.buildTimeline(td.getTimeline())}
                            </MDBStepper>
                        </MDBCardBody>
                    </MDBCard>
                </MDBBox>
            )
        } else {
            return null
        }
    }
}
const mapStateToProps = state => {
    return {
        localization: state.localization,
        lead : state.lead,
        shift: state.shift
    }
}

export default connect(mapStateToProps)(LeadTimeline);
