import React, { Component } from 'react'
import {MDBBox, MDBBtn, MDBInput, MDBNav, MDBNavItem, MDBNavLink, MDBSelect, MDBTabContent, MDBTabPane} from "mdbreact"
import { connect } from "react-redux"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
 faSquareFull
} from "@fortawesome/pro-solid-svg-icons";
class Profile extends Component {

    constructor(props) {
        super(props)

        this.toggle=this.toggle.bind(this)
        this.changeSkin=this.changeSkin.bind(this)
        this.state = {
            activeTab: "profile",
            theme: [
                {
                    text: "83Bar",
                    value: "eightthree-skin",
                    checked: document.body.className.includes("eightthree-skin") ? true : false
                },
                {
                    text: "83Bar - B",
                    value: "eightthreeb-skin",
                    checked: document.body.className.includes("eightthreeb-skin") ? true : false
                },
                {
                    text: "83Bar - C",
                    value: "eightthreec-skin",
                    checked: document.body.className.includes("eightthreec-skin") ? true : false
                },
                {
                    text: "83Bar - D",
                    value: "eightthreed-skin",
                    checked: document.body.className.includes("eightthreed-skin") ? true : false
                },
                {
                    text: "83Bar - E",
                    value: "eightthreee-skin",
                    checked: document.body.className.includes("eightthreee-skin") ? true : false
                },
                {
                    text: "83Bar - F",
                    value: "eightthreef-skin",
                    checked: document.body.className.includes("eightthreef-skin") ? true : false
                },
                {
                    text: "83Bar - G",
                    value: "eightthreeg-skin",
                    checked: document.body.className.includes("eightthreeg-skin") ? true : false
                },
                {
                    text: "Black",
                    value: "black-skin",
                    checked: document.body.className.includes("black-skin") ? true : false
                },
                {
                    text: "White",
                    value: "white-skin",
                    checked: document.body.className.includes("white-skin") ? true : false
                },
                {
                    text: "Cyan",
                    value: "cyan-skin",
                    checked: document.body.className.includes("cyan-skin") ? true : false
                },
                {
                    text: "MDB",
                    value: "mdb-skin",
                    checked: document.body.className.includes("mdb-skin") ? true : false
                },
                {
                    text: "Deep Purple",
                    value: "deep-purple-skin",
                    checked: document.body.className.includes("deep-purple-skin") ? true : false
                },
                {
                    text: "Navy Blue",
                    value: "navy-blue-skin",
                    checked: document.body.className.includes("navy-blue-skin") ? true : false
                },
                {
                    text: "Pink",
                    value: "pink-skin",
                    checked: document.body.className.includes("pink-skin") ? true : false
                },
                {
                    text: "Indigo",
                    value: "indigo-skin",
                    checked: document.body.className.includes("indigo-skin") ? true : false
                },
                {
                    text: "Light Blue",
                    value: "light-blue-skin",
                    checked: document.body.className.includes("light-blue-skin") ? true : false
                },
                {
                    text: "Grey",
                    value: "grey-skin",
                    checked: document.body.className.includes("grey-skin") ? true : false
                }
            ],
            "skin" : undefined
        }

    }

    changeSkin(value) {
        this.props.config.cookies.set("theme", value)
        document.body.className = value;
    }

    toggle(activeTab) {
        this.setState({activeTab})
    }
    render() {
        let localization = this.props.localization.profile
        return (
            <MDBBox className="d-flex flex-wrap justify-content-between">
                <MDBBox className="d-flex flex-column align-items-start ml-3" style={{width:"284px"}}>
                    <div className="px-3 py-2 font-weight-bold">{localization.settings}</div>
                    <MDBNav className="d-flex flex-column justify-content-between">
                    <MDBNavItem>
                        <MDBNavLink
                            className={this.state.activeTab === "profile" ? "skin-primary-background-color skin-text" : "skin-secondary-color"}
                            to="#"
                            active={this.state.activeTab === "profile"}
                            onClick={()=>this.toggle("profile")}
                        >
                            {localization.profile}
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink
                            className={this.state.activeTab === "schedule" ? "skin-primary-background-color skin-text" : "skin-secondary-color"}
                            to="#"
                            active={this.state.activeTab === "schedule"}
                            onClick={()=>this.toggle("schedule")}
                        >
                            {localization.schedule}
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink
                            className={this.state.activeTab === "theme" ? "skin-primary-background-color skin-text" : "skin-secondary-color"}
                            to="#"
                            active={this.state.activeTab === "theme"}
                            onClick={()=>this.toggle("theme")}
                        >
                            {localization.theme}
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink
                            className={this.state.activeTab === "music" ? "skin-primary-background-color skin-text" : "skin-secondary-color"}
                            to="#"
                            active={this.state.activeTab === "music"}
                            onClick={()=>this.toggle("music")}
                        >
                            {localization.music}
                        </MDBNavLink>
                    </MDBNavItem>
                    </MDBNav>
                </MDBBox>
                <MDBBox className="d-flex flex-column" style={{width:"500px", minHeight:"450px"}}>
                    <MDBTabContent className="p-3" activeItem={this.state.activeTab}>
                        <MDBTabPane tabId="profile">
                            <MDBInput label={localization.account.first_name} value={this.props.auth.user.first_name} />
                            <MDBInput label={localization.account.last_name} value={this.props.auth.user.last_name}/>
                            <MDBInput label={localization.account.phone} />
                            <MDBInput label={localization.account.email} />
                            <MDBInput label={localization.account.password} />
                            <MDBInput label={localization.account.confirm_password} />
                        </MDBTabPane>
                        <MDBTabPane tabId="theme">
                            <MDBSelect label="Theme" options={this.state.theme} getValue={this.changeSkin} />
                            <MDBBox className={this.state.skin}>
                                <FontAwesomeIcon icon={faSquareFull} className="skin-primary-color"/>
                                <FontAwesomeIcon icon={faSquareFull} className="skin-secondary-color"/>
                                <FontAwesomeIcon icon={faSquareFull} className="skin-accent-color"/>
                                <FontAwesomeIcon icon={faSquareFull} className="border skin-text"/>
                            </MDBBox>
                        </MDBTabPane>
                        <MDBTabPane tabId="music">
                            Coming Soon ...
                        </MDBTabPane>
                        <MDBTabPane tabId="schedule">
                            Coming Soon ...
                        </MDBTabPane>
                    </MDBTabContent>
                </MDBBox>
                <MDBBox className="d-flex w-100 justify-content-end p-3">
                    <MDBBtn rounded color="secondary" onClick={this.props.onClose}>Close</MDBBtn>
                    {this.state.activeTab === "profile" && <MDBBtn rounded className="skin-primary-background-color skin-text" onClick={this.props.onClose}>Save Changes</MDBBtn>}
                </MDBBox>
            </MDBBox>
        )
    }
}
const mapStateToProps = store => {
    return {
        localization: store.localization,
        auth : store.auth,
        config : store.config
    }
}

export default connect(mapStateToProps)(Profile);
