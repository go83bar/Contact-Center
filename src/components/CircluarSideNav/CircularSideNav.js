import React, {Component} from 'react';

import "./CircularSideNav.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faBars
} from '@fortawesome/pro-solid-svg-icons'

class CircularSideNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            mainCircleRadius: window.innerHeight * (this.props.navSize / 100),
            outerCircleRadius: window.innerHeight * (this.props.navSize / 100),
            isHovering: false
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
        window.addEventListener("resize", this.updateWindowDimensions.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions.bind(this));
    }

    openElementsHandler = () => {
        this.setState({ isHovering: true, outerCircleRadius: (this.state.mainCircleRadius) * 2.5 })
    }

    closeElementsHandler = () => {
        this.setState({ isHovering: false, outerCircleRadius: this.state.mainCircleRadius })
    }

    render() {
        const middleOfPage = this.state.windowHeight / 2;
        const isHovering = this.state.isHovering;
        const elementsLength = (this.props.elements.length + 1);
        const T = 180 / elementsLength;

        const mainCircleRadius = Math.floor(this.state.mainCircleRadius);
        const outerCircleRadius = Math.floor(this.state.outerCircleRadius);

        const elemetRadius = elementsLength <= 4 ? outerCircleRadius / 4 : outerCircleRadius / elementsLength;

        const navElements = this.props.elements.map((el, i) => {
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
            <div>
                <div className="m-cn-d"
                     style={{
                         top: isHovering ? middleOfPage - mainCircleRadius : middleOfPage - mainCircleRadius,
                         left: isHovering ? -mainCircleRadius : -mainCircleRadius - 30,
                         width: isHovering ? mainCircleRadius * 2 : mainCircleRadius * 2 - (elemetRadius),
                         height: isHovering ? mainCircleRadius * 2 : mainCircleRadius * 2 - (elemetRadius),
                         //backgroundImage: `url(${this.props.backgroundImg ? this.props.backgroundImg : ""})`,
                         backgroundColor: isHovering ? this.props.color : this.props.backgroundColor,
                         color : "red",
                         backgroundSize: "cover"
                     }}
                >HI - <FontAwesomeIcon icon={faBars} />
                </div>
                <div
                    onMouseEnter={this.openElementsHandler}
                    onMouseLeave={this.closeElementsHandler}
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

export default CircularSideNav;
