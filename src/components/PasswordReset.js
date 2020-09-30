import React, {Component} from 'react'
import {
    MDBContainer,
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBInput,
    MDBCol,
    MDBRotatingCard, MDBIcon
} from 'mdbreact';
import ConnectAPI from '../api/connectAPI'
import {connect} from 'react-redux';


class Login extends Component {

    constructor(props) {
        super(props);
        this.errorColor = "red-text"
        this.passColor = "green-text"

        this.state = {
            username: "",
            userID: 0,
            obscuredEmail: "",
            obscuredPhone: "",
            deliveryMethod: "",
            password1: "",
            password2: "",
            otuCode: "",
            hasErrors: false,
            errorMessage: "",
            rules: {
                historyRuleColor: "skin-secondary-color",
                lengthRuleColor: "skin-secondary-color",
                uppercaseRuleColor: "skin-secondary-color",
                lowercaseRuleColor: "skin-secondary-color",
                numberRuleColor: "skin-secondary-color",
                specialRuleColor: "skin-secondary-color",
                matchRuleColor: "skin-secondary-color",
            },
            passwordPassed: false,
            step1Disabled: true,
            step2Disabled: true,
            step3Disabled: true,
            loadingStep1: false,
            loadingStep2: false,
            loadingStep3: false,
            flipped: false,
            passwordUpdated: false
        }
    }

    handleKeyPress = (triggerFunction) => (e) => {
        if (e.charCode === 13 || e.keyCode === 13) {
            triggerFunction()
        }
    }

    updateEmail = (evt) => {
        this.setState({
            username: evt.target.value,
            step1Disabled: evt.target.value.length === 0
        })
    }

    generateStepButtonLabel = (condition, buttonKey) => {
        if (this.state[condition]) {
            return (
                <h5 style={{marginBottom:"0px"}}> {this.props.localization.passwordReset.workingButton} <MDBIcon icon="cog" spin style={{marginLeft : "10px"}}/> </h5>
            )
        }

        return (
            <h5 style={{marginBottom:"0px"}}> {this.props.localization.passwordReset[buttonKey]} <MDBIcon icon="angle-double-right" style={{marginLeft : "10px"}}/> </h5>
        )
    }

    getMethods = () => {
        // clear error message and disable button
        this.setState({
            hasErrors: false,
            loadingStep1: true,
            step1Disabled: true,
            obscuredPhone: "",
            obscuredEmail: "",
            deliveryMethod: ""
        })

        // send username back to API and find out which delivery methods are available
        ConnectAPI.getResetMethods(this.state.username).then( response => {
            if (response.status === "success") {
                let phone = ""
                let email = ""
                if (response.methods.email !== undefined) {
                    email = response.methods.email
                }
                if (response.methods.phone !== undefined) {
                    phone = response.methods.phone
                }
                this.setState({
                    loadingStep1: false,
                    step1Disabled: true,
                    hasErrors: false,
                    userID: response.key_id,
                    obscuredPhone: phone,
                    obscuredEmail: email
                })
            } else {
                this.setState({
                    loadingStep1: false,
                    step1Disabled: false,
                    hasErrors: true,
                    errorMessage: this.props.localization.passwordReset.invalidUserErrorMessage
                })
            }
        }).catch( error => {
            // transport error or 500 response
            this.setState({
                loadingStep1: false,
                step1Disabled: false,
                hasErrors: true,
                obscuredPhone: "",
                obscuredEmail: "",
                errorMessage: this.props.localization.passwordReset.invalidResponseErrorMessage
            })

        })
    }

    methodSelect = (methodChoice) => () => {
        this.setState({step2Disabled: false, deliveryMethod: methodChoice})
    }

    sendCode = () => {
        // clear error message and disable button
        this.setState({
            hasErrors: false,
            step2Disabled: true,
            loadingStep2: true,
        })

        // send delivery method choice to API to trigger code delivery
        ConnectAPI.sendOTUCode(this.state.userID, this.state.deliveryMethod).then( response => {
            if (response.status === "success") {
                // just need to flip the card
                this.setState({
                    loadingStep2: false,
                    flipped: true
                })
            } else {
                // this only happens if the user ID somehow became invalid, we want to go back to the beginning
                this.setState({
                    loadingStep2: false,
                    step2Disabled: false,
                    obscuredEmail: "",
                    obscuredPhone: "",
                    hasErrors: true,
                    errorMessage: this.props.localization.passwordReset.invalidUserErrorMessage
                })
            }
        }).catch( error => {
            // transport error or 500 response
            this.setState({
                loadingStep2: false,
                step2Disabled: false,
                hasErrors: true,
                obscuredPhone: "",
                obscuredEmail: "",
                errorMessage: this.props.localization.passwordReset.invalidResponseErrorMessage
            })
        })
    }

    updatePassword = (field) => (evt) => {
        let newState = {
            hasErrors: false
        }
        newState[field] = evt.target.value
        this.setState((prevState) => this.validatePasswords(prevState, newState))
    }

