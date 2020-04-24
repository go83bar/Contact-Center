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
        return (
            <MDBCard className="d-flex mr-2 border-0" style={{order: 0, flex: "0 0 200px"}}>
                <MDBCardHeader className="card-header-no-back-no-border bg-white">Touchpoints</MDBCardHeader>
                <MDBCardBody style={{fontSize:"14px"}} className="py-1">
                    <MDBStepper vertical className="timelineStepper m-0 p-0" >
                        <MDBStep className="flex-row">
                            <div style={{minHeight: "75px", width:"80px"}} className="text-right mt-2">
                                <div className="font-weight-bold">FEB 10</div>
                                <div>2:31 pm EST</div>
                            </div>
                            <span className="fa-layers fa-fw fa-4x ml-1" style={{zIndex: 2}}>
                            <FontAwesomeIcon icon={faCircleSolid} className="skin-primary-faint-color"/>
                            <FontAwesomeIcon icon={faCircle} className={"skin-accent-color"}/>
                            <FontAwesomeIcon icon={faCalendarCheck} transform={"shrink-8"}
                                             className={"skin-secondary-color"}/>
                        </span>
                        </MDBStep>
                        <MDBStep className="flex-row">
                            <div style={{minHeight: "75px", width:"80px"}} className="text-right mt-2"/>
                            <span className="fa-layers fa-fw fa-4x ml-1" style={{zIndex: 2}}>
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={"skin-accent-color"}/>
                            <FontAwesomeIcon icon={faComment} transform={"shrink-8"} className={"dark"}/>
                            <span className="fa-layers-counter fa-layers-top-right skin-accent-background-color"
                                  >3</span>
                        </span>
                        </MDBStep>
                        <MDBStep className="flex-row">
                            <div style={{minHeight: "75px", width:"80px"}} className="text-right mt-2"/>
                            <span className="fa-layers fa-fw fa-4x ml-1" style={{zIndex: 2}}>
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={"skin-accent-color"}/>
                            <FontAwesomeIcon icon={faExchange} transform={"shrink-8"} className={"dark"}/>
                            <span className="fa-layers-counter fa-layers-top-right skin-accent-background-color"
                            >3</span>
                        </span>
                        </MDBStep>
                        <MDBStep className="flex-row">
                            <div style={{minHeight: "75px", width:"80px"}} className="text-right mt-1">
                                <div><MDBChip className="m-0 timelineChip">2 <FontAwesomeIcon icon={faEnvelopeOpen}/></MDBChip></div>
                                <div><MDBChip className="m-0 timelineChip">1 <FontAwesomeIcon icon={faEnvelope}/></MDBChip></div>
                            </div>
                            <span className="fa-layers fa-fw fa-4x ml-1" style={{zIndex: 2}}>
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={"skin-accent-color"}/>
                            <FontAwesomeIcon icon={faEnvelope} transform={"shrink-8"} className={"dark"}/>
                            <span className="fa-layers-counter fa-layers-top-right skin-accent-background-color"
                                  >3</span>
                        </span>
                        </MDBStep>
                        <MDBStep className="flex-row">
                            <div style={{minHeight: "75px", width:"80px"}} className="text-right mt-2"/>
                            <span className="fa-layers fa-fw fa-4x ml-1" style={{zIndex: 2, marginLeft: "-5px"}}>
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={"disabledColor"}/>
                            <FontAwesomeIcon icon={faEdit} transform={"shrink-8"} className={"disabledColor"}/>
                        </span>
                        </MDBStep>
                        <MDBStep className="flex-row">
                            <div style={{minHeight: "75px", width:"80px"}} className="text-right mt-1">
                                <div><MDBChip className="m-0 timelineChip">2 <FontAwesomeIcon icon={faArrowRight}/></MDBChip></div>
                                <div><MDBChip className="m-0 timelineChip">1 <FontAwesomeIcon icon={faArrowLeft}/></MDBChip></div>
                            </div>
                            <span className="fa-layers fa-fw fa-4x ml-1" style={{zIndex: 2, marginLeft: "-5px"}}>
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={"skin-accent-color"}/>
                            <FontAwesomeIcon icon={faPhone} transform={"shrink-8"} className={"dark"}/>
                            <span className="fa-layers-counter fa-layers-top-right skin-accent-background-color">3</span>
                        </span>
                        </MDBStep>
                        <MDBStep className="flex-row">
                            <div style={{minHeight: "75px", width:"80px"}} className="text-right mt-2">
                                <div className="font-weight-bold">FEB 10</div>
                                <div>2:31 pm EST</div>
                            </div>
                            <span className="fa-layers fa-fw fa-4x ml-1" style={{zIndex: 2, marginLeft: "-5px"}}>
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={"skin-accent-color"}/>
                            <FontAwesomeIcon icon={faPoll} transform={"shrink-8"} rotation={90} className={"darkIcon"}/>
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
