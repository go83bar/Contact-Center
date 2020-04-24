import React, {Component} from 'react'
import {MDBCard, MDBCardBody, MDBCardHeader, MDBStep, MDBStepper} from "mdbreact";
import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendarCheck,
    faCircle as faCircleSolid,
    faComment, faEdit,
    faEnvelope,
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
            <MDBCard className="d-flex mr-2 border-0" style={{order: 0, flex: "0 0 390px"}}>
                <MDBCardHeader className="card-header-no-back-no-border bg-white">Touchpoints</MDBCardHeader>
                <MDBCardBody>
                    <MDBStepper vertical className="timelineStepper m-0 p-0">
                        <MDBStep className="flex-row">
                            <div style={{minHeight: "75px"}}
                                 className="text-right">FEB 10<br/>2:31 pm EST
                            </div>
                            <span className="fa-layers fa-fw fa-3x ml-1" style={{zIndex: 2}}>
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={"skin-accent-color"}/>
                            <FontAwesomeIcon icon={faCalendarCheck} transform={"shrink-8"}
                                             className={"skin-secondary-color"}/>
                            <span
                                className="fa-layers-counter fa-layers-top-right skin-accent-background-color">3</span>
                        </span>
                            <div style={{minHeight: "100px"}}
                                 className="">Appointment /<br/>Reason here
                            </div>
                        </MDBStep>
                        <MDBStep className="flex-row">
                            <div style={{minHeight: "75px"}}
                                 className="text-right">FEB 10<br/>2:31 pm EST
                            </div>
                            <span className="fa-layers fa-fw fa-3x ml-1" style={{zIndex: 2}}>
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={"darkIcon"}/>
                            <FontAwesomeIcon icon={faComment} transform={"shrink-8"} className={"dark"}/>
                            <span className="fa-layers-counter fa-layers-top-right"
                                  style={{background: "Tomato"}}>3</span>
                        </span>
                            <div style={{minHeight: "100px"}}
                                 className="">Appointment /<br/>Reason here
                            </div>
                        </MDBStep>
                        <MDBStep className="flex-row">
                            <div style={{minHeight: "75px"}}
                                 className="text-right">FEB 10<br/>2:31 pm EST
                            </div>
                            <span className="fa-layers fa-fw fa-3x ml-1" style={{zIndex: 2}}>
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={"darkIcon"}/>
                            <FontAwesomeIcon icon={faEnvelope} transform={"shrink-8"} className={"dark"}/>
                            <span className="fa-layers-counter fa-layers-top-right"
                                  style={{background: "Tomato"}}>3</span>
                        </span>
                            <div style={{minHeight: "100px"}}
                                 className="">Appointment /<br/>Reason here
                            </div>
                        </MDBStep>
                        <MDBStep className="flex-row">
                            <div style={{minHeight: "75px"}}
                                 className="text-right">FEB 10<br/>2:31 pm EST
                            </div>
                            <span className="fa-layers fa-fw fa-3x ml-1" style={{zIndex: 2, marginLeft: "-5px"}}>
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={"darkIcon"}/>
                            <FontAwesomeIcon icon={faEdit} transform={"shrink-8"} className={"dark"}/>
                            <span className="fa-layers-counter fa-layers-top-right"
                                  style={{background: "Tomato"}}>3</span>
                        </span>
                            <div style={{minHeight: "100px"}}
                                 className="">Appointment /<br/>Reason here
                            </div>
                        </MDBStep>
                        <MDBStep className="flex-row">
                            <div style={{minHeight: "75px"}}
                                 className="text-right">FEB 10<br/>2:31 pm EST
                            </div>
                            <span className="fa-layers fa-fw fa-3x ml-1" style={{zIndex: 2, marginLeft: "-5px"}}>
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={"darkIcon"}/>
                            <FontAwesomeIcon icon={faPhone} transform={"shrink-8"} className={"dark"}/>
                            <span className="fa-layers-counter fa-layers-top-right"
                                  style={{background: "Tomato"}}>3</span>
                        </span>
                            <div style={{minHeight: "100px"}}
                                 className="">Appointment /<br/>Reason here
                            </div>
                        </MDBStep>
                        <MDBStep className="flex-row">
                            <div style={{minHeight: "75px"}}
                                 className="text-right">FEB 10<br/>2:31 pm EST
                            </div>
                            <span className="fa-layers fa-fw fa-3x ml-1" style={{zIndex: 2, marginLeft: "-5px"}}>
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={"darkIcon"}/>
                            <FontAwesomeIcon icon={faPoll} transform={"shrink-8"} rotation={90} className={"darkIcon"}/>
                            <span className="fa-layers-counter fa-layers-top-right"
                                  style={{background: "Tomato"}}>3</span>
                            </span>
                            <div style={{minHeight: "100px"}}
                                 className="">Appointment /<br/>Reason here
                            </div>
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
