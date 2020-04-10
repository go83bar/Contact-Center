import React, {Component} from 'react'
import {MDBBtn, MDBContainer} from "mdbreact";
import { connect } from 'react-redux';
import ObjectID from "bson-objectid";
import ObjectId from '@tybys/oid'

class Login extends Component {

    constructor(props) {
        super(props);

        this.login = this.login.bind(this)
        this.state = {
        };
        for (var i = 0; i<10; i++) {
            console.log(ObjectID.generate())
        }
        console.log("New Oid Generator")
        for (i = 0; i<10; i++) {
            console.log(new ObjectId().toString())
        }
     }

    login() {
        this.props.dispatch({type: 'LOG_IN_USER',payload: {}})
        this.props.history.push("/") //this.props.location.state.from.pathname )
    }

    render() {
        return (
            <MDBContainer fluid>
                <div>Login</div>
                <MDBBtn onClick={this.login}>Login</MDBBtn>
            </MDBContainer>        )
    }
}
const mapStateToProps = state => {
    return { auth: state.auth }
}

const mapDispatchToProps = dispatch => {
    return {
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
