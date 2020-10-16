import React, {Component} from 'react'
import {MDBBox, MDBInput} from 'mdbreact'
import {connect} from "react-redux";

class CheckboxQuestion extends Component {

    constructor(props) {
        super(props)

        // construct array of selected answerable IDs
        const selectedItems = props.data.answers.filter( answer => {
            return answer.selected
        }).map( answer => {
            return answer.answerableId
        })

        this.state = {
            selectedItems
        }
    }

    updateCheckboxVal = clickedVal => () => {
        // add or remove clickedVal to/from selectedItems
        let newItems = []
        if (this.state.selectedItems.includes(clickedVal)) {
            newItems = this.state.selectedItems.filter(item => item !== clickedVal)
        } else {
            newItems = [...this.state.selectedItems, clickedVal]
        }

        this.setState({selectedItems: newItems}, () => this.props.updateAnswer(this.props.data.questionableId, this.state.selectedItems))

    }

    render() {
        return (
            <MDBBox className="d-flex flex-column w-100 mb-4">
                <span>{this.props.data.questionLabel}</span>
                {this.props.data.answers.map(answer => {
                    return (
                        <MDBInput type="checkbox" key={answer.answerableId}
                                  onClick={this.updateCheckboxVal(answer.answerableId)}
                                  checked={this.state.selectedItems.includes(answer.answerableId)}
                                  label={answer.answerLabel}
                                  id={"checkbox-" + answer.answerableId}
                        />
                    )
                })}
            </MDBBox>
        )
    }
}

const mapStateToProps = state => {
    return {
        localization: state.localization,
    }
}

export default connect(mapStateToProps)(CheckboxQuestion)