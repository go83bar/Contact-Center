import React, {Component} from 'react'
import {MDBBox, MDBBtn, MDBInput, MDBNav, MDBNavItem, MDBNavLink, MDBSelect, MDBTabContent, MDBTabPane} from "mdbreact"
import {connect} from "react-redux"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSquareFull} from "@fortawesome/pro-solid-svg-icons";
import AgentAPI from "../../api/agentAPI";
import {toast} from "react-toastify";
import String from "../../utils/String";

class Profile extends Component {

    constructor(props) {
        super(props)

        this.toggle = this.toggle.bind(this)
        this.changeSkin = this.changeSkin.bind(this)
        this.defaultPasswordRules = {
            visible: false,
            valid: true,
            matchTest: false,
            lengthTest: false,
            numbersTest: false,
            upperCaseTest: false,
            lowerCaseTest: false,
            specialCharsTest: false
        }
        this.state = {
            activeTab: "profile",
            theme: [
                {
                    text: "83Bar",
                    value: "eightthree-skin",
                    checked: document.body.className.includes("eightthree-skin")
                },
                {
                    text: "83Bar - B",
                    value: "eightthreeb-skin",
                    checked: document.body.className.includes("eightthreeb-skin")
                },
                {
                    text: "83Bar - C",
                    value: "eightthreec-skin",
                    checked: document.body.className.includes("eightthreec-skin")
                },
                {
                    text: "83Bar - D",
                    value: "eightthreed-skin",
                    checked: document.body.className.includes("eightthreed-skin")
                },
                {
                    text: "83Bar - E",
                    value: "eightthreee-skin",
                    checked: document.body.className.includes("eightthreee-skin")
                },
                {
                    text: "83Bar - F",
                    value: "eightthreef-skin",
                    checked: document.body.className.includes("eightthreef-skin")
                }
            ],
            details: {
                first_name: props.user.first_name,
                last_name: props.user.last_name,
                phone: props.user.phone,
                email: props.user.email,
                newPassword1: "",
                newPassword2: ""
            },
            passwordRules: {...this.defaultPasswordRules},
            saveButtonDisabled: false,
            skin: undefined
        }

    }

    handleFormInput = (fieldName) => (evt) => {
        const newValue = evt.target.value
        let newDetails = {...this.state.details}
        newDetails[fieldName] = newValue

        let newPasswordRules = {...this.state.passwordRules}

        // if this is password1 field, update UI to inform user of rules
        if (fieldName === "newPassword1") {
            const validationResults = String.validatePassword(newValue)
            newPasswordRules = Object.assign({}, newPasswordRules, validationResults)
        }

        // update matching password status
        if (newDetails.newPassword1 !== newDetails.newPassword2) {
            newPasswordRules.matchTest = false
        } else {
            newPasswordRules.matchTest = true
        }

        // flip visible if we need to
        newPasswordRules.visible = (newDetails.newPassword1 !== "" && newDetails.newPassword1 !== undefined)


        // set valid flag
        newPasswordRules.valid = (newPasswordRules.matchTest &&
            newPasswordRules.lengthTest &&
            newPasswordRules.lowerCaseTest &&
            newPasswordRules.upperCaseTest &&
            newPasswordRules.numbersTest &&
            newPasswordRules.specialCharsTest
        )

        // disable save button if we need to
        const saveButtonDisabled = (newDetails.newPassword1 !== "" && !newPasswordRules.valid)

        // set new values into state
        this.setState({details: newDetails, passwordRules: newPasswordRules, saveButtonDisabled})
    }

