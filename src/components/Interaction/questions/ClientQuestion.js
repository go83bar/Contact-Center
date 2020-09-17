import React, { Component } from 'react'
import {MDBBox, MDBInput, MDBSelect } from 'mdbreact'
import {connect} from "react-redux";

class ClientQuestion extends Component {

    changeTextHandler = (evt) => {
        this.callParentChangeHandler(evt.target.value)
    }

    changeSelectHandler = (values) => {
        this.callParentChangeHandler(values)
    }

    callParentChangeHandler = (value) => {
        this.props.changeHandler(this.props.question.id, value)
    }

    render() {
        switch(this.props.question.type) {
            case "text":
                return (
                    <MDBBox className="w-50 p-3">
                        <p className="font-weight-bold">{this.props.question.label}</p>
                        <MDBInput type="text"
                            valueDefault={this.props.question.answer}
                            onBlur={this.changeTextHandler}
                        />
                    </MDBBox>
                )
            case "radio":
            case "checkbox":
            case "dropdown":
                const selectOptions = this.props.question.answers.map( answer => {
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
                        Unknown client question type: {this.props.question.id}
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

export default connect(mapStateToProps)(ClientQuestion);
