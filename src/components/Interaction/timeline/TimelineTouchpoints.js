import React, {Component} from 'react'
import {MDBCard, MDBCardBody, MDBCardHeader, MDBChip, MDBStep, MDBStepper} from "mdbreact";
import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {
    faArrowLeft,
    faArrowRight,
    faCalendarCheck,
    faCircle as faCircleSolid,
    faComment, faEdit,
    faEnvelope, faEnvelopeOpen, faExchange,
    faPhone, faPoll
} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";

class TimelineTouchpoints extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const tp = this.props.data
        return (
            <MDBCard className="d-flex mr-2 border-0" style={{order: 0, flex: "0 0 185px"}}>
                <MDBCardHeader className="card-header-no-back-no-border bg-white">Touchpoints</MDBCardHeader>
                <MDBCardBody style={{fontSize:"14px"}} className="p-1">
                    <MDBStepper vertical className="timelineStepper m-0 p-0" >
                        <MDBStep className="flex-row">
                            <div style={{minHeight: "75px", width:"90px"}} className="text-right mt-2">
                                {tp.surveys.total > 0 &&  <div><div className="font-weight-bold">{tp.surveys.date}</div><div>{tp.surveys.time}</div></div>}
                            </div>
                            <span className="fa-layers fa-fw fa-4x ml-1" style={{zIndex: 2, marginLeft: "-5px"}}>
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={tp.surveys.total > 0 ? "skin-primary-color" : "disabledColor"}/>
                            <FontAwesomeIcon icon={faPoll} transform={"shrink-8"} rotation={90} className={tp.surveys.total > 0 ? "skin-secondary-color" : "disabledColor"}/>
                                {tp.surveys.total > 0 && <span className="fa-layers-counter fa-layers-top-right skin-primary-background-color">{tp.surveys.total}</span>}
                            </span>
                        </MDBStep>
                        <MDBStep className="flex-row">
                            <div style={{minHeight: "75px", width:"90px"}} className="text-right mt-2"/>
                            <span className="fa-layers fa-fw fa-4x ml-1" style={{zIndex: 2}}>
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={tp.interactions > 0 ? "skin-primary-color" : "disabledColor"}/>
                            <FontAwesomeIcon icon={faExchange} transform={"shrink-8"} className={tp.interactions > 0 ? "skin-secondary-color" : "disabledColor"} />
                                {tp.interactions > 1 && <span className="fa-layers-counter fa-layers-top-right skin-primary-background-color">{tp.interactions}</span>}
                        </span>
                        </MDBStep>
                        <MDBStep className="flex-row">
                            <div style={{minHeight: "75px", width:"90px"}} className="text-right mt-1">
                                {tp.calls.total > 0 && <div><MDBChip className="m-0 timelineChip">{tp.calls.outgoing} <FontAwesomeIcon icon={faArrowRight}/></MDBChip>
                                    <MDBChip className="m-0 timelineChip">{tp.calls.incoming} <FontAwesomeIcon icon={faArrowLeft}/></MDBChip></div>}
                            </div>
                            <span className="fa-layers fa-fw fa-4x ml-1" style={{zIndex: 2, marginLeft: "-5px"}}>
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={tp.calls.total > 0 ? "skin-primary-color" : "disabledColor"}/>
                            <FontAwesomeIcon icon={faPhone} transform={"shrink-8"} className={tp.calls.total > 0 ? "skin-secondary-color" : "disabledColor"}/>
                                {tp.calls.total > 1 && <span className="fa-layers-counter fa-layers-top-right skin-primary-background-color">{tp.calls.total}</span>}
                        </span>
                        </MDBStep>
                        <MDBStep className="flex-row">
                            <div style={{minHeight: "75px", width:"90px"}} className="text-right mt-1">
                                {tp.texts.total > 0 &&  <div><MDBChip className="m-0 timelineChip">{tp.texts.outgoing} <FontAwesomeIcon icon={faArrowRight}/></MDBChip>
                                    <MDBChip className="m-0 timelineChip">{tp.texts.incoming} <FontAwesomeIcon icon={faArrowLeft}/></MDBChip></div>}
                            </div>
                            <span className="fa-layers fa-fw fa-4x ml-1" style={{zIndex: 2}}>
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={tp.texts.total > 0 ? "skin-primary-color" : "disabledColor"}/>
                            <FontAwesomeIcon icon={faComment} transform={"shrink-8"} className={tp.texts.total > 0 ? "skin-secondary-color" : "disabledColor"}/>
                                {tp.texts.total > 1 && <span className="fa-layers-counter fa-layers-top-right skin-primary-background-color">{tp.texts.total}</span>}
                        </span>
                        </MDBStep>
                        <MDBStep className="flex-row">
                            <div style={{minHeight: "75px", width:"90px"}} className="text-right mt-1">
                                {tp.emails.total > 0 && <div>
                                    <MDBChip className="m-0 timelineChip">{tp.emails.opened} <FontAwesomeIcon icon={faEnvelopeOpen}/></MDBChip>
                                    <MDBChip className="m-0 timelineChip">{tp.emails.delivered} <FontAwesomeIcon icon={faEnvelope} /></MDBChip>
                                </div>}
                            </div>
                            <span className="fa-layers fa-fw fa-4x ml-1" style={{zIndex: 2}}>
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={tp.emails.total > 0 ? "skin-primary-color" : "disabledColor"}/>
                            <FontAwesomeIcon icon={faEnvelope} transform={"shrink-8"} className={tp.emails.total > 0 ? "skin-secondary-color" : "disabledColor"}/>
                                {tp.emails.total > 1 && <span className="fa-layers-counter fa-layers-top-right skin-primary-background-color">{tp.emails.total}</span>}
                        </span>
                        </MDBStep>
                        <MDBStep className="flex-row">
                            <div style={{minHeight: "75px", width:"90px"}} className="text-right mt-2"/>
                            <span className="fa-layers fa-fw fa-4x ml-1" style={{zIndex: 2, marginLeft: "-5px"}}>
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={tp.notes > 0 ? "skin-primary-color" : "disabledColor"}/>
                            <FontAwesomeIcon icon={faEdit} transform={"shrink-8"} className={tp.notes > 0 ? "skin-secondary-color" : "disabledColor"}/>
                                {tp.notes > 1 && <span className="fa-layers-counter fa-layers-top-right skin-primary-background-color">{tp.notes}</span>}
                        </span>
                        </MDBStep>
                        <MDBStep className="flex-row">
                            <div style={{minHeight: "75px", width:"90px"}} className="text-right mt-2">
                                {tp.appointments.total > 0 &&  <div><div className="font-weight-bold">{tp.appointments.date}</div><div>{tp.appointments.time}</div></div>}
                            </div>
                            <span className="fa-layers fa-fw fa-4x ml-1" style={{zIndex: 2}}>
                            <FontAwesomeIcon icon={faCircleSolid} className="skin-primary-faint-color"/>
                            <FontAwesomeIcon icon={faCircle} className={tp.appointments.total > 0 ? "skin-primary-color" : "disabledColor"}/>
                            <FontAwesomeIcon icon={faCalendarCheck} transform={"shrink-8"} className={tp.appointments.total > 0 ? "skin-secondary-color" : "disabledColor"}/>
                            {tp.appointments.total > 1 && <span className="fa-layers-counter fa-layers-top-right skin-primary-background-color">{tp.appointments.total}</span>}
                        </span>
                        </MDBStep>
                    </MDBStepper>
                </MDBCardBody>
            </MDBCard>

        )
    }
}

const mapStateToProps = state => {
    return {
        localization: state.localization
    }
}

const mapDispatchToProps = dispatch => {
    return {dispatch}
}

export default connect(mapStateToProps, mapDispatchToProps)(TimelineTouchpoints);
