import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {MDBBox, MDBIcon, MDBNavLink} from 'mdbreact'

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
            <MDBBox className="d-flex flex-nowrap mr-2 mb-2 border rounded skin-border-primary">
                    <MDBNavLink className={ "text-nowrap rounded " + (this.props.checked ? "skin-primary-background-color skin-text" : "backgroundColorInherit")}
                        link
                        to="#"
                        active={this.props.checked}
                        onClick={this.toggle}
                    >
                        <MDBIcon icon={this.props.icon}/> {this.props.onLabel}
                    </MDBNavLink>
                <MDBNavLink className={ "text-nowrap rounded " + (!this.props.checked ? "background-red skin-secondary-color" : "backgroundColorInherit")}
                        link
                        to="#"
                        active={!this.props.checked}
                        onClick={this.toggle}
                    >
                        <MDBIcon icon={this.props.icon}/> {this.props.offLabel}
                    </MDBNavLink>
            </MDBBox>
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
