import React, {Component} from 'react'
import {MDBBox, MDBBtn, MDBCard, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader, MDBTooltip} from "mdbreact";
import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendarCheck,
    faCircle as faCircleSolid,
    faGraduationCap,
    faHeadphones,
    faList,
    faPhone,
    faSearch,
    faSignOut,
    faUserCircle
} from "@fortawesome/pro-solid-svg-icons";
import {faCircle, faClipboardList} from "@fortawesome/pro-light-svg-icons";
import {Link} from "react-router-dom";

import RecentLeads from "./RecentLeads";
import Search from "./Search";
import Profile from "./Profile";
import {websocketDevice} from "../../websocket/WebSocketDevice"
import {TwilioDevice} from "../../twilio/TwilioDevice"
import AgentAPI from '../../api/agentAPI';
import ConnectAPI from "../../api/connectAPI";
import Slack from '../../utils/Slack';
import TwilioAPI from "../../api/twilioAPI";
import {Slide, ToastContainer} from "react-toastify";
import * as moment from 'moment'
import AgentSchedule from "../ui/AgentSchedule";


class Home extends Component {

    constructor(props) {
        super(props);
        //console.log(props.shift)
        // kick off shift data load if we don't have it
        if (!props.shift.loaded) {
            AgentAPI.getShiftData().then(response => {
                if (response.clients) {
                    props.dispatch({type: 'SHIFT.LOAD', payload: response})
                } else {
                    // SHIFT LOAD RETURNED A NON-POSITIVE RESULT
                }
            }).catch(reason => {
                console.log("COULD NOT LOAD SHIFT: ", reason)
            })
        }
        this.logout = this.logout.bind(this)
        this.toggleRecent = this.toggleRecent.bind(this)
        this.toggleSearch = this.toggleSearch.bind(this)
        this.toggleProfile = this.toggleProfile.bind(this)
        this.state = {
            showRecent: false,
            showSearch: false,
            showProfile: false,
            queueCount: undefined,
            bookingsCount: undefined,
            schedule: undefined,
            scheduleDate: moment().format("YYYY-MM-DD"),
            educationsCount: undefined,
            interactionsCount: undefined,
        };

        console.log("constructing home")

    }

    // this can be called with a specific date or on a timer, in which case we use the value in state
    pollAppStats = (targetDate) => {
        if (targetDate === undefined) {
            targetDate = this.state.scheduleDate
        }
        AgentAPI.getAppStats(targetDate).then(response => {
            this.setState({
                queueCount: response.queue,
                bookingsCount: response.bookings,
                educationsCount: response.educations,
                schedule: response.schedule,
                scheduleDate: targetDate,
                interactionsCount: response.interactions
            })
        }).catch(reason => {
            console.log("App stats poll failed: ", reason)
        })
    }

    logout() {
        websocketDevice.disconnect()
        TwilioDevice.cleanup()
        this.props.config.cookies.remove("auth")
        ConnectAPI.logout(this.props.user.auth).then(responseJson => {
            this.props.dispatch({type: 'LOG_OUT_USER', payload: {}})
        }).catch(error => {
            console.log("LOGOUT ERROR: ", error)
        })
    }

    toggleRecent() {
        this.setState({showRecent: !this.state.showRecent})
    }

    toggleSearch() {
        this.setState({showSearch: !this.state.showSearch})
    }

    toggleProfile() {
        this.setState({showProfile: !this.state.showProfile})
    }

    closeIncoming = () => {
        if (this.props.twilio.incomingCallQueue.length > 0) {
            this.props.dispatch({type: "TWILIO.INCOMING_CANCEL"})
        }
    }

    acceptIncoming = () => {
        if (this.ringAudio !== undefined) {
            this.ringAudio.pause();
        }
        if (this.props.twilio.incomingCallQueue.length > 0) {
            const callSID = this.props.twilio.incomingCallQueue[0]
            TwilioAPI.clearIncomingHold(callSID)
        }
        this.closeIncoming()
    }

    profileClick() {

    }

    componentDidMount() {
        // Perform first time pull for app stats, with slack notice if it fails
        AgentAPI.getAppStats(this.state.scheduleDate).then(response => {
            this.setState({
                queueCount: response.queue,
                bookingsCount: response.bookings,
                educationsCount: response.educations,
                schedule: response.schedule,
                interactionsCount: response.interactions
            })
        }).catch(reason => {
            Slack.sendMessage("Agent " + this.props.user.id + " could not load appstats: " + JSON.stringify(reason))
        })

        // set up refresh polling every 30 seconds
        this.pollStatsInterval = setInterval(this.pollAppStats, 30000)

    }

    componentWillUnmount() {
        // clear interval for refreshing app stats
        clearInterval(this.pollStatsInterval)
    }

