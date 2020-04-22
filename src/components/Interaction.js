import React, {Component} from 'react'
import {MDBBox, MDBNav} from "mdbreact";
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
    faList,
    faPoll,
    faStream
} from "@fortawesome/pro-regular-svg-icons";
import LeadTabs from "./Interaction/LeadTabs";
import {faChevronRight, faUser} from "@fortawesome/pro-solid-svg-icons";

class Interaction extends Component {

    constructor(props) {
        super(props);
        this.toggleCallBar=this.toggleCallBar.bind(this)
        this.toggleNav = this.toggleNav.bind(this)
        this.toggleTab = this.toggleTab.bind(this)
        this.toggleDetails = this.toggleDetails.bind(this)
        this.state = {
            callBarVisible : true,
            slim : false,
            details : true,
            activeItem : "1"
        };

    }

    toggleCallBar() {
        this.setState({callBarVisible : !this.state.callBarVisible})
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

    render() {
        if (this.props.lead === undefined) {
            return <LoadingScreen />
        }

        let slim = this.state.slim
        let localization = this.props.localization.interaction

        return(
            <div className="d-flex w-100 skin-secondary-color">
                <MDBBox className="m-0 my-2 ml-2 border rounded skin-secondary-background-color" style={{flex: slim ? "0 0 50px" : "0 0 100px", order : 0,  fontSize:"14px"}}>
                    <MDBNav>
                        <SideNavItem active={false} toggle icon={faBars} label={""} slim={false} onClick={this.toggleNav}/>
                        <SideNavItem active={this.state.details} toggle toggleIcon={faChevronRight} icon={faUser} label={localization.details.tabTitle} slim={slim} onClick={this.toggleDetails}/>
                        <SideNavItem active={this.state.activeItem === "1"} icon={faPoll} label={localization.survey.tabTitle} rotation={90} slim={slim} onClick={this.toggleTab("1")}/>
                        <SideNavItem active={this.state.activeItem === "2"} icon={faCalendarCheck} label={localization.appointments.tabTitle} slim={slim} onClick={this.toggleTab("2")}/>
                        <SideNavItem active={this.state.activeItem === "3"} icon={faCalendarPlus} label={localization.booking.tabTitle} slim={slim} onClick={this.toggleTab("3")}/>
                        <SideNavItem active={this.state.activeItem === "4"} icon={faStream} label={localization.timeline.tabTitle} slim={slim} onClick={this.toggleTab("4")}/>
                        <SideNavItem active={this.state.activeItem === "5"} icon={faList} label={localization.queue.tabTitle} slim={slim} onClick={this.toggleTab("5")}/>
                        <SideNavItem active={this.state.activeItem === "6"} icon={faEdit} label={localization.notes.tabTitle} slim={slim} onClick={this.toggleTab("6")}/>
                        <SideNavItem active={this.state.activeItem === "7"} icon={faFile} label={localization.documents.tabTitle} slim={slim} onClick={this.toggleTab("7")}/>
                    </MDBNav>
                </MDBBox>
                <MDBBox className="d-flex m-2" style={{flex: 1, overflow:"auto", flexDirection:"column"}}>
                    <LeadSummary toggleCallBar={this.toggleCallBar} className=""/>
                    <MDBBox className="d-flex" style={{flex: 1, overflow:"auto", flexDirection:"row"}}>
                        <MDBBox className="d-flex mt-2 mr-2" style={{flex: 1, overflow:"auto", flexDirection:"column"}}>
                            {this.state.details && <LeadDetail />}
                            <LeadTabs activeTab={this.state.activeItem}/>
                        </MDBBox>
                        {this.state.callBarVisible && <CallBar toggleCallBar={this.toggleCallBar} />}

                    </MDBBox>
                </MDBBox>


            </div>
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
