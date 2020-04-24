import React, {Component} from 'react'
import {
    MDBBox,
    MDBNav,
    MDBNavItem,
    MDBNavLink
} from "mdbreact";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPhone} from '@fortawesome/free-solid-svg-icons'
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import {
    faCheck,
    faCircle as faCircleSolid,
    faPause,
    faVoicemail,
    faRandom,
    faHandPaper,
    faAngleUp, faTh
} from "@fortawesome/pro-solid-svg-icons";

class CallBar extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <MDBBox className="rounded p-0 mt-2 border float-right skin-border-primary skin-primary-faint-background-color callBar" style={{flex:"0 0 180px", order:2}}>
                <MDBNav className="">
                    <div className={"font-weight-bolder p-0 text-align-center w-100 "} onClick={this.props.toggleCallBar}>
                        <FontAwesomeIcon icon={faAngleUp} size={"2x"} className="skin-secondary-color"/>
                    </div>
                    <div className={"font-weight-bolder p-0 pb-1 mt-1 text-align-center w-100 "}>Lead</div>
                    <MDBNavItem className="w-50 pb-2">
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="skin-primary-color"/>
                                <FontAwesomeIcon icon={faPhone} transform={"shrink-10"} className={"skin-text"}/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>Dial</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className="w-50 pb-2">
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>
                                <FontAwesomeIcon icon={faHandPaper} transform={"shrink-10"} className={"skin-secondary-color"}/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>On Hold</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className="w-50 pb-2">
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>

                                <FontAwesomeIcon icon={faVoicemail} transform={"shrink-10"} className={"skin-secondary-color"}/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>Voicemail</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className="w-50 pb-2">
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className="text-danger"/>
                                <FontAwesomeIcon icon={faPhone} transform={{rotate:225}} className={"skin-secondary-color"} style={{fontSize:"20px"}}/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>Hang Up</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <div className={"font-weight-bolder p-0 pb-1 mt-0 text-align-center w-100"}><hr className="mt-0 mb-2 w-75 skin-primary-background-color"/>Me</div>
                    <MDBNavItem className="w-50 pb-2">
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="skin-primary-color"/>
                                <FontAwesomeIcon icon={faPhone} transform={"shrink-10"} className={"skin-text"}/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>Dial</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className="w-50 pb-2">
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>
                                <FontAwesomeIcon icon={faCheck} transform={"shrink-10"} className={"skin-secondary-color"}/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>Check</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className="w-50 pb-2">
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>
                                <FontAwesomeIcon icon={faPause} transform={"shrink-10"} className={"skin-secondary-color"}/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>Pause</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className="w-50 pb-2">
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className="text-danger"/>
                                <FontAwesomeIcon icon={faPhone} transform={{rotate:225}} className={"skin-secondary-color"} style={{fontSize:"20px"}}/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>Hang Up</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className="w-100 pb-2">
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>
                                <FontAwesomeIcon icon={faTh} className={"skin-secondary-color"} style={{fontSize:"20px"}}/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>Keypad</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <div className={"font-weight-bolder p-0 pb-1 mt-0 text-align-center w-100"}><hr className="mt-0 mb-2 w-75 skin-primary-background-color"/>Provider</div>
                    <MDBNavItem className="w-50 pb-2">
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="skin-primary-color"/>
                                <FontAwesomeIcon icon={faPhone} transform={"shrink-10"} className={"skin-text"}/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>Dial</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className="w-50 pb-2">
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>
                                <FontAwesomeIcon icon={faRandom} transform={"shrink-10"} className={"skin-secondary-color"}/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>Transfer</span>
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem className="w-100 pb-2">
                        <MDBNavLink to="#" className={"text-align-center p-0"}>
                            <span className="fa-layers fa-fw fa-3x">
                                <FontAwesomeIcon icon={faCircleSolid} className="text-white"/>
                                <FontAwesomeIcon icon={faCircle} className="text-danger"/>
                                <FontAwesomeIcon icon={faPhone} transform={{rotate:225}} className={"skin-secondary-color"} style={{fontSize:"20px"}}/>
                            </span>
                            <span className="callBarText skin-secondary-color"><br/>Hang Up</span>
                        </MDBNavLink>
                    </MDBNavItem>
                </MDBNav>
            </MDBBox>
        )
    }
}

export default CallBar;
