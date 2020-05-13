import React, {Component} from 'react'
import {
    MDBBox,
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardFooter,
    MDBCardHeader,
    MDBInput,
    MDBNav,
    MDBSelect
} from "mdbreact";
import LeadSummary from "./Interaction/LeadSummary";
import LeadDetail from "./Interaction/LeadDetail";
import CallBar from "./Interaction/CallBar";
import {connect} from "react-redux";
import LoadingScreen from './LoadingScreen';
import SideNavItem from "./ui/SideNavItem";
import {
    faBars,
    faCalendarCheck,
    faCalendarPlus,
    faEdit, faFile,
    faPoll, faStream
} from "@fortawesome/pro-regular-svg-icons";
import LeadTabs from "./Interaction/LeadTabs";
import {faChevronRight, faTimes, faUser} from "@fortawesome/pro-solid-svg-icons";
import Draggable from 'react-draggable'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import MDBWysiwyg from 'mdb-react-wysiwyg'
import TimePicker from "rc-time-picker";
import moment from "moment";
import 'rc-time-picker/assets/index.css';
import {SingleDatePicker} from "react-dates"
import EndInteraction from "./Interaction/EndInteraction";

class Interaction extends Component {

    constructor(props) {
        super(props);
        this.toggleCallBar=this.toggleCallBar.bind(this)
        this.toggleEmail=this.toggleEmail.bind(this)
        this.toggleText=this.toggleText.bind(this)
        this.toggleCallback=this.toggleCallback.bind(this)
        this.toggleNav = this.toggleNav.bind(this)
        this.toggleTab = this.toggleTab.bind(this)
        this.toggleEndInteraction = this.toggleEndInteraction.bind(this)
        this.toggleDetails = this.toggleDetails.bind(this)
        this.handleDateClick = this.handleDateClick.bind(this);
        this.handleTimeClick = this.handleTimeClick.bind(this);
        this.state = {
            callBarVisible : true,
            emailVisible: false,
            textVisible: false,
            callbackVisible: false,
            endInteractionVisible : false,
            slim : false,
            details : true,
            activeItem : "1",
            date: moment(),
            time: moment().hour(0).minute(0)
        };

    }

    toggleEmail() {
        this.setState({emailVisible : !this.state.emailVisible})
    }
    toggleText() {
        this.setState({textVisible : !this.state.textVisible})
    }
    toggleCallback() {
        this.setState({callbackVisible : !this.state.callbackVisible})
    }
    toggleCallBar() {
        this.setState({callBarVisible : !this.state.callBarVisible})
    }
    toggleEndInteraction() {
        this.setState({endInteractionVisible : !this.state.endInteractionVisible})
    }

