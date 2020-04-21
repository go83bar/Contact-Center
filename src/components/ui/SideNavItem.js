import React, {Component} from 'react'
import {MDBNavItem, MDBNavLink, MDBTooltip} from 'mdbreact'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import PropTypes from 'prop-types'

class SideNavItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
                <MDBNavItem className="w-100" style={{zIndex:"10"}}>
                    {this.props.slim === true ?
                        <MDBTooltip material placement="right">
                            <MDBNavLink className={`text-align-center skin-text p-0 py-3 ${ this.props.active ? 'skin-primary-background-color' : ''}`}
                                        link
                                        to="#"
                                        active={this.props.active}
                                        onClick={this.props.onClick}
                                        role="tab"
                            >
                                {this.props.rotation ?
                                    <FontAwesomeIcon className={`${ this.props.active || this.props.label === '' ? 'skin-text' : 'skin-primary-color'} fa-2x`} icon={this.props.icon} rotation={this.props.rotation}/> :
                                    <FontAwesomeIcon className={`${ this.props.active || this.props.label === '' ? 'skin-text' : 'skin-primary-color'} fa-2x`} icon={this.props.icon} />
                                }
                            </MDBNavLink>
                            <div>{this.props.label}</div>
                        </MDBTooltip>
                        :
                        <MDBNavLink className={`text-align-center skin-text p-0 py-3 ${ this.props.active ? 'skin-primary-background-color' : ''}`}
                                    link
                                    to="#"
                                    active={this.props.active}
                                    onClick={this.props.onClick}
                                    role="tab"
                        >
                            {this.props.rotation ?
                                <FontAwesomeIcon className={`${ this.props.active || this.props.label === '' ? 'skin-text' : 'skin-primary-color'} fa-2x`} icon={this.props.icon} rotation={this.props.rotation}/> :
                                <FontAwesomeIcon className={`${ this.props.active || this.props.label === '' ? 'skin-text' : 'skin-primary-color'} fa-2x`} icon={this.props.icon} />
                            }
                            <div>{this.props.label}</div>
                        </MDBNavLink>
                    }
                </MDBNavItem>
        )

    }
}

SideNavItem.propTypes = {
    active : PropTypes.bool.isRequired,
    icon : PropTypes.object.isRequired,
    label : PropTypes.string.isRequired,
    slim : PropTypes.bool.isRequired,
    rotation : PropTypes.number,
    onClick : PropTypes.func.isRequired

}
export default SideNavItem;
