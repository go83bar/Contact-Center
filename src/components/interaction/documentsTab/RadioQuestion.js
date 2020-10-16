import React, {Component} from 'react'
import {MDBBox, MDBInput} from 'mdbreact'

class RadioQuestion extends Component {

    constructor(props) {
        super(props)

        // set selected answer as "checked" if necessary
        const selectedAnswer = props.data.answers.find( answer => {
            return answer.selected
        })

        let selectedAnswerID = undefined
        if (selectedAnswer) {
            selectedAnswerID = selectedAnswer.answerableId
        }

        this.state = {
            selectedAnswerID
        }
    }

    updateRadioVal = (newVal) => () => {
        // set selected value into state and push to document responses handler
        this.setState({selectedAnswerID: newVal}, () => this.props.updateAnswer(this.props.data.questionableId, this.state.selectedAnswerID))

    }

    render() {
        return (
            <MDBBox className="d-flex flex-column w-100 mb-4">
                <span>{this.props.data.questionLabel}</span>
                {this.props.data.answers.map(answer => {
                    return (
                        <MDBInput gap type="radio" key={answer.answerableId}
                                onClick={this.updateRadioVal(answer.answerableId)}
                                checked={answer.answerableId === this.state.selectedAnswerID}
                                label={answer.answerLabel}
                                id={"radio-" + answer.answerableId}
                        />
                    )
                })}

            </MDBBox>
        )
    }
}


export default RadioQuestion