    updateOTU = (evt) => {
        const newState = {
            hasErrors: false,
            otuCode: evt.target.value,
        }
        this.setState((prevState) => this.validatePasswords(prevState, newState))
    }

    resendCode = () => {
        // this just means we reset to step 2
        this.setState({
            flipped: false
        })
    }

    validateCode = () => {
        this.setState({
            hasErrors: false,
            step3Disabled: true,
            loadingStep3: true
        })
        const params = {
            userID: this.state.userID,
            otu: this.state.otuCode,
            password1: this.state.password1,
            password2: this.state.password2
        }

        ConnectAPI.validateOTUCode(params).then( response => {
            const localization = this.props.localization.passwordReset
            if (response.status === "success") {
                // all good, show success message
                this.setState({passwordUpdated: true})
            } else if (response.type === "otu") {
                // OTU has expired or was incorrect
                this.setState({
                    hasErrors: true,
                    errorMessage: localization.invalidOTUResponseErrorMessage,
                    loadingStep3: false
                })
            } else {
                // there was a problem with the passwords
                let newState = {
                    hasErrors: true,
                    errorMessage: "",
                    loadingStep3: false,
                    rules: this.state.rules
                }
                switch (response.type) {
                    case "match":
                        newState.rules.matchRuleColor = this.errorColor
                        break
                    case "blacklist":
                        newState.errorMessage = localization.blacklistResponseErrorMessage
                        break
                    case "history":
                        newState.rules.historyRuleColor = this.errorColor
                        break;
                    default:
                        newState.errorMessage = localization.invalidResponseErrorMessage
                }

                this.setState(newState)
            }
        }).catch( error => {
            this.setState({
                hasErrors: true,
                loadingStep3: false,
                errorMessage: this.props.localization.passwordReset.invalidResponseErrorMessage
            })
        })
    }

    // setState callback to run after setting password or OTU field values into state
    validatePasswords = (prevState, newState) => {
        // response object
        let validatedState = {
            rules: {
                lengthRuleColor: this.passColor,
                uppercaseRuleColor: this.errorColor,
                lowercaseRuleColor: this.errorColor,
                numberRuleColor: this.errorColor,
                specialRuleColor: this.errorColor,
                matchRuleColor: this.passColor
            }
        };

        // set in password and otu fields, overriding previous state with new values if present
        validatedState.password1 = newState.password1 === undefined ? prevState.password1 : newState.password1
        validatedState.password2 = newState.password2 === undefined ? prevState.password2 : newState.password2

        // this makes this function work on both password and otuCode inputs
        validatedState.otuCode = newState.otuCode === undefined ? prevState.otuCode : newState.otuCode

        // must match
        if (validatedState.password1 !== validatedState.password2) {
            validatedState.rules.matchRuleColor = this.errorColor
        }

        // must be at least 8 chars
        if (validatedState.password1.length < 8) {
            validatedState.rules.lengthRuleColor = this.errorColor
        }

        // must obey content rules, check letter by letter
        const specialCharacters = [33,35,36,37,38,39,40,21,42,42,44,45,46,47,58,59,60,61,62,63,91,92,93,94,95,123,124,125];
        for( let i=0;i < validatedState.password1.length;i++) {
            const cc = validatedState.password1.charCodeAt(i);
            if(cc > 47 && cc < 58) {
                validatedState.rules.numberRuleColor = this.passColor
            }
            else if (cc > 64 && cc < 91) {
                validatedState.rules.uppercaseRuleColor = this.passColor
            }
            else if (cc > 96 && cc < 123) {
                validatedState.rules.lowercaseRuleColor = this.passColor
            }
            else if (specialCharacters.indexOf(cc) !== -1) {
                validatedState.rules.specialRuleColor = this.passColor
            }
        }

        // determine if password passed all checks, and set otuCode into validatedState so this function works for either
        let passwordsPassed = true

        // we aren't using key here and we like the compiler to give us green lights
        // eslint-disable-next-line
        for (const [key, value] of Object.entries(validatedState.rules)) {
            if (value !== this.passColor) passwordsPassed = false
        }
        validatedState.passwordsPassed = passwordsPassed

        // if rules are all met and there is a value for OTU, enable the save button
        validatedState.step3Disabled = !passwordsPassed || validatedState.otuCode.length === 0
        return validatedState
    }

