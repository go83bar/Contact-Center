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
                            <MDBNavLink className={`text-align-center skin-text p-0 py-3 ${ this.props.active && !this.props.toggle ? 'skin-primary-background-color' : ''}`}
                                        link
                                        to="#"
                                        active={this.props.active}
                                        onClick={this.props.onClick}
                                        role="tab"
                            >
                                {this.props.rotation ? <FontAwesomeIcon className={`${ this.props.active || this.props.toggle === true ? 'skin-text' : 'skin-primary-color'} fa-2x`} icon={this.props.icon} rotation={this.props.rotation}/> :
                                this.props.toggleIcon === undefined || this.props.active === false ?  <FontAwesomeIcon className={`${ this.props.active || this.props.toggle === true ? 'skin-text' : 'skin-primary-color'} fa-2x`} icon={this.props.icon} /> :
                                <span className="fa-layers fa-fw fa-2x m-0">
                                    <FontAwesomeIcon icon={this.props.icon} className={"skin-text m-0 ml-1"}/>
                                    <FontAwesomeIcon icon={this.props.toggleIcon} transform={"shrink-8"}  className={"skin-text m-0 ml-4"}/>
                                </span>}
                            </MDBNavLink>
                            {this.props.label !== '' && <div>{this.props.label}</div>}
                        </MDBTooltip>
                        :
                        <MDBNavLink className={`text-align-center skin-text p-0 py-3 ${ this.props.active&& !this.props.toggle ? 'skin-primary-background-color' : ''}`}
                                    link
                                    to="#"
                                    active={this.props.active}
                                    onClick={this.props.onClick}
                                    role="tab"
                        >
                            {this.props.rotation ? <FontAwesomeIcon className={`${ this.props.active || this.props.toggle === true ? 'skin-text' : 'skin-primary-color'} fa-2x`} icon={this.props.icon} rotation={this.props.rotation}/> :
                                this.props.toggleIcon === undefined || this.props.active === false ?  <FontAwesomeIcon className={`${ this.props.active || this.props.toggle === true ? 'skin-text' : 'skin-primary-color'} fa-2x`} icon={this.props.icon} /> :
                                    <span className="fa-layers fa-fw fa-2x m-0">
                                    <FontAwesomeIcon icon={this.props.icon} className={"skin-text m-0 ml-1"}/>
                                    <FontAwesomeIcon icon={this.props.toggleIcon} transform={"shrink-8"}  className={"skin-text m-0 ml-4"}/>
                                </span>}
                            {this.props.label !== '' && <div>{this.props.label}</div>}
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
    toggle : PropTypes.bool,
    toggleIcon : PropTypes.object,
    onClick : PropTypes.func.isRequired

}
export default SideNavItem;
