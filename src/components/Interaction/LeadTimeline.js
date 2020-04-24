import React, {Component} from 'react'
import {
    MDBBox,
    MDBCardHeader,
    MDBCardBody,
    MDBCard, MDBChip, MDBStepper, MDBStep, MDBCollapse, MDBIcon, MDBCollapseHeader

} from "mdbreact";

import TimelineTouchpoints from "./timeline/TimelineTouchpoints";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelopeOpen} from "@fortawesome/pro-solid-svg-icons";

class LeadTimeline extends Component {

    constructor(props) {
        super(props);
        this.state = {
            CollapseID: "collapse1"
        };
    }
    toggleCollapse = collapseID => () =>
        this.setState(prevState => ({
            collapseID: prevState.collapseID !== collapseID ? collapseID : ""
        }));

    render() {
        const { collapseID } = this.state;
        return (
            <MDBBox className="d-flex flex-row overflow-auto flex-1 p-0 m-0 w-auto">
                        <TimelineTouchpoints/>
                        <MDBCard className="d-flex order-1 overflow-auto w-100 border-0">
                            <MDBCardHeader className="card-header-no-back-no-border bg-white">
                                <span>All</span><span>All Interactions</span><span>Call</span>
                                <span>Emails</span><span>Messages</span><span>Appointments</span>
                            </MDBCardHeader>
                            <MDBCardBody className="py-0 flex-column">
                                <MDBStepper vertical className="m-0 p-0" >
                                    <MDBStep className="mb-4">
                                        <div style={{minHeight: "75px", width:"80px"}}>
                                        <MDBChip className="m-0 timelineChip font-weight-bold">FEB 20</MDBChip>
                                        </div>
                                    </MDBStep>
                                    <MDBStep className="mb-4">
                                        <MDBCard className='mt-3'>
                                            <MDBCollapseHeader
                                                tagClassName='d-flex justify-content-between backgroundInherit'
                                                onClick={() => this.toggleCollapse('collapse1')}
                                            >
                                                Collapsible Group Item #1
                                                <MDBIcon
                                                    icon={collapseID === 'collapse1' ? 'angle-up' : 'angle-down'}
                                                />
                                            </MDBCollapseHeader>
                                            <MDBCollapse id='collapse1' isOpen={collapseID}>
                                                <MDBCardBody>
                                                    Pariatur cliche reprehenderit, enim eiusmod high life accusamus
                                                    terry richardson ad squid. 3 wolf moon officia aute, non
                                                    cupidatat skateboard dolor brunch. Food truck quinoa nesciunt
                                                    laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a
                                                    bird on it squid single-origin coffee nulla assumenda shoreditch
                                                    et. Nihil anim keffiyeh helvetica, craft beer labore wes
                                                    anderson cred nesciunt sapiente ea proident. Ad vegan excepteur
                                                    butcher vice lomo. Leggings occaecat craft beer farm-to-table,
                                                    raw denim aesthetic synth nesciunt you probably haven&apos;t
                                                    heard of them accusamus labore sustainable VHS.
                                                </MDBCardBody>
                                            </MDBCollapse>
                                        </MDBCard>
                                    </MDBStep>
                                    <MDBStep>
                                        <MDBChip className="m-0 timelineChip font-weight-bold">FEB 20</MDBChip>
                                    </MDBStep>
                                </MDBStepper>
                            </MDBCardBody>
                        </MDBCard>
            </MDBBox>
        )
    }
}

export default LeadTimeline;
