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


class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            password: "",
            email: "",
            pin: "",
            remember: true,
            hasErrors: false,
            errorMessage: "",
            flipped: false,
            auth : this.props.config.cookies.get("auth")
        }
        this.props.config.cookies.remove("auth")
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
        if (this.state.pin === "" && this.state.auth === undefined) {
            return
        }

        // check supplied PIN, if successful log the user in and route to the home view
        let loginMethod = this.state.auth !== undefined ?  ConnectAPI.validateAuth(this.state.auth) : ConnectAPI.login(this.state.pin, this.state.email)

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
                // initialize the Twilio Device
                TwilioDevice.bootstrap(responseJson.user.id, responseJson.auth.token)

                // initialize the websocket connection
                websocketDevice.bootstrap(responseJson.user.id, responseJson.auth.token)

                // set user and shift data into store
                this.props.dispatch({type: 'LOG_IN_USER', payload: {user: responseJson.user, auth: responseJson.auth, cookies: this.state.remember === true ? this.props.config.cookies : undefined}})
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
                            <div className={"text-left"}><MDBInput label={localization.passwordLabel} outline icon="key" iconClass={"skin-secondary-color"} type="password" className={"text-left skin-border-primary"} containerClass="my-3" onChange={this.updatePassword} /></div>
                            <div className="mb-2">
                                <MDBInput id="remember" type="checkbox" checked={this.state.remember} label={localization.remember} onChange={this.toggleRemember} className="skin-border-primary" labelClass="skin-primary-color" containerClass="p-0"/>
                            </div>
                            <MDBBtn rounded onClick={this.getPin}><h5 style={{marginBottom:"0px"}}> {localization.frontButton} <MDBIcon icon="angle-double-right" style={{marginLeft : "10px"}}/> </h5></MDBBtn>
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
                            <div className={"text-left"}><MDBInput label={localization.pinLabel} outline icon="lock" iconClass={"skin-secondary-color"} className={"text-left skin-border-primary"} containerClass="my-3" onChange={this.updatePin} /></div>
                            <MDBBtn rounded onClick={this.login}><h5 style={{marginBottom:"0px"}}> <MDBIcon icon="unlock" style={{marginRight : "10px"}}/> {localization.backButton} </h5></MDBBtn>
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
