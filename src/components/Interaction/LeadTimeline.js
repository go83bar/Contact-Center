import React, {Component} from 'react'
import {
    MDBContainer,
    MDBStepper,
    MDBStep,
    MDBCardHeader,
    MDBCardBody,
    MDBCard,
    MDBRow,
    MDBCol
} from "mdbreact";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCalendarCheck, faComment, faEnvelope, faPhone, faPoll} from '@fortawesome/pro-solid-svg-icons'
import {faCircle} from '@fortawesome/pro-light-svg-icons'

class LeadTimeline extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <MDBContainer>
                <MDBRow>
                    <MDBCol size={"4"}>
                        <MDBCard className="mb-3">
                            <MDBCardHeader className={"card-header-no-back-no-border"}>Touchpoints</MDBCardHeader>
                            <MDBCardBody>
                                <MDBStepper vertical>
                                    <MDBStep>
                        <span className="fa-layers fa-fw fa-4x">
                            <FontAwesomeIcon icon={faCircle} className={"darkIcon"}/>
                            <FontAwesomeIcon icon={faCalendarCheck} transform={"shrink-8"} className={"darkIcon"}/>
                            <span className="fa-layers-counter fa-layers-top-right darkBack">3</span>
                        </span>
                                        <div style={{minHeight: "50px"}}
                                             className={"step-content step-content-top"}>Test
                                        </div>
                                    </MDBStep>
                                    <MDBStep>
                        <span className="fa-layers fa-fw fa-4x">
                            <FontAwesomeIcon icon={faCircle} className={"darkIcon"}/>
                            <FontAwesomeIcon icon={faComment} transform={"shrink-8"} className={"dark"}/>
                            <span className="fa-layers-counter fa-layers-top-right"
                                  style={{background: "Tomato"}}>3</span>
                        </span>
                                        <div style={{minHeight: "50px"}}
                                             className={"step-content step-content-top"}>Test
                                        </div>
                                    </MDBStep>
                                    <MDBStep>
                        <span className="fa-layers fa-fw fa-4x">
                            <FontAwesomeIcon icon={faCircle} className={"darkIcon"}/>
                            <FontAwesomeIcon icon={faEnvelope} transform={"shrink-8"} className={"dark"}/>
                            <span className="fa-layers-counter fa-layers-top-right"
                                  style={{background: "Tomato"}}>3</span>
                        </span>
                                        <div style={{minHeight: "50px"}}
                                             className={"step-content step-content-top"}>Test
                                        </div>
                                    </MDBStep>
                                    <MDBStep>
                        <span className="fa-layers fa-fw fa-4x">
                            <FontAwesomeIcon icon={faCircle} className={"darkIcon"}/>
                            <FontAwesomeIcon icon={faPhone} transform={"shrink-8"} className={"dark"}/>
                            <span className="fa-layers-counter fa-layers-top-right"
                                  style={{background: "Tomato"}}>3</span>
                        </span>
                                        <div style={{minHeight: "50px"}}
                                             className={"step-content step-content-top"}>Test
                                        </div>
                                    </MDBStep>
                                    <MDBStep>
                        <span className="fa-layers fa-fw fa-4x">
                            <FontAwesomeIcon icon={faCircle} className={"darkIcon"}/>
                            <FontAwesomeIcon icon={faPoll} transform={"shrink-8"} rotation={90} className={"darkIcon"}/>
                            <span className="fa-layers-counter fa-layers-top-right"
                                  style={{background: "Tomato"}}>3</span>
                        </span>
                                        <div style={{minHeight: "50px"}}
                                             className={"step-content step-content-top"}>Test
                                        </div>
                                    </MDBStep>
                                </MDBStepper>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <MDBCol size={"8"}>
                    <MDBCard>
                        <MDBCardHeader className={"card-header-no-back-no-border"}>All</MDBCardHeader>
                        <MDBCardBody></MDBCardBody>
                    </MDBCard>
                    </MDBCol>
                 </MDBRow>
            </MDBContainer>
        )
    }
}

export default LeadTimeline;
