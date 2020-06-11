import React, {Component} from 'react'
import {
    MDBBox,
    MDBCard,
    MDBModal,
    MDBModalHeader, MDBModalBody, MDBModalFooter, MDBBtn
} from "mdbreact";
import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCircle as faCircleSolid,
//    faCalendarCheck,
//    faHandPaper,
//    faPhone,
    faHeadphones, faSearch, faList, faSignOut, faUserCircle
} from "@fortawesome/pro-solid-svg-icons";
import {faCircle} from "@fortawesome/pro-light-svg-icons";
import {Link} from "react-router-dom";

import { WidthProvider, Responsive } from "react-grid-layout";
import RecentLeads from "./RecentLeads";
import Search from "./search/Search";
import Profile from "./Profile";
import {websocketDevice} from "../websocket/WebSocketDevice"
import {TwilioDevice} from "../twilio/TwilioDevice"
import AgentAPI from '../api/agentAPI';
import ConnectAPI from "../api/connectAPI";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class Home extends Component {

    constructor(props) {
        super(props);
        console.log(props.shift)
        // kick off shift data load if we don't have it
        if (!props.shift.loaded) {
            AgentAPI.getShiftData().then ( response => {
                if (response.clients) {
                    props.dispatch({type: 'SHIFT.LOAD', payload: response})
                } else {
                    // SHIFT LOAD RETURNED A NON-POSITIVE RESULT
                }
            }).catch( reason => {
                console.log("COULD NOT LOAD SHIFT: ", reason)
            })
        }
        this.logout = this.logout.bind(this)
        this.toggleRecent = this.toggleRecent.bind(this)
        this.toggleSearch = this.toggleSearch.bind(this)
        this.toggleProfile = this.toggleProfile.bind(this)
        this.state = {
            showRecent : false,
            showSearch : false,
            showProfile : false
        };
    }

    logout() {
        websocketDevice.disconnect()
        TwilioDevice.cleanup()
        this.props.config.cookies.remove("auth")
        ConnectAPI.logout(this.props.user.auth).then(responseJson => {
            this.props.dispatch({type: 'LOG_OUT_USER', payload: {}})
        })
    }

    toggleRecent() {
        this.setState({showRecent : !this.state.showRecent})
    }
    toggleSearch() {
        this.setState({showSearch : !this.state.showSearch})
    }
    toggleProfile() {
        this.setState({showProfile : !this.state.showProfile})
    }

    profileClick() {

    }


    render() {
        const localization = this.props.localization.home
        return (
            <MDBBox className="d-flex flex-column w-100 justify-content-start skin-secondary-color mx-5">
                <MDBBox className="d-flex w-100 skin-secondary-background-color skin-text align-items-center p-1 f-l">
                    <MDBBox className="d-flex w-50 ml-4 align-items-center">
                        <img src={"/images/83Bar-white.png"} alt="logo" className="img-fluid m-1 mr-4"
                             style={{height: "48px"}}/>
                        <span>{localization.welcome.replace("$", this.props.user.first_name)}</span>
                    </MDBBox>
                    <MDBBox className="d-flex justify-content-end w-50 mr-4 align-items-center">
                        <Link to="#" onClick={this.toggleProfile} className="f-xl px-3">
                            <span className="fa-layers fa-fw fa-2x m-0">
                                <FontAwesomeIcon icon={faCircle} className={"skin-text"}/>
                                <FontAwesomeIcon icon={faUserCircle} transform={"shrink-6"}  className={"skin-text"}/>
                            </span>
                        </Link>
                        <Link to="#" onClick={this.logout} className="rounded-pill red-darken-2 p-2 px-4">
                            <span className="pr-2">
                                <FontAwesomeIcon icon={faSignOut} size="lg" className={"skin-text"}/>
                            </span><span className="skin-text">{localization.signout}</span>
                        </Link>

                    </MDBBox>
                </MDBBox>
                <MDBBox className="w-100 h-50 mt-3">
                    <ResponsiveReactGridLayout
                        className="layout"
                        cols={{ lg: 13, md: 10, sm: 6, xs: 4, xxs: 2 }}
                        rowHeight={30}
                        layouts={this.state.layouts}
                    >
                        <MDBCard key="fetch" className="shadow-sm px-3 py-4" data-grid={{ w: 3, h: 3, x: 1, y: 1, minW: 3, minH: 3, isResizable : false, isDraggable : false }}>
                            <Link to="/next" className="d-flex skin-secondary-color align-items-center justify-content-between">
                                <span className="fa-layers fa-fw fa-4x">
                                    <FontAwesomeIcon icon={faCircleSolid} className="skin-primary-color"/>
                                    <FontAwesomeIcon icon={faHeadphones} transform={"shrink-8"} className={"skin-text"}/>
                                </span>
                                <span className="">FETCH NEW LEAD</span>
                            </Link>
                        </MDBCard>
                        <MDBCard key="find" className="shadow-sm px-3 py-4" data-grid={{ w: 3, h: 3, x: 5, y: 1, minW: 3, minH: 3, isResizable : false, isDraggable : false  }}>
                            <Link to="#" onClick={this.toggleSearch} className="d-flex skin-secondary-color align-items-center justify-content-between">
                        <span className="fa-layers fa-fw fa-4x">
                            <FontAwesomeIcon icon={faCircleSolid} className="skin-primary-color"/>
                            <FontAwesomeIcon icon={faSearch} transform={"shrink-8"} className={"skin-text"}/>
                        </span><span>FIND A LEAD</span>
                            </Link>
                        </MDBCard>
                        <MDBCard key="recent" className="shadow-sm px-3 py-4" data-grid={{ w: 3, h: 3, x: 9, y: 1, minW: 3, minH: 3, isResizable : false, isDraggable : false  }}>
                            <Link to="#" onClick={this.toggleRecent} className="d-flex skin-secondary-color align-items-center justify-content-between">
                        <span className="fa-layers fa-fw fa-4x">
                            <FontAwesomeIcon icon={faCircleSolid} className="skin-primary-color"/>
                            <FontAwesomeIcon icon={faList} transform={"shrink-8"} className={"skin-text"}/>
                        </span><span>RECENT LEADS</span>
                            </Link>
                        </MDBCard>
                    </ResponsiveReactGridLayout>
                </MDBBox>
                <MDBModal isOpen={this.state.showRecent} toggle={this.toggleRecent} centered size={"lg"}>
                    <MDBModalHeader toggle={this.toggleRecent}>{localization.recent}</MDBModalHeader>
                    <MDBModalBody className="p-0">
                          <RecentLeads />
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn rounded color="secondary" onClick={this.toggleRecent}>Close</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
                <MDBModal isOpen={this.state.showSearch} toggle={this.toggleSearch} centered size={"lg"}>
                    <MDBModalHeader toggle={this.toggleSearch}>{localization.search}</MDBModalHeader>
                    <MDBModalBody className="p-0">
                        <Search />
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn rounded color="secondary" onClick={this.toggleSearch}>Close</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
                <MDBModal isOpen={this.state.showProfile} toggle={this.toggleProfile} centered size={"lg"}>
                    <MDBModalHeader toggle={this.toggleProfile}>{localization.profile}</MDBModalHeader>
                    <MDBModalBody className="p-0">
                        <Profile onClose={this.toggleProfile}/>
                    </MDBModalBody>
                </MDBModal>
            </MDBBox>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        localization: state.localization,
        config : state.config,
        shift: state.shift
    }
}


export default connect(mapStateToProps)(Home);
