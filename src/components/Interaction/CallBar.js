import React, {Component} from 'react'
import {MDBBtn, MDBContainer, MDBIcon, MDBNav, MDBNavItem, MDBNavLink} from "mdbreact";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPhone} from '@fortawesome/free-solid-svg-icons'

class CallBar extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <MDBContainer>
                <MDBNav>
                    <div className={"navDescriptor"}>Lead</div>
                    <MDBNavItem>
                        <MDBNavLink to="#" className={"callNavLink"}>
                            <MDBBtn floating><MDBIcon icon={"phone"}/></MDBBtn><br/>Dial
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink to="#" className={"callNavLink"}>
                            <MDBBtn floating outline><MDBIcon icon={"hand-paper"} className={"darkIcon outlineIcon"}/></MDBBtn><br/>On Hold
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink to="#" className={"callNavLink"}>
                            <MDBBtn floating outline><MDBIcon icon={"voicemail"} className={"darkIcon outlineIcon"}/></MDBBtn><br/>Voicemail
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink to="#" className={"callNavLink"}>
                            <MDBBtn floating outline color="danger"><FontAwesomeIcon icon={faPhone} size={"lg"} transform={{rotate: 225}} className={"darkIcon"} /></MDBBtn><br/>Hang Up
                        </MDBNavLink>
                    </MDBNavItem>
                    <div className={"divider"}></div>
                    <div className={"navDescriptor"}>Me</div>
                    <MDBNavItem>
                        <MDBNavLink to="#" className={"callNavLink"}>
                            <MDBBtn floating><MDBIcon icon={"phone"}/></MDBBtn><br/>Dial
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink to="#" className={"callNavLink"}>
                            <MDBBtn floating outline><MDBIcon icon={"check"} className={"darkIcon outlineIcon"}/></MDBBtn><br/>Check
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink to="#" className={"callNavLink"}>
                            <MDBBtn floating outline><MDBIcon icon={"pause"} className={"darkIcon outlineIcon"}/></MDBBtn><br/>Pause
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink to="#" className={"callNavLink"}>
                            <MDBBtn floating outline color="danger"><FontAwesomeIcon icon={faPhone} size={"lg"} transform={{rotate: 225}} className={"darkIcon"}/></MDBBtn><br/>Hang Up
                        </MDBNavLink>
                    </MDBNavItem>
                    <div className={"divider"}></div>
                    <div className={"navDescriptor"}>Provider</div>
                    <MDBNavItem>
                        <MDBNavLink to="#" className={"callNavLink"}>
                            <MDBBtn floating><MDBIcon icon={"phone"}/></MDBBtn><br/>Dial
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink to="#" className={"callNavLink"}>
                            <MDBBtn floating outline><MDBIcon icon={"random"} className={"darkIcon outlineIcon"}/></MDBBtn><br/>Transfer
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink to="#" className={"callNavLink"}>
                            <MDBBtn floating color="danger" outline><FontAwesomeIcon icon={faPhone} size={"lg"} transform={{rotate: 225}} className={"darkIcon"}/></MDBBtn><br/>Hang Up
                        </MDBNavLink>
                    </MDBNavItem>
                </MDBNav>

            </MDBContainer>
        )
    }
}

export default CallBar;
