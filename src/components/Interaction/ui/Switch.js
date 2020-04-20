import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {MDBNav, MDBNavLink} from 'mdbreact'

class Switch extends Component {

    constructor(props) {
        super(props);
        this.toggle=this.toggle.bind(this)
        this.state = {
        };
    }

    toggle() {
        this.props.onChange()
    }
    render() {
        return (
            <MDBNav pills color={this.props.checked ? "success" : "danger"} className="nav-justified ">
                    <MDBNavLink className="text-nowrap"
                        link
                        to="#"
                        active={this.props.checked}
                        onClick={this.toggle}
                    >
                        {this.props.onLabel}
                    </MDBNavLink>
                    <MDBNavLink className="text-nowrap"
                        link
                        to="#"
                        active={!this.props.checked}
                        onClick={this.toggle}
                    >
                        {this.props.offLabel}
                    </MDBNavLink>
            </MDBNav>
        )
    }
}

Switch.propTypes = {
    checked : PropTypes.bool.isRequired,
    onLabel : PropTypes.string.isRequired,
    offLabel : PropTypes.string.isRequired,
    onChange : PropTypes.func.isRequired

}
export default Switch;
