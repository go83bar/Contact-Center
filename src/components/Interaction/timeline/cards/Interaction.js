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
    faExchange, faFile, faEdit, faComment
} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import Call from "./Call";
import Text from "./Text";
import Appointment from "./Appointment";
import Lead from "./Lead";
import Note from "./Note";
import Survey from "./Survey";
import Document from "./Document";

class Interaction extends Component {

    constructor(props) {
        super(props)
        this.toggleCollapse = this.toggleCollapse.bind(this)

        this.state = {
            collapsed: true
        }

    }

    toggleCollapse() {
        this.setState({collapsed: !this.state.collapsed})
    }

    render() {
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
                        <div className="d-flex w-75 p-2 flex-column text-left">
                            <span className="f-l font-weight-bold">Outcome</span>
                            <span>Reason</span>
                            <div className="d-flex">
                                <div><MDBChip className="m-0 timelineChip">1 <FontAwesomeIcon
                                    icon={faEnvelope}/></MDBChip></div>
                                <div><MDBChip className="m-0 timelineChip">1 <FontAwesomeIcon icon={faPhone}/></MDBChip>
                                </div>
                                <div><MDBChip className="m-0 timelineChip">1 <FontAwesomeIcon
                                    icon={faCalendar}/></MDBChip></div>
                                <div><MDBChip className="m-0 timelineChip">1 <FontAwesomeIcon icon={faFile}/></MDBChip>
                                </div>
                                <div><MDBChip className="m-0 timelineChip">1 <FontAwesomeIcon
                                    icon={faComment}/></MDBChip></div>
                                <div><MDBChip className="m-0 timelineChip">1 <FontAwesomeIcon icon={faEdit}/></MDBChip>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex w-25 f-s flex-column text-right justify-content-end">
                            <span><span className="font-weight-bold">FEB 20</span>, 10:44am EST</span>
                            <span>Agent: Claudia Brown</span>
                            <span>Call Reason / Phase</span>
                            <MDBIcon className="m-2" size={"lg"} icon={this.state.collapsed ? 'angle-down' : 'angle-up'}/>
                        </div>
                    </div>
                </MDBBox>
                <MDBCollapse id='collapse1' isOpen={!this.state.collapsed} style={{}}>
                    <hr className="m-0" style={{height: "2px", backgroundColor: "#DCE0E3", borderTop: 0}}/>
                    <MDBCardBody className="timelineCardBody skin-border-primary pt-3 px-3 pb-0">
                        <Email/>
                        <Call/>
                        <Text/>
                        <Appointment/>
                        <Survey/>
                        <Document/>
                        <Lead/>
                        <Note/>
                    </MDBCardBody>
                </MDBCollapse>
            </MDBCard>

        )
    }
}

const mapStateToProps = store => {
    return {
        localization: store.localization
    }
}

export default connect(mapStateToProps)(Interaction);
