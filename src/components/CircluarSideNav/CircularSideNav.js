import React, {Component} from 'react';

import "./CircularSideNav.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faBars, faHeadphones, faList, faSearch, faSignOut
} from '@fortawesome/pro-solid-svg-icons'
import {Link} from "react-router-dom";
import {faCircle} from "@fortawesome/pro-solid-svg-icons";
import {connect} from "react-redux";

class CircularSideNav extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this)
        this.state = {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            mainCircleRadius: window.innerHeight * (this.props.navSize / 100),
           // outerCircleRadius: window.innerHeight * (this.props.navSize / 100),
            outerCircleRadius: (window.innerHeight * (this.props.navSize / 100)) * 2.5,
            isHovering: true,
            elements : [
                <Link to="/next" className={"circleNavLink skin-secondary-color"}>
                <span className="fa-layers fa-fw fa-4x">
                    <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>
                    <FontAwesomeIcon icon={faHeadphones} transform={"shrink-8"} className={"skin-text"}/>
                </span><br/>FETCH NEW LEAD
                </Link>,
                <Link to="/search" className={"circleNavLink skin-secondary-color"}>
                <span className="fa-layers fa-fw fa-4x">
                    <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>
                    <FontAwesomeIcon icon={faSearch} transform={"shrink-8"} className={"skin-text"}/>
                </span><br/>FIND A LEAD
                </Link>,
                <Link to="/recent" className={"circleNavLink skin-secondary-color"}>
                <span className="fa-layers fa-fw fa-4x">
                    <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>
                    <FontAwesomeIcon icon={faList} transform={"shrink-8"} className={"skin-text"}/>
                </span><br/>RECENT LEADS
                </Link>,
                <Link to="#" onClick={this.logout} className={"circleNavLink skin-secondary-color"}>
                <span className="fa-layers fa-fw fa-4x">
                    <FontAwesomeIcon icon={faCircle} className="skin-primary-color"/>
                    <FontAwesomeIcon icon={faSignOut} transform={"shrink-8"} className={"skin-text"}/>
                </span><br/>SIGN OUT
                </Link>
            ]

        };
    }

    /*componentWillReceiveProps(props){
        console.log(props.animationPeriod);
        if(props.navSize >=0 && this.state.mainCircleRadius !== window.innerHeight * (props.navSize / 100)){
            this.setState(prevState => {
                return {
                    ...prevState,
                    mainCircleRadius: window.innerHeight * (props.navSize / 100),
                    outerCircleRadius: window.innerHeight * (props.navSize / 100)
                }
            });
        }
    }*/

    updateWindowDimensions() {
        this.setState(prevState => {
            return {
                ...prevState,
                windowWidth: window.innerWidth,
                windowHeight: window.innerHeight,
                mainCircleRadius: window.innerHeight * (this.props.navSize / 100),
                outerCircleRadius: window.innerHeight * (this.props.navSize / 100)
            };
        });
    }

    componentDidMount() {
        //window.addEventListener("resize", this.updateWindowDimensions.bind(this));
    }

    componentWillUnmount() {
        //window.removeEventListener("resize", this.updateWindowDimensions.bind(this));
    }

    openElementsHandler = () => {
        this.setState({ isHovering: true, outerCircleRadius: (this.state.mainCircleRadius) * 2.5 })
    }

    closeElementsHandler = () => {
        //this.setState({ isHovering: false, outerCircleRadius: this.state.mainCircleRadius })
    }

    logout() {
        this.props.dispatch({type: 'LOG_OUT_USER', payload: {}})
    }

    render() {

        const middleOfPage = this.state.windowHeight / 2;
        const isHovering = this.state.isHovering;
        const elementsLength = (this.state.elements.length + 1);
        const T = 180 / elementsLength;

        const mainCircleRadius = Math.floor(this.state.mainCircleRadius);
        const outerCircleRadius = Math.floor(this.state.outerCircleRadius);

        const elemetRadius = elementsLength <= 4 ? outerCircleRadius / 4 : outerCircleRadius / elementsLength;

        const navElements = this.state.elements.map((el, i) => {
            let newT = T * (i + 1);
            newT = newT <= 90 ? (90 - newT) : 360 - (newT - 90);
            const circleX = Math.round(Math.cos(Math.PI * (newT / 180)) * (outerCircleRadius - elemetRadius));
            const circleY = -Math.round(Math.sin(Math.PI * (newT / 180)) * (outerCircleRadius - elemetRadius));

            const elStyle = {
                left: isHovering ? (circleX + outerCircleRadius - elemetRadius) : mainCircleRadius,
                top: isHovering ? (circleY + outerCircleRadius - elemetRadius) : mainCircleRadius,
                width: isHovering ? elemetRadius * 2 : 0,
                height: isHovering ? elemetRadius * 2 : 0,
                cursor: "pointer",
                transitionDelay: this.props.animation === 'sequence' ? (i * (this.props.animationPeriod ? this.props.animationPeriod : 0.05)) + 's' : '0s'
            };

            const className = el.props.className ? el.props.className : '';
            return (
                <div key={i + "m-cn-e-d " + className} className={"m-cn-e-d " + className} style={elStyle}>
                    {el}
                </div>
            );
        });

        return (
            <div className="d-flex w-25">
                <div className="m-cn-d skin-primary-background-color"
                     style={{
                         top: isHovering ? middleOfPage - mainCircleRadius : middleOfPage - mainCircleRadius,
                         left: isHovering ? -mainCircleRadius : -mainCircleRadius - 30,
                         width: isHovering ? mainCircleRadius * 2 : mainCircleRadius * 2 - (elemetRadius),
                         height: isHovering ? mainCircleRadius * 2 : mainCircleRadius * 2 - (elemetRadius),
                         //backgroundImage: `url(${this.props.backgroundImg ? this.props.backgroundImg : ""})`,
                         //backgroundColor: isHovering ? this.props.color : this.props.backgroundColor,
                         //color : "red",
                         backgroundSize: "cover"
                     }}
                ><FontAwesomeIcon icon={faBars} />
                </div>
                <div
     //               onMouseEnter={this.openElementsHandler}
       //             onMouseLeave={this.closeElementsHandler}
                    style={{
                        width: outerCircleRadius * 2,
                        height: outerCircleRadius * 2,
                        top: middleOfPage - outerCircleRadius + 30,
                        left: -outerCircleRadius,
                        color : this.props.color ? this.props.color : "#000000",
                    }} className="o-cn-d">
                    {navElements}
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {dispatch}
}

export default connect(mapDispatchToProps)(CircularSideNav);
