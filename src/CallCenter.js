import React, {Component} from "react";
import {
    MDBContainer,
} from "mdbreact";
import "./index.css";
//import logo from "./logo.png";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faPhoneAlt,
    faEnvelope,
    faComments,
    faTimesSquare,
    faSearch,
    faHistory,
    faVolume
} from '@fortawesome/pro-solid-svg-icons'
import SideNav from "./components/SideNav";
import TopNav from "./components/TopNav";

//const element = <FontAwesomeIcon icon={faCoffee} />

class CallCenter extends Component {

    state = {
        activeItem: "1",
        toggle: false,
        windowWidth: 0,
        currentPage: '',
        sideNavToggled: false,
        breakWidth: 1400
    };
    toggle = tab => () => {
        if (this.state.activeItem !== tab) {
            this.setState({
                activeItem: tab
            });
        }
    }

    changeSkin() {
        document.body.className = 'mdb-skin';
    }
    toggleSideNav = () => {
        if (this.state.windowWidth < this.state.breakWidth) {
            this.setState({
                sideNavToggled: !this.state.sideNavToggled
            });
        }
    };

    sidenavToggle(sidenavId) {
        /*  const sidenavNr = `sideNav${sidenavId}`
          this.setState({
              [sidenavNr]: !this.state[sidenavNr]
          });*/
    };

    render() {
        return (
            <MDBContainer>
                <SideNav
                    breakWidth={this.state.breakWidth}
                    style={{transition: 'all .3s'}}
                    triggerOpening={this.state.sideNavToggled}
                    onLinkClick={() => this.toggleSideNav()}
                />

            </MDBContainer>
        );
    }
}

export default CallCenter;
