import React, {useCallback, useEffect, useState} from 'react'
import {MDBBox, MDBBtn, MDBCard, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader, MDBTooltip} from "mdbreact";
import {useDispatch, useSelector} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendarCheck,
    faCircle as faCircleSolid, faGraduationCap,
    faList, faPhone,
    faSearch,
    faSignOut,
    faUserCircle
} from "@fortawesome/pro-solid-svg-icons";
import {faCircle, faClipboardList} from "@fortawesome/pro-light-svg-icons";
import RecentLeads from "./RecentLeads";
import Search from "./Search";
import Profile from "./Profile";
import {websocketDevice} from "../../websocket/WebSocketDevice"
import {TwilioDevice} from "../../twilio/TwilioDevice"
import AgentAPI from '../../api/agentAPI';
import ConnectAPI from "../../api/connectAPI";
import {Slide, toast, ToastContainer} from "react-toastify";
import * as moment from 'moment'
import AgentSchedule from "../ui/AgentSchedule";
import {Cookies} from "react-cookie";
import LockedLeadModal from "./LockedLeadModal";
import FetchNextLeadCard from "./FetchNextLeadCard";
import AgentStatCard from "./AgentStatCard";
import IncomingCallModal from "./IncomingCallModal";

const Home = (props) => {

    const localization = useSelector(state => state.localization.home)
    const toastMessages = useSelector( state => state.localization.toast.home)
    const user = useSelector( state => state.user)
    const dispatch = useDispatch();

    const [currentModal, setCurrentModal] = useState("")
    const [agentStats, setAgentStats] = useState({})
    const [lockedLead, setLockedLead] = useState({})
    const [welcome, setWelcome] = useState("")



    // generate welcome message
    const generateWelcome = useCallback(() => {
        const determinant = Math.random()
        let messageNumber = 0
        if (determinant < 0.05) {
            messageNumber = Math.floor(Math.random() * localization.welcome.length)
        }

        const messageElement = "welcomeMessage" + messageNumber
        setWelcome(localization.welcome[messageElement].replace("$", user.first_name))
    }, [localization.welcome, user.first_name])

    // function to fetch up-to-the-second stats about current user
    const pollAppStats = () => {
        const targetDate = moment().format("YYYY-MM-DD")
        AgentAPI.getAppStats(targetDate).then(response => {
            setAgentStats({
                queueCount: response.queue,
                bookingsCount: response.bookings,
                educationsCount: response.educations,
                schedule: response.schedule,
                interactionsCount: response.interactions
            })

            if (response.lockedLead !== undefined && response.lockedLead.lead_id !== undefined) {
                // there's a lead locked to this user, show the locked-lead modal
                setLockedLead(response.lockedLead)
                setCurrentModal("lockedLead")
            }
        }).catch(reason => {
            console.log("App stats poll failed: ", reason)
        })
    }

    // function to fetch user shift data
    const fetchShift = useCallback(() => {
        AgentAPI.getShiftData().then(response => {
            if (response.clients) {
                dispatch({type: 'SHIFT.LOAD', payload: response})
            } else {
                // SHIFT LOAD RETURNED A NON-POSITIVE RESULT
                toast.error(toastMessages.shiftLoadError)
            }
        }).catch(reason => {
            console.log("COULD NOT LOAD SHIFT: ", reason)
            toast.error(toastMessages.shiftLoadError)
        })

    }, [toastMessages.shiftLoadError, dispatch])

    // some first-time setup
    useEffect( () => {
        generateWelcome()
        pollAppStats()
        fetchShift()

        // sanity check if twilio connection is still open, we want to disconnect
        if (TwilioDevice.checkActiveConnection()) {
            TwilioDevice.disconnect()
        }
    }, [fetchShift, generateWelcome])


    // call stats polling function every 30 seconds
    //useInterval(pollAppStats, 30000)

    // utility function to clear modals
    const resetModals = () => {
        setCurrentModal("")
    }


    // handle log out intent
    const logout = () => {
        const cookies = new Cookies()
        cookies.remove("auth")

        ConnectAPI.logout(user.auth).then(responseJson => {
            dispatch({type: 'USER.LOG_OUT', payload: {}})
            websocketDevice.disconnect()
            TwilioDevice.cleanup()
        }).catch(error => {
            toast.error(toastMessages.logoutError)
            console.log("LOGOUT ERROR: ", error)
        })
    }


    return (
        <MDBBox className="d-flex flex-column w-100 justify-content-start skin-secondary-color px-5">

            <MDBBox className="d-flex w-100 skin-secondary-background-color skin-text align-items-center p-1 f-l">
                <MDBBox className="d-flex w-50 ml-4 align-items-center">
                    <MDBTooltip domElement tag="span" material placement="left">
                        <img src={"/images/83Bar-white.png"} alt="logo" className="img-fluid m-1 mr-4"
                             style={{height: "48px"}}/>
                        <span>{global.appVersion}</span>
                    </MDBTooltip>
                    <span>{welcome}</span>
                </MDBBox>
                <MDBBox className="d-flex justify-content-end w-50 mr-4 align-items-center">
                        <MDBBox onClick={() => setCurrentModal("profile")} className="f-xl px-3 pointer">
                                <span className="fa-layers fa-fw fa-2x m-0">
                                    <FontAwesomeIcon icon={faCircle} className={"skin-text"}/>
                                    <FontAwesomeIcon icon={faUserCircle} transform={"shrink-6"} className={"skin-text"}/>
                                </span>
                        </MDBBox>
                    <MDBBox onClick={logout} className="rounded-pill red-darken-2 p-2 px-4 pointer">
                            <span className="pr-2">
                                <FontAwesomeIcon icon={faSignOut} size="lg" className={"skin-text"}/>
                            </span><span className="skin-text">{localization.signout}</span>
                    </MDBBox>

                </MDBBox>
            </MDBBox>


            <MDBBox className="w-75 mt-3 mx-auto d-flex flex-column">
                <MDBBox className="d-flex flex-row justify-content-between flex-wrap">

                    <FetchNextLeadCard />

                    <MDBCard key="find" className="shadow-sm mt-2 px-2 py-3">
                        <MDBBox onClick={() => setCurrentModal("search")}
                              className="d-flex skin-secondary-color align-items-center mr-4 pointer">
                                <span className="fa-layers fa-fw fa-4x">
                                    <FontAwesomeIcon icon={faCircleSolid} className="skin-primary-color"/>
                                    <FontAwesomeIcon icon={faSearch} transform={"shrink-8"} className={"skin-text"}/>
                                </span>
                            <span className="ml-3">{localization.searchButtonLabel}</span>
                        </MDBBox>
                    </MDBCard>

                    <MDBCard key="recent" className="shadow-sm mt-2 px-2 py-3">
                        <MDBBox onClick={() => setCurrentModal("recentLeads")}
                              className="d-flex skin-secondary-color align-items-center mr-4 pointer">
                                <span className="fa-layers fa-fw fa-4x">
                                    <FontAwesomeIcon icon={faCircleSolid} className="skin-primary-color"/>
                                    <FontAwesomeIcon icon={faList} transform={"shrink-8"} className={"skin-text"}/>
                                </span>
                            <span className="ml-3">{localization.recentButtonLabel}</span>
                        </MDBBox>
                    </MDBCard>

                </MDBBox>

                <MDBBox className="d-flex flex-row justify-content-between mt-3 flex-wrap">
                    <AgentStatCard title={localization.queueLabel} count={agentStats.queueCount} icon={faClipboardList} />
                    <AgentStatCard title={localization.interactionsLabel} count={agentStats.interactionsCount} icon={faPhone} />
                    <AgentStatCard title={localization.bookingsLabel} count={agentStats.bookingsCount} icon={faCalendarCheck} />
                    <AgentStatCard title={localization.educationsLabel} count={agentStats.educationsCount} icon={faGraduationCap} />
                </MDBBox>

                <MDBBox className="d-flex flex-row mt-3">
                    {agentStats.schedule !== undefined && <MDBCard className="shadow-sm px-3 py-3" style={{minWidth: "335px"}}>
                        <AgentSchedule scheduleData={agentStats.schedule} />
                    </MDBCard>}
                </MDBBox>

            </MDBBox>

            <LockedLeadModal closeFunction={resetModals} leadData={lockedLead} isOpen={currentModal === "lockedLead"} />

            <RecentLeads closeFunction={resetModals} isOpen={currentModal === "recentLeads"} />

            <IncomingCallModal />

            <MDBModal isOpen={currentModal === "search"} toggle={resetModals} centered size={"lg"}>
                <MDBModalHeader toggle={resetModals}>{localization.search}</MDBModalHeader>
                <MDBModalBody className="p-0">
                    <Search/>
                </MDBModalBody>
                <MDBModalFooter className="d-flex justify-content-between">
                    <MDBBtn rounded outline onClick={resetModals}>Close</MDBBtn>
                </MDBModalFooter>
            </MDBModal>

            <MDBModal isOpen={currentModal === "profile"} toggle={resetModals} centered size={"lg"}>
                <MDBModalHeader toggle={resetModals}>{localization.profile}</MDBModalHeader>
                <MDBModalBody className="p-0">
                    <Profile reloadShift={fetchShift} onClose={resetModals}/>
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

export default Home