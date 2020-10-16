import React, {Component} from 'react'
import {MDBBox, MDBInput} from 'mdbreact'

class TextQuestion extends Component {

    constructor(props) {
        super(props)

        this.state = {
            textVal: props.data.value
        }
    }

    updateTextVal = (evt) => {
        this.setState({textVal: evt.target.value}, () => this.props.updateAnswer(this.props.data.questionableId, this.state.textVal))

    }

    render() {
        return (
            <MDBBox className="d-flex flex-column w-100 mb-4">
                <span>{this.props.data.questionLabel}</span>
                <MDBInput type="text"
                          onChange={this.updateTextVal}
                          value={this.state.textVal}
                          containerClass="mt-0 mb-0"
                />

            </MDBBox>
        )
    }
}


export default TextQuestion