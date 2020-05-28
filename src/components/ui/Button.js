import React, { Component } from 'react'

class Button extends Component {

    constructor(props) {
        super(props)


        this.state = {
        }

    }

    render() {
        let btnClass = "btn Ripple-parent"
        btnClass += this.props.rounded ? " btn-rounded" : ""
        switch (this.props.color) {
            case "accent":
                btnClass += " skin-accent-color"
                break
            case "secondary":
                btnClass += " skin-secondary-color"
                break
            case "text":
                btnClass += " skin-text"
                break
            default :
                btnClass += " skin-primary-color"
                break
        }
        switch (this.props.background) {
            case "accent":
                btnClass += " skin-accent-background-color"
                break
            case "secondary":
                btnClass += " skin-secondary-background-color"
                break
            case "primary":
                btnClass += " skin-primary-background-color"
                break
            default :
                btnClass += this.props.outline ? " background-transparent" : " skin-primary-background-color"
                break
        }
        switch (this.props.outline) {
            case true:
                btnClass += " btn-outline- border-button background-transparent"
                break
            case "primary":
                btnClass += " btn-outline- border-button skin-border-primary"
                break
            case "secondary":
                btnClass += " btn-outline- border-button skin-border-secondary"
                break
            case "accent":
                btnClass += " btn-outline- border-button skin-border-accent"
                break
            case "text":
                btnClass += " btn-outline- border-button skin-text"
                break
            default :
                break
        }
        return (
            <button data-test="button" type="button" className={btnClass}>

                {this.props.children}
                <div data-test="waves" className="Ripple Ripple-outline" style={{top:"0px", left: "0px", width:"0px", height:"0px"}}></div>
            </button>
        )
    }
}

export default Button;
