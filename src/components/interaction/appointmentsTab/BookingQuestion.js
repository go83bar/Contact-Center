import React, { Component } from 'react'
import {MDBBox, MDBInput, MDBSelect } from 'mdbreact'
import {connect} from "react-redux";

class BookingQuestion extends Component {

   /* constructor(props) {
        super(props)
    }*/

    changeTextHandler = (evt) => {

        const valueDefault = this.props.question.response === null ? "" : this.props.question.response
        if (evt.target.value === valueDefault) {
            return
        }
        console.log("Booking response target: ", evt.target.value)

        this.callParentChangeHandler(evt.target.value)
    }

    changeSelectHandler = (values) => {
        // discard empty values
        if (values.length === 0) {
            return
        }
        // make sure anything actually changed
        let changed = false

        // might be going from zero answers to more than zero
        if (this.props.question.response.length === 0 && values.length > 0) changed = true

        // if there were existing values, check each against current values
        this.props.question.response.forEach( (answerableID, index) => {
            if (answerableID !== values[index]) changed = true
        })

        if (changed) {
            this.callParentChangeHandler(values)
        }
    }

    callParentChangeHandler = (value) => {
        this.props.changeHandler(this.props.question.id, this.props.question.setId, value)
    }

    render() {
        switch(this.props.question.type) {
            case "text":
                return (
                    <MDBBox className="w-50 p-3">
                        <p className="font-weight-bold">{this.props.question.label}</p>
                        <MDBInput type="text"
                            valueDefault={this.props.question.response === null ? "" : this.props.question.response}
                            onBlur={this.changeTextHandler}
                        />
                    </MDBBox>
                )
            case "radio":
            case "checkbox":
            case "dropdown":
                const selectOptions = this.props.question.answers.filter( answer => {
                    // only include inactive answer if it is the selected answer
                    return answer.selected || answer.active
                }).map( answer => {
                    return {
                        text: answer.text,
                        value: answer.answerable_id.toString(),
                        checked: answer.selected
                    }
                })
                const needsSearch = selectOptions.length > 8

                return (
                    <MDBBox className="w-50 p-3">
                        <p className="font-weight-bold">{this.props.question.label}</p>
                        <MDBSelect options={selectOptions}
                            search={needsSearch}
                            multiple={this.props.question.type === "checkbox"}
                            getValue={this.changeSelectHandler}
                        />
                    </MDBBox>
                )
            default:
                return (
                    <MDBBox className="w-50 p-3">
                        Unknown booking question type
                    </MDBBox>
                )
        }
    }

}

const mapStateToProps = state => {
    return {
        localization: state.localization,
    }
}

export default connect(mapStateToProps)(BookingQuestion);
