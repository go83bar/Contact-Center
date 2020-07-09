import React, { Component } from 'react'
import {MDBBox, MDBCard, MDBCardBody, MDBCollapse, MDBIcon} from "mdbreact"
import { connect } from "react-redux"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faArrowRight,
    faCircle as faCircleSolid,
    faEnvelope,
    faEnvelopeOpen
} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import LoadingScreen from "../../../LoadingScreen"
import LeadAPI from '../../../../api/leadAPI';
import {toast} from "react-toastify";

class Email extends Component {

    constructor(props) {
        super(props)
        this.toggleCollapse=this.toggleCollapse.bind(this)

        this.state = {
            collapsed: true,
            emailContent: undefined
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

    render() {
        const opened = this.props.data.events && this.props.data.events.find(event => event.event === "Open") ? true : false
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
                            <span><span className="font-weight-bold">{this.props.data.created_at.format("MMM D")}</span>, {this.props.data.created_at.format("hh:mm a z")}</span>
                            <span><MDBIcon className="m-2" size={"lg"} icon={this.state.collapsed ? 'angle-down' : 'angle-up'}/></span>
                        </div>
                    </div>
                </MDBBox>
                <MDBCollapse id='collapse1' isOpen={!this.state.collapsed} style={{}}>
                    <hr className="m-0" style={{height:"2px", backgroundColor:"#DCE0E3", borderTop : 0}}/>
                    <MDBCardBody className="timelineCardBody skin-border-primary">
                        {this.state.emailContent === undefined && <LoadingScreen />}
                        <div dangerouslySetInnerHTML={{ __html: this.state.emailContent }} />
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
