import React, {Component} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPoll} from '@fortawesome/pro-solid-svg-icons'
import {faCircle} from '@fortawesome/pro-light-svg-icons'

class SurveyIcon extends Component {

    render() {
        let size = "3x"
        if (this.props.size !== undefined) {
            size = this.props.size
        }
        return (
            <span className={"fa-layers fa-fw fa-" + size}>
                <FontAwesomeIcon icon={faCircle} className="skin-primary-color" />
                <FontAwesomeIcon icon={faPoll} transform={"shrink-8"} rotation={90} />
            </span>
        )
    }
}

export default SurveyIcon