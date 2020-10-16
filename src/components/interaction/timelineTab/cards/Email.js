import React, { Component } from 'react'
import {MDBBox, MDBCard, MDBCardBody, MDBCollapse, MDBIcon, MDBBtn, MDBListGroup, MDBListGroupItem} from "mdbreact"
import { connect } from "react-redux"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faArrowRight,
    faCircle as faCircleSolid,
    faEnvelope,
    faEnvelopeOpen,
    faBan,
    faShare,
    faTimes,
    faExternalLinkAlt,
    faPaperPlane,
} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import LoadingScreen from "../../../LoadingScreen"
import LeadAPI from '../../../../api/leadAPI';
import {toast} from "react-toastify";
import moment from "moment-timezone";
import AgentAPI from '../../../../api/agentAPI';

class Email extends Component {

    constructor(props) {
        super(props)
        this.toggleCollapse=this.toggleCollapse.bind(this)

        this.state = {
            collapsed: true,
            emailContent: undefined,
            resent: false
        }

    }
    toggleCollapse() {
        // if we haven't already, load the email content from the backend
        if (this.state.collapsed === true && this.state.emailContent === undefined) {
            const getEmailContentParams = {
                leadID: this.props.lead.id,
                emailLogID: this.props.data.id
            }
            LeadAPI.getEmailContent(getEmailContentParams).then( response => {
                if (response.success) {
                    const emailContent = response.content
                    this.setState({ emailContent })
                } else {
                    toast.error("Could not load email content")
                    this.setState({collapsed: true})
                }
            }).catch( reason => {
                console.log("Email load failed: ", reason)
            })
        }

        //meanwhile, toggle the visibility of the content space
        this.setState({collapsed : !this.state.collapsed})
    }

    resendEmail = () => {
        if (this.state.resent === false) {
            const params = {
                leadID: this.props.lead.id,
                logEmailID: this.props.data.id
            }
            this.setState({resent: true})

            AgentAPI.resendEmail(params).then( response => {
                toast.success(this.props.localization.toast.timeline.email.emailResent)
                const newEmailLog = {
                    id: response.new_log_id,
                    direction: "outgoing",
                    subject: this.props.data.subject,
                    events: [],
                    created_at: moment.utc().format()
                }
                this.props.dispatch({ type: "LEAD.EMAIL_SENT", data: newEmailLog })

            }).catch( reason => {
                toast.error(this.props.localization.toast.timeline.email.emailResendError)
            })
        }
    }

    render() {
        const opened = this.props.data.events && this.props.data.events.find(event => event.event === "Open") ? true : false
        const delivered = this.props.data.events && this.props.data.events.find(event => event.event === "Delivery") ? true : false
        const clicked = this.props.data.events && this.props.data.events.find(event => event.event === "Clicked") ? true : false
        const bounced = this.props.data.events && this.props.data.events.find(event => event.event === "Bounced") ? true : false
        const spam = this.props.data.events && this.props.data.events.find(event => event.event === "Spam") ? true : false
        return (
            <MDBCard className='w-100 border-0 mb-3 z-2'>
                <MDBBox className="backgroundColorInherit timelineCardHeader skin-border-primary f-m shadow-sm"
                                   onClick={this.toggleCollapse}
                >
                    <div className='d-flex justify-content-between p-1 px-3'>
                        <span className="fa-layers fa-fw fa-3x mt-2">
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                            <FontAwesomeIcon icon={opened ? faEnvelopeOpen : faEnvelope} transform={"shrink-8"} />
                            <span className="fa-layers-counter fa-layers-top-right skin-primary-background-color">
                                <FontAwesomeIcon icon={this.props.data.direction === "outgoing" ? faArrowRight : faArrowLeft} className="skin-text"/>
                            </span>
                        </span>
                        <div className="d-flex w-75 p-2 flex-column text-left">
                            <span className="f-l font-weight-bold">{this.props.data.subject}</span>
                            <span>View full email <FontAwesomeIcon className="ml-1" icon={faEnvelopeOpen} size="sm"/></span>
                        </div>
                        <div className="d-flex w-25 f-s flex-column text-right justify-content-between">

                            <span>
                                { clicked && <FontAwesomeIcon className="mr-1" icon={faExternalLinkAlt} size="sm"/>}
                                { opened && <FontAwesomeIcon className="mr-1" icon={faEnvelopeOpen} size="sm"/>}
                                { delivered && <FontAwesomeIcon className="mr-1" icon={faEnvelope} size="sm"/>}
                                { spam && <FontAwesomeIcon className="mr-1" icon={faBan} size="sm"/>}
                                { bounced && <FontAwesomeIcon className="mr-1" icon={faTimes} size="sm"/>}
                                
                                <FontAwesomeIcon className="mr-1" icon={faShare} size="sm"/>
                                <span>
                                    <span className="font-weight-bold">{this.props.data.created_at.format("MMM D")}</span>, {this.props.data.created_at.format("h:mm a z")}
                                </span>
                            </span>
                            <span><MDBIcon className="m-2" size={"lg"} icon={this.state.collapsed ? 'angle-down' : 'angle-up'}/></span>
                        </div>
                    </div>
                </MDBBox>
                <MDBCollapse id='collapse1' isOpen={!this.state.collapsed} style={{}}>
                    <hr className="m-0" style={{height:"2px", backgroundColor:"#DCE0E3", borderTop : 0}}/>
                    <MDBCardBody className="timelineCardBody skin-border-primary">
                        {this.state.emailContent === undefined && <LoadingScreen />}
                        <div dangerouslySetInnerHTML={{ __html: this.state.emailContent }} />
                        <MDBBox className="d-flex justify-content-between mt-2">
                            {this.state.emailContent !== undefined && <MDBBox><MDBBtn rounded disabled={this.state.resent} onClick={this.resendEmail}>
                                <FontAwesomeIcon className="mr-1" icon={faPaperPlane} size="sm"/>{this.props.localization.interaction.timeline.email.resendButtonLabel}
                            </MDBBtn></MDBBox>}
                            {(this.props.data.events && this.props.data.events.length > 0) && <MDBListGroup>
                                {this.props.data.events.map( event => {
                                    return <MDBListGroupItem key={event.time}>{moment.utc(event.time).tz(this.props.lead.details.timezone).format("MMM D, YYYY h:mm a z")} - {event.event}</MDBListGroupItem>
                                })}
                            </MDBListGroup>}

                        </MDBBox>
                    </MDBCardBody>
                </MDBCollapse>
            </MDBCard>

        )
    }
}
const mapStateToProps = store => {
    return {
        localization: store.localization,
        lead: store.lead
    }
}

export default connect(mapStateToProps)(Email);
