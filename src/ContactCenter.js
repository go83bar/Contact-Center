import React, {Component} from "react";
import "./index.css";
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Home from "./components/home/Home"
import NextLead from "./components/home/NextLead"
import Interaction from "./components/interaction/Interaction"
import PasswordReset from "./components/PasswordReset"
import Login from "./components/Login"
import ProtectedRoute from "./ProtectedRoute"
import Preview from "./components/home/Preview"
import { connect } from 'react-redux';
import CacheBuster from "./CacheBuster";

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
            <CacheBuster>
                {({ loading, isLatestVersion, refreshCacheAndReload }) => {
                    if (loading) return null;
                    if (!loading && !isLatestVersion) {
                        refreshCacheAndReload();
                    }

                    return (
                <BrowserRouter className="skin-secondary-color">
                    <Switch>
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/reset" component={PasswordReset}/>
                        <ProtectedRoute exact path="/" component={Home}/>
                        <ProtectedRoute exact path="/preview" component={Preview}/>
                        <ProtectedRoute exact path="/next" component={NextLead}/>
                        <ProtectedRoute exact path="/interaction" component={Interaction}/>
                    </Switch>
                </BrowserRouter>
                    );
                }}
            </CacheBuster>
        );
    }
}
const mapStateToProps = state => {
    return {
        config : state.config
    }
}

const mapDispatchToProps = dispatch => {
    return {dispatch}
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactCenter);

