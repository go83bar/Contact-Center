import React, {Component} from 'react'
import {MDBBox, MDBCard, MDBCardBody, MDBChip, MDBCollapse, MDBIcon} from "mdbreact"
import {connect} from "react-redux"
import Email from "./Email";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendar,
    faCircle as faCircleSolid,
    faEnvelope,
    faPhone,
    faExchange, faFile, faEdit, faComment, faGift, faPencil
} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import AgentCall from "./AgentCall";
import Text from "./Text";
import Appointment from "./Appointment";
import Lead from "./Lead";
import Note from "./Note";
import Survey from "./Survey";
import Document from "./Document";
import Reward from "./Reward";
import RewardResend from "./RewardResend";
import SimpleLog from "./SimpleLog";

class Interaction extends Component {

    constructor(props) {
        super(props)
        this.toggleCollapse = this.toggleCollapse.bind(this)
        this.renderEvents = this.renderEvents.bind(this)
        this.getEventCounts = this.getEventCounts.bind(this)

        this.state = {
            collapsed: true
        }

    }

    toggleCollapse() {
        this.setState({collapsed: !this.state.collapsed})
    }

    renderEvents() {
        const events = this.props.data.events.map((item, index) => {
            if (this.props.filters.length === 0 || this.props.filters.includes("interactions") || this.props.filters.includes(item.type + "s")) {
                switch (item.type) {
                    case "appointment":
                        return (
                            <Appointment data={item} key={"int-event-" + index}/>
                        )
                    case "note":
                        return (
                            <Note data={item} key={"int-event-" + index}/>
                        )
                    case "agent_call":
                        return (
                            <AgentCall data={item} key={"int-event-" + index}/>
                        )
                    case "document":
                        return (
                            <Document data={item} key={"int-event-" + index}/>
                        )
                    case "email":
                        return (
                            <Email data={item} key={"int-event-" + index}/>
                        )
                    case "reward":
                        return (
                            <Reward data={item} key={"int-event-" + index}/>
                        )
                    case "reward_resend":
                        return (
                            <RewardResend data={item} key={"int-event-" + index}/>
                        )
                    case "survey":
                        return (
                            <Survey data={item} key={"int-event-" + index}/>
                        )
                    case "text":
                        return (
                            <Text data={item} key={"int-event-" + index}/>
                        )
                    case "log":
                        return (
                            <Lead data={item} key={"int-event-" + index}/>
                        )
                    case "appt_log":
                        return (
                            <SimpleLog data={item} key={"int-event-" + index}/>
                        )
                    default:
                        return null
                }
            }
            else return null
        })
        return events
    }
    getEventCounts() {
        let counts = {
            emails : 0,
            calls : 0,
            appointments : 0,
            documents : 0,
            rewards: 0,
            texts: 0,
            notes: 0,
            logs: 0
        }
        this.props.data && this.props.data.events && this.props.data.events.forEach(event => {
            switch (event.type) {
                case "email" : counts.emails++
                    break
                case "agent_call" :
                    counts.calls++
                    break
                case "appointment" : counts.appointments++
                    break
                case "document" : counts.documents++
                    break
                case "text" : counts.texts++
                    break
                case "note" : counts.notes++
                    break
                case "reward" : counts.rewards++
                    break
                case "reward_resend" : counts.rewards++
                    break
                case "log":
                case "appt_log":
                    counts.logs++
                    break
                default: break
            }
        })
        return counts
    }

    render() {
        const counts = this.getEventCounts()
        //const client = this.props.shift.clients.find(client => client.id === this.props.lead.client_id)
        const outcome_reason = this.props.shift.outcome_reasons.find(reason => reason.id === this.props.data.outcome_reason_id)
        return (
            <MDBCard className='w-100 border-0 z-2'>
                <MDBBox className="backgroundColorInherit timelineCardHeader skin-border-primary f-m shadow-sm"
                        onClick={this.toggleCollapse}
                >
                    <div className='d-flex justify-content-between p-1 px-3'>
                        <span className="fa-layers fa-fw fa-3x mt-2">
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                            <FontAwesomeIcon icon={faExchange} transform={"shrink-8"} className={"darkIcon"}/>
                        </span>
                        <div className="d-flex w-50 p-2 flex-column text-left">
                            <span className="f-l font-weight-bold">{this.props.shift.outcomes.find(outcome => outcome.id === this.props.data.outcome_id).label}</span>
                            {outcome_reason && <span>{outcome_reason.text}</span>}
                            <div className="d-flex">
                                {counts.emails > 0 && <div><MDBChip className="m-0 timelineChip">{counts.emails} <FontAwesomeIcon icon={faEnvelope}/></MDBChip></div>}
                                {counts.calls > 0 && <div><MDBChip className="m-0 timelineChip">{counts.calls} <FontAwesomeIcon icon={faPhone}/></MDBChip></div>}
                                {counts.appointments > 0 && <div><MDBChip className="m-0 timelineChip">{counts.appointments} <FontAwesomeIcon icon={faCalendar}/></MDBChip></div>}
                                {counts.documents > 0 && <div><MDBChip className="m-0 timelineChip">{counts.documents} <FontAwesomeIcon icon={faFile}/></MDBChip></div>}
                                {counts.rewards > 0 && <div><MDBChip className="m-0 timelineChip">{counts.rewards} <FontAwesomeIcon icon={faGift}/></MDBChip></div>}
                                {counts.texts > 0 && <div><MDBChip className="m-0 timelineChip">{counts.texts} <FontAwesomeIcon icon={faComment}/></MDBChip></div>}
                                {counts.notes > 0 && <div><MDBChip className="m-0 timelineChip">{counts.notes} <FontAwesomeIcon icon={faEdit}/></MDBChip></div>}
                                {counts.logs > 0 && <div><MDBChip className="m-0 timelineChip">{counts.logs} <FontAwesomeIcon icon={faPencil}/></MDBChip></div>}
                            </div>
                        </div>
                        <div className="d-flex w-50 f-s flex-column text-right justify-content-end">
                            <span><span className="font-weight-bold">{this.props.data.created_at.format("MMM D")}</span>, {this.props.data.created_at.format("h:mm a z")}</span>
                            {this.props.data.created_by && <span>{this.props.localization.created_by}: {this.props.data.created_by}</span>}
                            <span>{this.props.data.reason_id && this.props.shift.call_reasons.find(reason => reason.id === this.props.data.reason_id).text} / {this.props.data.phase_id && this.props.shift.phases.find(phase => phase.id === this.props.data.phase_id).label}</span>
                            {this.props.data && this.props.data.events.length > 0 && <MDBIcon className="m-2" size={"lg"} icon={this.state.collapsed ? 'angle-down' : 'angle-up'}/>}
                        </div>
                    </div>
                </MDBBox>
                <MDBCollapse id='collapse1' isOpen={!this.state.collapsed} style={{}}>
                    <hr className="m-0" style={{height: "2px", backgroundColor: "#DCE0E3", borderTop: 0}}/>
                    <MDBCardBody className="timelineCardBody skin-border-primary pt-3 px-3 pb-0">
                        {this.props.data && this.props.data.events.length > 0 && this.renderEvents()}
                    </MDBCardBody>
                </MDBCollapse>
            </MDBCard>

        )
    }
}

const mapStateToProps = store => {
    return {
        localization: store.localization,
        shift : store.shift,
        lead : store.lead
    }
}

export default connect(mapStateToProps)(Interaction);
