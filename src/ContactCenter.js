import React, {Component} from "react";
import {MDBContainer, MDBIcon} from "mdbreact";
import "./index.css";
import CircularSideNav from "./components/CircluarSideNav/CircularSideNav";
import {BrowserRouter, Switch, Route, Link} from 'react-router-dom';
//import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
//import { faHome, faHeadphones, faSearch, faList} from '@fortawesome/pro-solid-svg-icons'
import Home from "./components/Home"
import Interaction from "./components/Interaction"
import Search from "./components/search/Search"
import Recent from "./components/Recent"
import Login from "./components/Login"
import ProtectedRoute from "./ProtectedRoute"
import Preview from "./components/Preview"
import { connect } from 'react-redux';

//import SideNav from "./components/SideNav";
//import TopNav from "./components/TopNav";

//const element = <FontAwesomeIcon icon={faCoffee} />

class ContactCenter extends Component {

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
/*              <span className="fa-layers fa-fw">
                    <FontAwesomeIcon icon={faCircle} size={"4x"}/>
                    <FontAwesomeIcon icon={faHeadphones} transform={"right-8"} size={"2x"}/>
                </span>*/


        const elements = [
            <Link to="/"><MDBIcon icon={"home"} size={"2x"}/></Link>,
            <Link to="/interaction"><MDBIcon icon={"headphones"} size={"2x"}/></Link>,
            <Link to="/search"><MDBIcon icon={"search"} size={"2x"}/></Link>,
            <Link to="/recent"><MDBIcon icon={"list"} size={"2x"}/></Link>
        ]
        return (
            <BrowserRouter>
                <MDBContainer>
                    {this.props.auth.isAuthenticated && <CircularSideNav
                        backgroundImg={"/images/nav.png"}
                        backgroundColor={'#E0E0E0'}
                        color={'#7c7c7c'}
                        navSize={9}
                        elements={elements}
                        animation={''}
                        animationPeriod={0.04}
                    />}
                    <Switch>
                        <Route exact path="/login" component={Login}/>
                        <ProtectedRoute exact path="/" component={Home}/>
                        <ProtectedRoute exact path="/recent" component={Recent}/>
                        <ProtectedRoute exact path="/search" component={Search}/>
                        <ProtectedRoute exact path="/preview" component={Preview}/>
                        <ProtectedRoute exact path="/interaction" component={Interaction}/>
                    </Switch>
                </MDBContainer>
            </BrowserRouter>
        );
    }
}
const mapStateToProps = state => {
    return { auth : state.auth }
}
export default connect(mapStateToProps)(ContactCenter);

