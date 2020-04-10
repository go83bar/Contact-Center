import React, {Component} from 'react'
import {MDBBtn, MDBContainer} from "mdbreact";
import { connect } from 'react-redux';
//import ObjectId from '@tybys/oid'

class Login extends Component {

    constructor(props) {
        super(props);

        this.login = this.login.bind(this)
        this.state = {
        };
        //console.log(new ObjectId().toString())
     }

    login() {
        this.props.dispatch({type: 'LOG_IN_USER',payload: {}})
        this.props.history.push("/") //this.props.location.state.from.pathname )
    }

    render() {
        return (
            <MDBContainer fluid>
                <div>{this.props.localization.name}</div>
                <MDBBtn onClick={this.login}>Login</MDBBtn>
            </MDBContainer>
        )
    }
}
const mapStateToProps = state => {
    return { auth: state.auth, localization : state.localization }
}

const mapDispatchToProps = dispatch => { return { dispatch }}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
