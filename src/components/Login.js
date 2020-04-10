import React, {Component} from 'react'
import {
    MDBContainer,
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBInput,
    MDBCol,
    MDBRotatingCard
} from 'mdbreact';

import {connect} from 'react-redux';

//import ObjectId from '@tybys/oid'

class Login extends Component {

    constructor(props) {
        super(props);

        this.login = this.login.bind(this)
        this.getPin = this.getPin.bind(this)
        this.state = {
            flipped: false
        }
        //console.log(new ObjectId().toString())
    }

    getPin() {
        this.setState({ flipped : true })
    }
    login() {
        this.props.dispatch({type: 'LOG_IN_USER', payload: {}})
        this.props.history.push("/") //this.props.location.state.from.pathname )
    }

    render() {
        const localization = this.props.localization.login
        return (
            <MDBContainer fluid style={{textAlign: "center"}}>
                <MDBRotatingCard flipped={this.state.flipped} className="text-center h-100 w-100" style={{margin: "0 auto", marginTop: "20%", width: "500px"}}>
                    <MDBCard className="face front" narrow >
                        <MDBCardImage
                            className='view view-cascade gradient-card-header aqua-gradient'
                            cascade
                            tag='div'
                        >
                            <MDBCol md="4" className={"offset-md-4"}><img src={"/images/83Bar-white.png"} alt="logo"
                                                                          className="img-fluid"/></MDBCol>
                            <h2 className='h2-responsive' style={{marginTop: "10px"}}>{localization.title}</h2>
                        </MDBCardImage>
                        <MDBCardBody cascade className='text-center'>
                            <div className={"text-left"}><MDBInput label={localization.frontPlaceholder} outline icon="mobile" className={"text-left"}/></div>
                            <MDBBtn onClick={this.getPin}>{localization.frontButton}</MDBBtn>
                        </MDBCardBody>
                    </MDBCard>
                    <MDBCard className="face back" narrow >
                        <MDBCardImage
                            className='view view-cascade gradient-card-header aqua-gradient'
                            cascade
                            tag='div'
                        >
                            <MDBCol md="4" className={"offset-md-4"}><img src={"/images/83Bar-white.png"} alt="logo"
                                                                          className="img-fluid"/></MDBCol>
                            <h2 className='h2-responsive' style={{marginTop: "10px"}}>{localization.title}</h2>
                        </MDBCardImage>
                        <MDBCardBody cascade className='text-center'>
                            <div className={"text-left"}><MDBInput label={localization.backPlaceholder} outline icon="lock" className={"text-left"}/></div>
                            <MDBBtn onClick={this.login}>{localization.backButton}</MDBBtn>
                        </MDBCardBody>
                    </MDBCard>
                </MDBRotatingCard>
            </MDBContainer>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        localization: state.localization
    }
}

const mapDispatchToProps = dispatch => {
    return {dispatch}
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
