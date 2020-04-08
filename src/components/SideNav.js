import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { MDBSideNavCat, MDBSideNavNav, MDBSideNav, MDBSideNavLink, MDBContainer, MDBIcon, MDBBtn } from "mdbreact";

class SideNav extends Component {
    state = {
        sideNavLeft: false,
    }

    sidenavToggle = sidenavId => () => {
        const sidenavNr = `sideNav${sidenavId}`
        this.setState({
            [sidenavNr]: !this.state[sidenavNr]
        });
    };

    render() {
        return (
            <Router>
                <MDBContainer>
                    <MDBBtn onClick={this.sidenavToggle("Left")}>
                        <MDBIcon size="lg" icon="bars" />
                    </MDBBtn>
                    <MDBSideNav slim fixed triggerOpening={this.state.sideNavLeft} breakWidth={1300} className={"sideNav"}>

                        <MDBSideNavNav className={"sideNavItem"}>
                            <MDBSideNavLink to="/home" topLevel className={"sideNavItem"}>
                                <MDBIcon icon="home" size={"2x"} className="mr-2 sideNavItem"/>Home
                            </MDBSideNavLink>
                            <MDBSideNavLink to="/fetch" topLevel>
                                <MDBIcon icon="headphones" size={"2x"} className="mr-2 sideNavItem" />Fetch Next Lead
                            </MDBSideNavLink>
                            <MDBSideNavLink to="/find" topLevel>
                                <MDBIcon icon="search" size={"2x"} className="mr-2 sideNavItem" />Find a Lead
                            </MDBSideNavLink>
                            <MDBSideNavLink to="/list" topLevel >
                                <MDBIcon icon="list" size={"2x"} className="mr-2 sideNavItem" />Recent Leads
                            </MDBSideNavLink>
                        </MDBSideNavNav>
                    </MDBSideNav>
                </MDBContainer>
            </Router>
        );
    }
}

export default SideNav;
