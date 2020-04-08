import React, {Component} from "react";
import {
    MDBContainer
} from "mdbreact";
import "./index.css";
import CircularSideNav from "./components/CircluarSideNav/CircularSideNav";
//import logo from "./logo.png";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faHome,
    faHeadphones,
    faSearch,
    faList
} from '@fortawesome/pro-solid-svg-icons'
import {faCircle} from "@fortawesome/pro-light-svg-icons";
//import SideNav from "./components/SideNav";
//import TopNav from "./components/TopNav";

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
                <CircularSideNav
                    backgroundImg={"/images/nav.png"}
                    backgroundColor={'#E0E0E0'}
                    color={'#7c7c7c'}
                    navSize={9}
                    elements={[
                        <span className="fa-layers fa-fw">
                            <FontAwesomeIcon icon={faCircle} size={"4x"}/>
                            <FontAwesomeIcon icon={faHome} transform={"right-7"} size={"2x"}/>
                        </span>,
                        <span className="fa-layers fa-fw">
                            <FontAwesomeIcon icon={faCircle} size={"4x"}/>
                            <FontAwesomeIcon icon={faHeadphones} transform={"right-8"} size={"2x"}/>
                        </span>,
                        <span className="fa-layers fa-fw">
                            <FontAwesomeIcon icon={faCircle} size={"4x"}/>
                            <FontAwesomeIcon icon={faSearch} transform={"right-8"} size={"2x"}/>
                        </span>,
                        <span className="fa-layers fa-fw">
                            <FontAwesomeIcon icon={faCircle} size={"4x"}/>
                            <FontAwesomeIcon icon={faList} transform={"right-8"} size={"2x"}/>
                        </span>
                    ]}
                    animation={''}
                    animationPeriod={0.04}
                />
            </MDBContainer>
        );
    }
}

export default CallCenter;
