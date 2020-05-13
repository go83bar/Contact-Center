import React, {Component} from "react";
import "./index.css";
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


class ContactCenter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeItem: "1",
            toggle: false,
            windowWidth: 0,
            currentPage: '',
            sideNavToggled: false,
            breakWidth: 1400,
        };
        let theme = this.props.config.cookies.get("theme")
        document.body.className =  theme !== undefined ? theme : 'eightthree-skin';
    }
    toggle = tab => () => {
        if (this.state.activeItem !== tab) {
            this.setState({
                activeItem: tab
            });
        }
    }

    render() {
        return (
            <BrowserRouter className="skin-secondary-color">
                <Switch>
                    <Route exact path="/login" component={Login}/>
                    <ProtectedRoute exact path="/" component={Home}/>
                    <ProtectedRoute exact path="/recent" component={RecentLeads}/>
                    <ProtectedRoute exact path="/search" component={Search}/>
                    <ProtectedRoute exact path="/preview" component={Preview}/>
                    <ProtectedRoute exact path="/next" component={NextLead}/>
                    <ProtectedRoute exact path="/interaction" component={Interaction}/>
                </Switch>
            </BrowserRouter>
        );
    }
}
const mapStateToProps = state => {
    return {
        auth : state.auth,
        config : state.config
    }
}
export default connect(mapStateToProps)(ContactCenter);

