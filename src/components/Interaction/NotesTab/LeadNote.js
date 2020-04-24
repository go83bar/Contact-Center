import React, {Component} from 'react'
import { MDBBox } from "mdbreact";
import {connect} from "react-redux";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faComment, faEdit, faTrashAlt} from '@fortawesome/pro-solid-svg-icons'
import {faCircle} from '@fortawesome/pro-light-svg-icons'
import * as moment from 'moment'

class LeadNote extends Component {

    constructor(props) {
        super(props);


        this.state = {
        };

        this.editClick = this.editClick.bind(this)
        this.deleteClick = this.deleteClick.bind(this)

    }

    editClick() {
        this.props.onEdit(this.props.note.id)
    }

    deleteClick() {
        this.props.deleteNote(this.props.note.id)
    }

    render() {
        return (
            <MDBBox className="d-flex align-items-center mb-3 yellow rounded lighten-5 w-100">
                <MDBBox className="d-flex align-items-start w-100 p-3">
                    <span className={"fa-layers fa-fw fa-3x"} style={{ flex: "0 0 48px" }}>
                        <FontAwesomeIcon icon={faCircle} color="#FFa000" />
                        <FontAwesomeIcon icon={faComment} transform={"shrink-8"} />
                    </span>
                    <MDBBox className="flex-1 ml-3">
                        <strong>{this.props.note.created_by}</strong> <br />
                        {this.props.note.content}
                    </MDBBox>
                    <MDBBox className="survey-thumb-date text-right" style={{ flex: "0 0 15%" }}>
                        <strong>{moment(this.props.note.created_at).format("MMM D, YYYY")}</strong>
                        &nbsp;{moment(this.props.note.created_at).format("h:mm a")}
                    </MDBBox>
                </MDBBox>
                {this.props.note.interaction_id === this.props.interaction.id && (
                    <MDBBox className="noteButtons">
                        <MDBBox 
                            className="noteButtonEdit" 
                            onClick={this.editClick}
                            style={{ flex: "0 0 48px"}}
                            >
                            <FontAwesomeIcon icon={faEdit} transform={"shrink-2"} />
                        </MDBBox>
                        <MDBBox 
                            className="noteButtonDelete w-100 h-100 rounded-right" 
                            onClick={this.deleteClick}
                            style={{ flex: "0 0 48px" }}
                            >
                            <FontAwesomeIcon icon={faTrashAlt} transform={"shrink-2"} />
                        </MDBBox>

                    </MDBBox>
                )}
            </MDBBox>
        )
    }
}
const mapStateToProps = store => {
    return {
        localization: store.localization,
        interaction: store.interaction
    }
}


export default connect(mapStateToProps)(LeadNote);