    componentDidUpdate(prevProps) {
        // we can start or stop the incoming audio ring based on changes in the incomingCallQueue length
        if (prevProps.twilio.incomingCallQueue.length === 0 && this.props.twilio.incomingCallQueue.length > 0) {
            // incoming call queue has started, fire up the audio if we haven't already
            if (this.ringAudio === undefined) {
                let src = 'https://83b-audio.s3.amazonaws.com/agent/iphone_ring.wav';
                this.ringAudio = new Audio(src)
                this.ringAudio.loop = true;
            }

            // get it playing
            this.ringAudio.play();
        } else if (prevProps.twilio.incomingCallQueue.length > 0 && this.props.twilio.incomingCallQueue.length === 0) {
            // other way around, stop the music
            if (this.ringAudio !== undefined) {
                this.ringAudio.pause();
            }
        }
    }

    render() {
        const localization = this.props.localization.home
        return (
            <MDBBox className="d-flex flex-column w-100 justify-content-start skin-secondary-color px-5">

                <MDBBox className="d-flex w-100 skin-secondary-background-color skin-text align-items-center p-1 f-l">
                    <MDBBox className="d-flex w-50 ml-4 align-items-center">
                        <MDBTooltip domElement tag="span" material placement="left">
                            <img src={"/images/83Bar-white.png"} alt="logo" className="img-fluid m-1 mr-4"
                                 style={{height: "48px"}}/>
                            <span>{global.appVersion}</span>
                        </MDBTooltip>
                        <span>{localization.welcome.replace("$", this.props.user.first_name)}</span>
                    </MDBBox>
                    <MDBBox className="d-flex justify-content-end w-50 mr-4 align-items-center">
                        <MDBTooltip domElement tag="span" material placement="bottom">
                            <Link to="#" onClick={this.toggleProfile} className="f-xl px-3">
                                <span className="fa-layers fa-fw fa-2x m-0">
                                    <FontAwesomeIcon icon={faCircle} className={"skin-text"}/>
                                    <FontAwesomeIcon icon={faUserCircle} transform={"shrink-6"} className={"skin-text"}/>
                                </span>
                            </Link>
                            <span>{localization.profile}</span>
                        </MDBTooltip>
                        <Link to="#" onClick={this.logout} className="rounded-pill red-darken-2 p-2 px-4">
                            <span className="pr-2">
                                <FontAwesomeIcon icon={faSignOut} size="lg" className={"skin-text"}/>
                            </span><span className="skin-text">{localization.signout}</span>
                        </Link>

                    </MDBBox>
                </MDBBox>


                <MDBBox className="w-75 mt-3 mx-auto d-flex flex-column">
                    <MDBBox className="d-flex flex-row justify-content-between flex-wrap">
                        <MDBCard key="fetch" className="shadow-sm mt-2 px-2 py-3">
                            <Link to="/next"
                                  className="d-flex skin-secondary-color align-items-center mr-4">
                                <span className="fa-layers fa-fw fa-4x">
                                    <FontAwesomeIcon icon={faCircleSolid} className="skin-primary-color"/>
                                    <FontAwesomeIcon icon={faHeadphones} transform={"shrink-8"}
                                                     className={"skin-text"}/>
                                </span>
                                <span className="ml-3">{localization.fetchNextButtonLabel}</span>
                            </Link>
                        </MDBCard>
                        <MDBCard key="find" className="shadow-sm mt-2 px-2 py-3">
                            <Link to="#" onClick={this.toggleSearch}
                                  className="d-flex skin-secondary-color align-items-center mr-4">
                                <span className="fa-layers fa-fw fa-4x">
                                    <FontAwesomeIcon icon={faCircleSolid} className="skin-primary-color"/>
                                    <FontAwesomeIcon icon={faSearch} transform={"shrink-8"} className={"skin-text"}/>
                                </span>
                                <span className="ml-3">{localization.searchButtonLabel}</span>
                            </Link>
                        </MDBCard>
                        <MDBCard key="recent" className="shadow-sm mt-2 px-2 py-3">
                            <Link to="#" onClick={this.toggleRecent}
                                  className="d-flex skin-secondary-color align-items-center mr-4">
                                <span className="fa-layers fa-fw fa-4x">
                                    <FontAwesomeIcon icon={faCircleSolid} className="skin-primary-color"/>
                                    <FontAwesomeIcon icon={faList} transform={"shrink-8"} className={"skin-text"}/>
                                </span>
                                <span className="ml-3">{localization.recentButtonLabel}</span>
                            </Link>
                        </MDBCard>
                    </MDBBox>

                    <MDBBox className="d-flex flex-row justify-content-between mt-3 flex-wrap">
                        {this.state.queueCount !== undefined && <MDBCard key="queue" className="shadow-sm px-2 py-2 mt-1">
                            <Link to="#" className="d-flex skin-secondary-color align-items-center justify-content-between ml-3">
                                <span>{this.props.localization.home.queueLabel}: {this.state.queueCount}</span>
                                <span className="fa-layers fa-fw fa-3x">
                                    <FontAwesomeIcon icon={faCircleSolid} className="skin-secondary-color"/>
                                    <FontAwesomeIcon icon={faClipboardList} transform={"shrink-8"} className={"skin-text"}/>
                                </span>
                            </Link>
                        </MDBCard>}

                        {this.state.interactionsCount !== undefined && <MDBCard key="interactions" className="shadow-sm px-2 py-2 mt-1">
                            <Link to="#" className="d-flex skin-secondary-color align-items-center justify-content-between ml-3">
                                <span>{this.props.localization.home.interactionsLabel}: {this.state.interactionsCount}</span>
                                <span className="fa-layers fa-fw fa-3x">
                                    <FontAwesomeIcon icon={faCircleSolid} className="skin-secondary-color"/>
                                    <FontAwesomeIcon icon={faPhone} transform={"shrink-8"} className={"skin-text"}/>
                                </span>
                            </Link>
                        </MDBCard>}

                        {this.state.bookingsCount !== undefined && <MDBCard key="bookings" className="shadow-sm px-2 py-2 mt-1">
                            <Link to="#" className="d-flex skin-secondary-color align-items-center justify-content-between ml-3">
                                <span>{this.props.localization.home.bookingsLabel}: {this.state.bookingsCount}</span>
                                <span className="fa-layers fa-fw fa-3x">
                                    <FontAwesomeIcon icon={faCircleSolid} className="skin-secondary-color"/>
                                    <FontAwesomeIcon icon={faCalendarCheck} transform={"shrink-8"} className={"skin-text"}/>
                                </span>
                            </Link>
                        </MDBCard>}

                        {this.state.educationsCount !== undefined && <MDBCard key="educations" className="shadow-sm px-2 py-2 mt-1">
                            <Link to="#" className="d-flex skin-secondary-color align-items-center justify-content-between ml-3">
                                <span>{this.props.localization.home.educationsLabel}: {this.state.educationsCount}</span>
                                <span className="fa-layers fa-fw fa-3x">
                                    <FontAwesomeIcon icon={faCircleSolid} className="skin-secondary-color"/>
                                    <FontAwesomeIcon icon={faGraduationCap} transform={"shrink-8"} className={"skin-text"}/>
                                </span>
                            </Link>
                        </MDBCard>}
                    </MDBBox>
                    <MDBBox className="d-flex flex-row mt-3">
                        {this.state.schedule !== undefined && <MDBCard className="shadow-sm px-3 py-3" style={{minWidth: "335px"}}>
                                <AgentSchedule scheduleData={this.state.schedule} scheduleDate={this.state.scheduleDate}
                                               triggerPoll={this.pollAppStats}/>
                            </MDBCard>}
                    </MDBBox>
                </MDBBox>




                <MDBModal isOpen={this.state.showRecent} toggle={this.toggleRecent} centered size={"lg"}>
                    <MDBModalHeader toggle={this.toggleRecent}>{localization.recent}</MDBModalHeader>
                    <MDBModalBody className="p-0">
                        <RecentLeads/>
                    </MDBModalBody>
                    <MDBModalFooter className="d-flex justify-content-between">
                        <MDBBtn rounded outline onClick={this.toggleRecent}>Close</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
                <MDBModal isOpen={this.state.showSearch} toggle={this.toggleSearch} centered size={"lg"}>
                    <MDBModalHeader toggle={this.toggleSearch}>{localization.search}</MDBModalHeader>
                    <MDBModalBody className="p-0">
                        <Search/>
                    </MDBModalBody>
                    <MDBModalFooter className="d-flex justify-content-between">
                        <MDBBtn rounded outline onClick={this.toggleSearch}>Close</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
                <MDBModal isOpen={this.state.showProfile} toggle={this.toggleProfile} centered size={"lg"}>
                    <MDBModalHeader toggle={this.toggleProfile}>{localization.profile}</MDBModalHeader>
                    <MDBModalBody className="p-0">
                        <Profile onClose={this.toggleProfile}/>
                    </MDBModalBody>
                </MDBModal>
                <MDBModal isOpen={(this.props.twilio.incomingCallQueue.length > 0)} toggle={this.closeIncoming}
                          centered>
                    <MDBModalHeader toggle={this.closeIncoming}>{localization.incoming}</MDBModalHeader>
                    <MDBModalBody className="p-3 d-flex justify-content-between">
                        <MDBBtn rounded outline
                                onClick={this.closeIncoming}>{localization.dismissIncomingButtonLabel}</MDBBtn>

                        <Link to="/next">
                            <MDBBtn rounded
                                    onClick={this.acceptIncoming}>{localization.answerIncomingButtonLabel}</MDBBtn>
                        </Link>
                    </MDBModalBody>
                </MDBModal>
                <ToastContainer
                    position="bottom-left"
                    hideProgressBar={false}
                    newestOnTop={true}
                    autoClose={5000}
                    pauseOnHover={false}
                    transition={Slide}
                />
            </MDBBox>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        localization: state.localization,
        config: state.config,
        shift: state.shift,
        twilio: state.twilio
    }
}


export default connect(mapStateToProps)(Home);
