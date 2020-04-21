import React, {Component} from 'react'

class ScrollLink extends Component {

    render() {
        let passedClasses = ""
        if (this.props.className !== undefined) {
            passedClasses = " " + this.props.className
        }

        return (
            <a className={"scroll-link" + passedClasses} href={"#" + this.props.target}>
                {this.props.children}
            </a>
        )
    }
}

export default ScrollLink