    render() {
        const localization = this.props.localization.passwordReset

        return (
            <MDBContainer className="d-flex w-auto justify-content-center flex-row skin-secondary-color">
                <MDBRotatingCard flipped={this.state.flipped} className="text-center h-100 d-flex" style={{marginTop: "30%", width: "500px"}}>
                    <MDBCard className="face front" narrow >
                        <MDBCardImage
                            className='view view-cascade gradient-card-header skin-primary-background-color'
                            cascade
                            tag='div'
                        >
                            <MDBCol md="4" className={"offset-md-4"}><img src={"/images/83Bar-white.png"} alt="logo"
                                                                          className="img-fluid"/></MDBCol>
                            <h2 className='h2-responsive' style={{marginTop: "10px"}}>{localization.title}</h2>
                        </MDBCardImage>
                        <MDBCardBody cascade className='text-center'>
                            {this.state.obscuredEmail === "" && <div>
                                <div>{localization.instructionStep1}</div>
                                {this.state.hasErrors && <div className="danger-text">{this.state.errorMessage}</div>}
                                <div className={"text-left"}><MDBInput label={localization.emailLabel} onKeyPress={this.handleKeyPress(this.getMethods)}outline icon="user" iconClass={"skin-secondary-color"} className={"text-left skin-border-primary"} containerClass="my-3" onChange={this.updateEmail} /></div>
                                <MDBBtn rounded type="submit" onClick={this.getMethods} disabled={this.state.step1Disabled}>{this.generateStepButtonLabel("loadingStep1", "getMethodsButton")}</MDBBtn>

                            </div>}
                            {this.state.obscuredEmail !== "" && <div>
                                <div>{localization.instructionStep2}</div>
                                {this.state.hasErrors && <div className="danger-text">{this.state.errorMessage}</div>}
                                <div className={"text-left"}>
                                    <MDBInput onClick={this.methodSelect("email")}
                                              checked={this.state.deliveryMethod === "email"}
                                              label={localization.methodsEmail + this.state.obscuredEmail}
                                              type="radio"
                                              id="methodselectemail"
                                    />
                                    {this.state.obscuredPhone !== "" && <MDBInput onClick={this.methodSelect("SMS")}
                                                                                  checked={this.state.deliveryMethod === "SMS"}
                                                                                  label={localization.methodsText + this.state.obscuredPhone}
                                                                                  type="radio"
                                                                                  id="methodselectsms"
                                    />}
                                </div>
                                <MDBBtn rounded onClick={this.sendCode} disabled={this.state.step2Disabled}>{this.generateStepButtonLabel("loadingStep2", "getOTUButton")}</MDBBtn>

                            </div>}
                        </MDBCardBody>
                    </MDBCard>
                    <MDBCard className="face back" narrow >
                        <MDBCardImage
                            className='view view-cascade gradient-card-header skin-primary-background-color'
                            cascade
                            tag='div'
                        >
                            <MDBCol md="4" className={"offset-md-4"}><img src={"/images/83Bar-white.png"} alt="logo"
                                                                          className="img-fluid"/></MDBCol>
                            <h2 className='h2-responsive' style={{marginTop: "10px"}}>{localization.title}</h2>
                        </MDBCardImage>
                        <MDBCardBody cascade className="d-flex flex-column">
                            {this.state.passwordUpdated && <div className="text-center">
                                <p>{localization.thankyouMessage}</p>
                                    <MDBBtn href="/login" rounded>{localization.loginButton}</MDBBtn>
                            </div>}
                            {!this.state.passwordUpdated && <div>
                                <p>{localization.instructionStep3.replace("$", this.state.deliveryMethod)}</p>
                                <p>
                                    {localization.rulesHeadline}</p>
                                    <ul>
                                        <li className={this.state.rules.historyRuleColor}>{localization.historyRule}</li>
                                        <li className={this.state.rules.lengthRuleColor}>{localization.lengthRule}</li>
                                        <li className={this.state.rules.uppercaseRuleColor}>{localization.uppercaseRule}</li>
                                        <li className={this.state.rules.lowercaseRuleColor}>{localization.lowercaseRule}</li>
                                        <li className={this.state.rules.numberRuleColor}>{localization.numberRule}</li>
                                        <li className={this.state.rules.specialRuleColor}>{localization.specialRule}</li>
                                        <li className={this.state.rules.matchRuleColor}>{localization.matchRule}</li>
                                    </ul>
                                {this.state.hasErrors && <div className="danger-text">{this.state.errorMessage}</div>}

                                <MDBInput label={localization.password1Label} outline className={"text-left skin-border-primary"} containerClass="my-1" onChange={this.updatePassword("password1")} />
                                <MDBInput label={localization.password2Label} outline className={"text-left skin-border-primary"} containerClass="my-1" onChange={this.updatePassword("password2")} />
                                <p>{localization.otuPrompt}</p>
                                <MDBInput label={localization.otuLabel} outline className={"text-left skin-border-primary"} containerClass="my-1" onChange={this.updateOTU} />
                                <div className="d-flex flex-row justify-content-between">
                                    <MDBBtn rounded onClick={this.resendCode}>{localization.resendOTUButton}</MDBBtn>
                                    <MDBBtn rounded onClick={this.validateCode} disabled={this.state.step3Disabled}>{this.generateStepButtonLabel("loadingStep3", "validateOTUButton")}</MDBBtn>

                                </div>
                            </div>}
                        </MDBCardBody>
                    </MDBCard>
                </MDBRotatingCard>
            </MDBContainer>
        )
    }
}

const mapStateToProps = state => {
    return {
        localization: state.localization,
        config : state.config
    }
}

const mapDispatchToProps = dispatch => {
    return {dispatch}
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