    saveProfile = () => {
        if (!this.state.passwordRules.valid) {
            return
        }

        this.setState({saveButtonDisabled: true})

        const saveParams = {
            first_name: this.state.details.first_name,
            last_name: this.state.details.last_name,
            email: this.state.details.email,
            phone: this.state.details.phone,
        }

        if (this.state.details.newPassword1 !== "" && this.state.details.newPassword1 !== undefined && this.state.passwordRules.valid) {
            saveParams.new_password = this.state.details.newPassword1
        }

        AgentAPI.updateProfile(saveParams).then(response => {
            if (response.success === "true") {
                // pop toast success
                toast.success(this.props.localization.toast.profile.infoUpdated)

                // update store with new agent data
                this.props.dispatch({
                    type: "USER.UPDATE_PROFILE",
                    data: {
                        first_name: saveParams.first_name,
                        last_name: saveParams.last_name,
                        email: saveParams.email,
                        phone: saveParams.phone
                    }
                })

                // clear password fields and enable save button
                let newDetails = {...this.state.details}
                newDetails.newPassword1 = ""
                newDetails.newPassword2 = ""
                this.setState({saveButtonDisabled: false, details: newDetails, passwordRules: this.defaultPasswordRules})
            } else {
                switch (response.error) {
                    case "blacklist":
                        toast.error(this.props.localization.toast.profile.passwordBlacklistedError)
                        break;
                    case "history":
                        toast.error(this.props.localization.toast.profile.passwordHistoryError)
                        break
                    default:
                        toast.error(this.props.localization.toast.profile.genericSaveError)
                }
            }
        })
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
                <MDBBox className="d-flex flex-column align-items-start ml-3 justify-content-between" style={{width: "284px"}}>
                    <MDBNav className="d-flex flex-column justify-content-between">
                        <div className="px-3 py-2 font-weight-bold">{localization.settings}</div>
                        <MDBNavItem>
                            <MDBNavLink
                                className={this.state.activeTab === "profile" ? "skin-primary-background-color skin-text" : "skin-secondary-color"}
                                to="#"
                                active={this.state.activeTab === "profile"}
                                onClick={() => this.toggle("profile")}
                            >
                                {localization.profile}
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem>
                            <MDBNavLink
                                className={this.state.activeTab === "schedule" ? "skin-primary-background-color skin-text" : "skin-secondary-color"}
                                to="#"
                                active={this.state.activeTab === "schedule"}
                                onClick={() => this.toggle("schedule")}
                            >
                                {localization.schedule}
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem>
                            <MDBNavLink
                                className={this.state.activeTab === "theme" ? "skin-primary-background-color skin-text" : "skin-secondary-color"}
                                to="#"
                                active={this.state.activeTab === "theme"}
                                onClick={() => this.toggle("theme")}
                            >
                                {localization.theme}
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem>
                            <MDBNavLink
                                className={this.state.activeTab === "music" ? "skin-primary-background-color skin-text" : "skin-secondary-color"}
                                to="#"
                                active={this.state.activeTab === "music"}
                                onClick={() => this.toggle("music")}
                            >
                                {localization.music}
                            </MDBNavLink>
                        </MDBNavItem>
                    </MDBNav>
                    {this.state.passwordRules.visible && <MDBBox className="pb-3 d-flex flex-column align-items-end align-self-end pr-4">
                        <span><small>{localization.rules.mustContainMessage}</small></span>
                        {["lengthTest", "upperCaseTest", "lowerCaseTest", "specialCharsTest", "numbersTest", "matchTest"].map(
                            (test) => {
                                return (
                                    <span key={test} className={this.state.passwordRules[test] ? "green-text" : "deep-orange-text"}><small>{localization.rules[test]}</small></span>

                                )
                            }
                        )}
                    </MDBBox>}
                </MDBBox>
                <MDBBox className="d-flex flex-column" style={{width: "500px", minHeight: "450px"}}>
                    <MDBTabContent className="p-3" activeItem={this.state.activeTab}>
                        <MDBTabPane tabId="profile">
                            <MDBInput
                                label={localization.account.first_name}
                                value={this.state.details.first_name}
                                onChange={this.handleFormInput('first_name')}
                            />
                            <MDBInput
                                label={localization.account.last_name}
                                value={this.state.details.last_name}
                                onChange={this.handleFormInput('last_name')}
                            />
                            <MDBInput
                                label={localization.account.phone}
                                value={this.state.details.phone}
                                onChange={this.handleFormInput('phone')}
                            />
                            <MDBInput
                                label={localization.account.email}
                                value={this.state.details.email}
                                onChange={this.handleFormInput('emaile')}
                            />
                            <MDBInput
                                label={localization.account.password}
                                type="password" value={this.state.details.newPassword1}
                                onChange={this.handleFormInput('newPassword1')}
                            />
                            {this.state.details.newPassword1.length > 0 && <MDBInput
                                label={localization.account.confirm_password}
                                type="password" value={this.state.details.newPassword2}
                                onChange={this.handleFormInput('newPassword2')}
                            />}
                        </MDBTabPane>
                        <MDBTabPane tabId="theme">
                            <MDBSelect label="Theme" options={this.state.theme} getValue={this.changeSkin}/>
                            <MDBBox className={this.state.skin}>
                                <FontAwesomeIcon icon={faSquareFull} className="skin-primary-color"/>
                                <FontAwesomeIcon icon={faSquareFull} className="skin-secondary-color"/>
                                <FontAwesomeIcon icon={faSquareFull} className="skin-accent-color"/>
                                <FontAwesomeIcon icon={faSquareFull} className="border skin-text"/>
                            </MDBBox>
                        </MDBTabPane>
                        <MDBTabPane tabId="music">
                            Coming Not As Soon ...
                        </MDBTabPane>
                        <MDBTabPane tabId="schedule">
                            Coming Soon ...
                        </MDBTabPane>
                    </MDBTabContent>
                </MDBBox>
                <MDBBox className="d-flex w-100 justify-content-between p-3">
                    <MDBBtn rounded outline color="secondary" onClick={this.props.onClose}>Close</MDBBtn>
                    {this.state.activeTab === "profile" &&
                    <MDBBtn rounded disabled={this.state.saveButtonDisabled} className="skin-primary-background-color skin-text" onClick={this.saveProfile}>Save
                        Changes</MDBBtn>}
                </MDBBox>
            </MDBBox>
        )
    }
}

const mapStateToProps = store => {
    return {
        localization: store.localization,
        user: store.user,
        config: store.config
    }
}

export default connect(mapStateToProps)(Profile);
