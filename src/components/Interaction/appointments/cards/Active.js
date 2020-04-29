import React, { Component } from 'react'
import {MDBBox, MDBCard, MDBNavLink, MDBTooltip} from "mdbreact"
import { connect } from "react-redux"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendar,
    faCalendarCheck, faCalendarDay, faCalendarTimes, faCheckDouble,
    faCircle as faCircleSolid

} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";

class Active extends Component {

    constructor(props) {
        super(props)


        this.state = {
        }

    }

    render() {
        return (
            <MDBCard className='d-flex flex-row w-100 border-0 mb-3 shadow-sm'>
                <MDBBox className="d-flex backgroundColorInherit timelineCardHeader skin-border-primary f-m w-100"
                        onClick={this.toggleCollapse}
                >
                    <div className='d-flex p-1 px-3 w-100'>
                        <span className="fa-layers fa-fw fa-3x mt-2">
                            <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                            <FontAwesomeIcon icon={faCircle} className={"skin-primary-color"}/>
                            <FontAwesomeIcon icon={faCalendar} transform={"shrink-8"} className={"darkIcon"}/>
                        </span>
                        <div className="d-flex w-75 p-2 flex-column text-left">
                            <span className="f-l">Pre-Test Counseling Session</span>
                            <span className="font-weight-bold">FEB 21, <span className="font-weight-normal">12:30am</span> EST</span>
                        </div>
                        <div className="d-flex flex-row w-25 f-s justify-content-end">
                            <span className="font-weight-bold skin-primary-color f-l">RESERVED</span>
                        </div>
                    </div>
                </MDBBox>
                <MDBBox className="d-flex" style={{flex: "0 0 325px"}}>
                    <MDBTooltip material placement="top">
                        <MDBNavLink to="#"
                            className="d-flex flex-column h-100 align-items-center justify-content-center border-left p-2 skin-secondary-color"
                            onClick={this.editClick}
                            style={{ flex: "0 0 96px"}}
                        >
                            <FontAwesomeIcon icon={faCalendarDay} size="lg"/><span>Reschedule</span>
                        </MDBNavLink>
                        <div>Reschedule</div>
                    </MDBTooltip>
                    <MDBTooltip material placement="top">
                        <MDBNavLink to="#"
                            className="d-flex flex-column h-100 align-items-center justify-content-center border-left p-2 skin-secondary-color"
                            onClick={this.editClick}
                            style={{ flex: "0 0 76px"}}
                        >
                            <FontAwesomeIcon icon={faCalendarCheck} size="lg"/><span>Confirm</span>
                        </MDBNavLink>
                        <span>Confirm</span>
                    </MDBTooltip>
                    <MDBTooltip material placement="top">
                        <MDBNavLink to="#"
                                    className="d-flex flex-column h-100 align-items-center justify-content-center border-left p-2 skin-secondary-color"
                            onClick={this.editClick}
                            style={{ flex: "0 0 76px"}}
                        >
                            <FontAwesomeIcon icon={faCheckDouble} size="lg"/><span>Verify</span>
                        </MDBNavLink>
                        <span>Verify</span>
                    </MDBTooltip>
                    <MDBTooltip material placement="top">
                        <MDBNavLink to="#"
                            className="d-flex flex-column h-100 align-items-center justify-content-center border-left rounded-right p-2 skin-secondary-color"
                            onClick={this.deleteClick}
                            style={{ flex: "0 0 76px" }}
                        >
                            <FontAwesomeIcon icon={faCalendarTimes} size="lg"/><span>Cancel</span>
                        </MDBNavLink>
                        <span>Cancel</span>
                    </MDBTooltip>
                </MDBBox>
            </MDBCard>
        )
    }
}
const mapStateToProps = store => {
    return {
        localization: store.localization
    }
}

export default connect(mapStateToProps)(Active);
