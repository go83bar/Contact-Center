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
import {TwilioDevice} from "../twilio/TwilioDevice"
import {websocketDevice} from "../websocket/WebSocketDevice"
import {TokenRefreshDevice} from "../ auth/TokenRefreshDevice"
import Cookies from "universal-cookie";


class Login extends Component {

    constructor(props) {
        super(props);

        const cookies = new Cookies()

        this.state = {
            password: "",
            email: "",
            pin: "",
            remember: true,
            hasErrors: false,
            errorMessage: "",
            flipped: false,
            auth : cookies.get("auth")
        }

        cookies.remove("auth")
        if (this.state.auth !== undefined) this.login()
    }

    updatePin = (event) => {
        this.setState({
            pin: event.target.value
        })
    }

    updateEmail = (event) => {
        this.setState({
            email: event.target.value, auth : undefined
        })
    }

    updatePassword = (event) => {
        this.setState({
            password: event.target.value, auth : undefined
        })
    }

    handleKeyPress = (triggerFunction) => (e) => {
        if (e.charCode === 13 || e.keyCode === 13) {
            triggerFunction()
        }
    }

    getPin = () => {
        const email = this.state.email
        const pass = this.state.password
        ConnectAPI.getPin(email, pass).then( (responseJson) => {
            if (responseJson.success) {
                this.setState({ flipped : true })
            } else {
                this.setState({
                    hasErrors: true,
                    errorMessage: responseJson.error
                })
            }
        })
    }

    toggleRemember = () => {
        this.setState({remember : !this.state.remember})
    }

    login = () => {
        console.log("running login")
        if (this.state.pin === "" && this.state.auth === undefined) {
            return
        }
        console.log("auth: ", this.state.auth)
        // check supplied PIN, if successful log the user in and route to the home view
        let loginMethod = this.state.auth !== undefined ?  ConnectAPI.validateAuth(this.state.auth, false) : ConnectAPI.login(this.state.pin, this.state.email)

           loginMethod.then((responseJson) => {
                // if login failed, there will be just an empty response
                if (responseJson.user === undefined) {
                    this.setState({
                        hasErrors: true,
                        errorMessage: this.state.auth === undefined ? "Invalid PIN" : "",
                        auth : undefined,
                        flipped: false
                    })
                    return
                }
                // account for certain users
                if (responseJson.user.id === 100) {
                    console.log("A wild Centennial appears!")
                }

                // initialize the Twilio Device
                TwilioDevice.bootstrap(responseJson.user.id, responseJson.auth.token)

                // initialize the websocket connection
                websocketDevice.bootstrap(responseJson.user.id, responseJson.auth.token)

               // initialize the token refresh device
               TokenRefreshDevice.bootstrap()

               // set new auth into cookies if remember setting is set
               if (this.state.remember) {
                   const cookies = new Cookies()
                   cookies.set('auth', responseJson.auth)
               }
                // set user and shift data into store
                this.props.dispatch({type: 'LOG_IN_USER', payload: {user: responseJson.user, auth: responseJson.auth}})
                this.props.history.push("/")
            })
    }

    render() {
        const localization = this.props.localization.login
        if (this.state.auth !== undefined)
            return null
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
                            {this.state.hasErrors && <div className="danger-text">{this.state.errorMessage}</div>}
                            <div className={"text-left"}><MDBInput label={localization.emailLabel} outline icon="envelope" iconClass={"skin-secondary-color"} className={"text-left skin-border-primary"} containerClass="my-3" onChange={this.updateEmail} /></div>
                            <div className={"text-left"}><MDBInput label={localization.passwordLabel} onKeyPress={this.handleKeyPress(this.getPin)} outline icon="key" iconClass={"skin-secondary-color"} type="password" className={"text-left skin-border-primary"} containerClass="my-3" onChange={this.updatePassword} /></div>
                            <div className="mb-2">
                                <MDBInput id="remember" type="checkbox" checked={this.state.remember} label={localization.remember} onChange={this.toggleRemember} className="skin-border-primary" labelClass="skin-primary-color" containerClass="p-0"/>
                            </div>
                            <MDBBtn rounded onClick={this.getPin}><h5 style={{marginBottom:"0px"}}> {localization.frontButton} <MDBIcon icon="angle-double-right" style={{marginLeft : "10px"}}/> </h5></MDBBtn>
                            <br /><a href="/reset" rel="noopener noreferrer" className="skin-primary-color">{localization.forgotPassword}</a>
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
                        <MDBCardBody cascade className='text-center'>
                            <div className={"text-left"}><MDBInput label={localization.pinLabel} outline icon="lock" iconClass={"skin-secondary-color"} onKeyPress={this.handleKeyPress(this.login)} className={"text-left skin-border-primary"} containerClass="my-3" onChange={this.updatePin} /></div>
                            <MDBBtn rounded onClick={this.login}><h5 style={{marginBottom:"0px"}}> <MDBIcon icon="unlock" style={{marginRight : "10px"}}/> {localization.signInButton} </h5></MDBBtn>
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
