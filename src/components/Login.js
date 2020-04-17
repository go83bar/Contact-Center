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
        this.state = {
            email: "",
            pin: "",
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
    login() {
        // check supplied PIN, if successful log the user in and initiate the load of all
        // client data associated with the agent's shifts for today
        ConnectAPI.login()
            .then((responseJson) => {
                this.props.dispatch({type: 'SHIFT.LOAD',payload: {clients: responseJson.clients}})
                this.props.dispatch({type: 'LOG_IN_USER', payload: {user: responseJson.user, auth: responseJson.auth}})
                this.props.history.push("/") 
            })

    }

    render() {
        const localization = this.props.localization.login
        return (
            <MDBContainer fluid style={{textAlign: "center"}}>
                <MDBRotatingCard flipped={this.state.flipped} className="text-center h-100 w-100" style={{margin: "0 auto", marginTop: "10%", width: "500px"}}>
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
                            <div className={"text-left"}><MDBInput label={localization.frontPlaceholder} outline icon="envelope" iconClass={"skin-secondary-color"} className={"text-left"}/></div>
                            <MDBBtn onClick={this.getPin}><h5 style={{marginBottom:"0px"}}> {localization.frontButton} <MDBIcon icon="angle-double-right" style={{marginLeft : "10px"}}/> </h5></MDBBtn>
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
                            <div className={"text-left"}><MDBInput label={localization.backPlaceholder} outline icon="lock" iconClass={"skin-secondary-color"} className={"text-left"}/></div>
                            <MDBBtn onClick={this.login}><h5 style={{marginBottom:"0px"}}> <MDBIcon icon="unlock" style={{marginRight : "10px"}}/> {localization.backButton} </h5></MDBBtn>
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
