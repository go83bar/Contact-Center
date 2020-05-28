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


//import ObjectId from '@tybys/oid'

class Login extends Component {

    constructor(props) {
        super(props);

        this.login = this.login.bind(this)
        this.getPin = this.getPin.bind(this)
        this.toggleRemember = this.toggleRemember.bind(this)
        this.state = {
            email: "",
            pin: "",
            remember: false,
            flipped: false
        }

        //console.log(new ObjectId().toString())
    }

    setPinValue(event) {
        this.setState({
            pin: event.target.value
        })
    }

    setEmailValue(event) {
        this.setState({
            email: event.target.value
        })
    }

    getPin() {
        const email = this.state.email

        ConnectAPI.getPin(email).then( (responseJson) => {
            if (responseJson.success) {
                this.setState({ flipped : true })
            } else {
                // TODO handle error with PIN fetch
            }
        })
    }
    toggleRemember(event) {
        console.log("Toggle Remember")
        this.setState({remember : !this.state.remember})
    }
    login() {
        // check supplied PIN, if successful log the user in and initiate the load of all
        // client data associated with the agent's shifts for today
        ConnectAPI.login()
            .then((responseJson) => {
                this.props.dispatch({type: 'SHIFT.LOAD',payload: {clients: responseJson.clients, outcomes: responseJson.outcomes, outcome_reasons: responseJson.outcome_reasons, phases: responseJson.phases, call_reasons: responseJson.call_reasons}})
                this.props.dispatch({type: 'LOG_IN_USER', payload: {user: responseJson.user, auth: responseJson.auth}})
                this.props.history.push("/")
            })

    }

    render() {
        const localization = this.props.localization.login
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
                            <div className={"text-left"}><MDBInput label={localization.frontPlaceholder} outline icon="envelope" iconClass={"skin-secondary-color"} className={"text-left skin-border-primary"} containerClass="my-3"/></div>
                            <div className={"text-left"}><MDBInput label={"Password"} outline icon="key" iconClass={"skin-secondary-color"} className={"text-left skin-border-primary"} containerClass="my-3"/></div>
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
                            <div className={"text-left"}><MDBInput label={localization.backPlaceholder} outline icon="lock" iconClass={"skin-secondary-color"} className={"text-left skin-border-primary"} containerClass="my-3"/></div>
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
        localization: state.localization
    }
}

const mapDispatchToProps = dispatch => {
    return {dispatch}
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
