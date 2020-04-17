import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import "./index.css";
//import CircularSideNav from "./components/CircluarSideNav/CircularSideNav";
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Home from "./components/Home"
import NextLead from "./components/NextLead"
import Interaction from "./components/Interaction"
import Search from "./components/search/Search"
import RecentLeads from "./components/RecentLeads"
import Login from "./components/Login"
import ProtectedRoute from "./ProtectedRoute"
import Preview from "./components/Preview"
import { connect } from 'react-redux';
//import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
//import {faCircle} from "@fortawesome/pro-light-svg-icons";
//import {faHeadphones, faList, faLock, faSearch} from "@fortawesome/pro-solid-svg-icons";

class ContactCenter extends Component {
    constructor(props) {
        super(props);
//        this.logout = this.logout.bind(this)
        this.state = {
            activeItem: "1",
            toggle: false,
            windowWidth: 0,
            currentPage: '',
            sideNavToggled: false,
            breakWidth: 1400,
        };
        this.changeSkin()
    }
    toggle = tab => () => {
        if (this.state.activeItem !== tab) {
            this.setState({
                activeItem: tab
            });
        }
    }

    changeSkin() {
        document.body.className = 'black-skin';
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
/*

        <Link to="/">
                <span className="fa-layers fa-fw fa-4x">
                    <FontAwesomeIcon icon={faCircle} className={"darkIcon"}/>
                    <FontAwesomeIcon icon={faHome} transform={"shrink-8"} className={"darkIcon"}/>
                </span>
        </Link>,
            <Link to="/interaction">
                <span className="fa-layers fa-fw fa-4x">
                    <FontAwesomeIcon icon={faCircle} className={"darkIcon"}/>
                    <FontAwesomeIcon icon={faHeadphones} transform={"shrink-8"} className={"darkIcon"}/>
                </span>
            </Link>,*/

        //let location = useLocation()

        return (
            <BrowserRouter>
                <MDBContainer fluid>
                    <Switch>
                        <Route exact path="/login" component={Login}/>
                        <ProtectedRoute exact path="/" component={Home}/>
                        <ProtectedRoute exact path="/recent" component={RecentLeads}/>
                        <ProtectedRoute exact path="/search" component={Search}/>
                        <ProtectedRoute exact path="/preview" component={Preview}/>
                        <ProtectedRoute exact path="/next" component={NextLead}/>
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