    handleDateClick(date) {
        if (date > moment().hour(0).minute(0))
            this.setState({ date : date });
    }
    handleTimeClick(value) {
        this.setState({ time : value.format('h:mm a') });
    }
    toggleNav()
    {
        this.setState({slim : !this.state.slim})
    }
    toggleDetails() {
        this.setState({details : !this.state.details})
    }
    toggleTab = tab => () => {
        if (this.state.activeItem !== tab) {
            this.setState({
                activeItem: tab
            });
        }
    }
    handleChange() {

    }
    render() {
        if (this.props.lead === undefined) {
            return <LoadingScreen />
        }

        let slim = this.state.slim
        let localization = this.props.localization.interaction

        return(
            <MDBBox className="d-flex w-100 skin-secondary-color">
                <MDBBox className="m-0 my-2 ml-2 border rounded skin-secondary-background-color" style={{flex: slim ? "0 0 50px" : "0 0 100px", order : 0,  fontSize:"14px"}}>
                    <MDBNav>
                        <SideNavItem active={false} toggle icon={faBars} label={""} slim={false} onClick={this.toggleNav}/>
                        <SideNavItem active={this.state.details} toggle toggleIcon={faChevronRight} icon={faUser} label={localization.details.tabTitle} slim={slim} onClick={this.toggleDetails}/>
                        <SideNavItem active={this.state.activeItem === "1"} icon={faPoll} label={localization.survey.tabTitle} rotation={90} slim={slim} onClick={this.toggleTab("1")}/>
                        <SideNavItem active={this.state.activeItem === "4"} icon={faStream} label={localization.timeline.tabTitle} slim={slim} onClick={this.toggleTab("4")}/>
                        <SideNavItem active={this.state.activeItem === "2"} icon={faCalendarCheck} label={localization.appointment.tabTitle} slim={slim} onClick={this.toggleTab("2")}/>
                        <SideNavItem active={this.state.activeItem === "3"} icon={faCalendarPlus} label={localization.booking.tabTitle} slim={slim} onClick={this.toggleTab("3")}/>
                        <SideNavItem active={this.state.activeItem === "6"} icon={faEdit} label={localization.notes.tabTitle} slim={slim} onClick={this.toggleTab("6")}/>
                        <SideNavItem active={this.state.activeItem === "7"} icon={faFile} label={localization.documents.tabTitle} slim={slim} onClick={this.toggleTab("7")}/>
                    </MDBNav>
                </MDBBox>
                <MDBBox className="d-flex m-2" style={{flex: 1, overflow:"auto", flexDirection:"column"}}>
                    <LeadSummary toggleCallBar={this.toggleCallBar} toggleEmail={this.toggleEmail} toggleText={this.toggleText} toggleCallback={this.toggleCallback} toggleEndInteraction={this.toggleEndInteraction} className=""/>
                    <MDBBox className="d-flex" style={{flex: 1, overflow:"auto", flexDirection:"row"}}>
                        <MDBBox className="d-flex mt-2 mr-2" style={{flex: 1, overflow:"auto", flexDirection:"column"}}>
                            {this.state.details && <LeadDetail />}
                            <LeadTabs activeTab={this.state.activeItem}/>
                        </MDBBox>
                        {this.state.callBarVisible && <CallBar toggleCallBar={this.toggleCallBar} />}

                    </MDBBox>
                </MDBBox>
                {this.state.emailVisible === true && <Draggable handle={".card-header"}>
                    <MDBCard className="rounded position-absolute shadow-lg z-3" style={{width:"650px",minHeight:"520px",right:8, top:70}}>
                        <MDBCardHeader className="skin-secondary-background-color skin-text">Send Email
                            <FontAwesomeIcon icon={faTimes} className="float-right" onClick={this.toggleEmail}/>
                        </MDBCardHeader>
                        <MDBCardBody className="px-3 py-0">
                            <MDBSelect selected={"Choose a template"} label={"Template"}/>
                            <MDBInput label="Subject"/>
                            <MDBWysiwyg />
                        </MDBCardBody>
                        <MDBCardFooter className="d-flex justify-content-end">
                            <MDBBtn rounded outline onClick={this.toggleEmail}>Cancel</MDBBtn>
                            <MDBBtn rounded onClick={this.toggleEmail}>Send</MDBBtn>
                        </MDBCardFooter>
                    </MDBCard>
                </Draggable>}
                {this.state.textVisible === true && <Draggable handle={".card-header"}>
                    <MDBCard className="rounded position-absolute shadow-lg z-3" style={{width:"650px",minHeight:"370px",right:8, top:370}}>
                        <MDBCardHeader className="skin-secondary-background-color skin-text">Send Text
                            <FontAwesomeIcon icon={faTimes} className="float-right" onClick={this.toggleText}/>
                        </MDBCardHeader>
                        <MDBCardBody className="px-3 py-0">
                            <MDBSelect selected={"Choose a template"} label={"Template"}/>
                            <div className="md-form">
                                <textarea className="md-textarea form-control" rows="3" placeholder={"Add text here."}></textarea>
                            </div>
                        </MDBCardBody>
                        <MDBCardFooter className="d-flex justify-content-end">
                            <MDBBtn outline rounded onClick={this.toggleText}>Cancel</MDBBtn>
                            <MDBBtn rounded onClick={this.toggleText}>Send</MDBBtn>
                        </MDBCardFooter>
                    </MDBCard>
                </Draggable>}
                {this.state.callbackVisible === true && <Draggable handle={".card-header"}>
                    <MDBCard className="rounded position-absolute shadow-lg z-3" style={{width:"450px",minHeight:"570px",right:193, top:70}}>
                        <MDBCardHeader className="skin-secondary-background-color skin-text">Schedule Callback
                            <FontAwesomeIcon icon={faTimes} className="float-right" onClick={this.toggleCallback}/>
                        </MDBCardHeader>
                        <MDBCardBody className="d-flex flex-column justify-content-center px-3 py-0">
                            <MDBSelect selected={"Select reason"} label={"Reason"}/>

                            <span>Date:
                            <SingleDatePicker
                                numberOfMonths={2}
                                hideKeyboardShortcutsPanel={true}
                                noBorder
                                date={this.state.date} // momentPropTypes.momentObj or null
                                onDateChange={date => this.setState({ date })} // PropTypes.func.isRequired
                                focused={this.state.focused} // PropTypes.bool
                                onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                                id="sdp" // PropTypes.string.isRequired,
                            /></span>

                            <span>Time: <TimePicker onChange={this.handleTimeClick} defaultValue={moment().hour(0).minute(0)} use12Hours format={'h:mm a'} showSecond={false} /></span>

                            <div className="md-form w-100">
                                <textarea className="md-textarea form-control" rows="3" placeholder={"Add a note if needed."}></textarea>
                            </div>
                        </MDBCardBody>
                        <MDBCardFooter className="d-flex justify-content-end">
                            <MDBBtn outline rounded onClick={this.toggleCallback}>Cancel</MDBBtn>
                            <MDBBtn rounded onClick={this.toggleCallback}>Send</MDBBtn>
                        </MDBCardFooter>
                    </MDBCard>
                </Draggable>}
                <EndInteraction active={this.state.endInteractionVisible} toggle={this.toggleEndInteraction}/>
            </MDBBox>
        )
    }

}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        localization: state.localization,
        lead : state.lead
    }
}

const mapDispatchToProps = dispatch => {
    return {dispatch}
}

export default connect(mapStateToProps, mapDispatchToProps)(Interaction);
