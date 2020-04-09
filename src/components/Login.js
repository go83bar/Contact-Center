import React, {Component} from 'react'
import {MDBBtn, MDBContainer} from "mdbreact";
import { connect } from 'react-redux';

class Login extends Component {

    constructor(props) {
        super(props);

        this.login = this.login.bind(this)
        this.state = {
        };
    }

    login() {
        this.props.dispatch({type: 'LOG_IN_USER',payload: {}})
        this.props.history.push("/") //this.props.location.state.from.pathname )
    }

    render() {
        return (
            <MDBContainer>
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
