import React, {Component} from 'react'
import {
    MDBBox,
    MDBCardHeader,
    MDBCardBody,
    MDBCard, MDBChip, MDBStepper, MDBStep

} from "mdbreact";

import TimelineTouchpoints from "./timeline/TimelineTouchpoints";
import Interaction from "./timeline/cards/Interaction";
import {connect} from "react-redux";
import TimelineData from "./timeline/TimelineData";
import Appointment from "./timeline/cards/Appointment";
import Note from "./timeline/cards/Note";
import Call from "./timeline/cards/Call";
import Document from "./timeline/cards/Document";
import Email from "./timeline/cards/Email";
import Survey from "./timeline/cards/Survey";
import Text from "./timeline/cards/Text";
import moment from "moment";

class LeadTimeline extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }
    buildTimeline(td) {
        let date = undefined
        const timeline = td.map((item, index) => {
            let result = []

            const itemDate = moment(item.created_at).format("YYYY") !== moment().format("YYYY") ? moment(item.created_at).format("MMM D, YYYY").toUpperCase() : moment(item.created_at).format("MMM D").toUpperCase()
            if (date === undefined || date !== itemDate ){
                date = itemDate
                result.push(
                    <MDBStep className="mb-4" key={itemDate}>
                        <div className="" style={{width:"130px", zIndex:2}}>
                            <MDBChip className="m-0 timelineChip font-weight-bold">{itemDate}</MDBChip>
                        </div>
                    </MDBStep>
                )
            }
            switch (item.type) {
                case "interaction": result.push (
                    <MDBStep className="mb-4" key={"event-" + index}>
                        <Interaction data={item}/>
                    </MDBStep>
                    )
                    break
                case "appointment": result.push  (
                    <MDBStep className="mb-4" key={"item-" + index}>
                        <Appointment data={item}/>
                    </MDBStep>
                )
                    break
                case "note": result.push  (
                    <MDBStep className="mb-4" key={"item-" + index}>
                        <Note data={item}/>
                    </MDBStep>
                )
                    break
                case "call": result.push  (
                    <MDBStep className="mb-4" key={"item-" + index}>
                        <Call data={item}/>
                    </MDBStep>
                )
                    break
                case "document": result.pushn  (
                    <MDBStep className="mb-4" key={"item-" + index}>
                        <Document data={item}/>
                    </MDBStep>
                )
                    break
                case "email": result.push  (
                    <MDBStep className="mb-4" key={"item-" + index}>
                        <Email data={item}/>
                    </MDBStep>
                )
                    break
                case "survey": result.push  (
                    <MDBStep className="mb-4" key={"item-" + index}>
                        <Survey data={item}/>
                    </MDBStep>
                )
                    break
                case "text": result.push  (
                    <MDBStep className="mb-4" key={"item-" + index}>
                        <Text data={item}/>
                    </MDBStep>
                )
                    break
                default: break
            }
            return result
        })
        return timeline
    }
    render() {
        const td = new TimelineData(this.props.lead)
        return (
            <MDBBox className="d-flex flex-row overflow-auto flex-1 p-0 m-0 w-auto">
                        <TimelineTouchpoints data={td.getTouchpoints()}/>
                        <MDBCard className="d-flex order-1 overflow-auto w-100 border-0 backgroundColorInherit">
                            <MDBCardHeader className="d-flex card-header-no-back-no-border bg-white mb-3 f-s py-2 px-3 justify-content-end">
                                <span className="px-2">All Interactions</span><span className="px-2">Call</span>
                                <span className="px-2">Emails</span><span className="px-2">Messages</span><span className="px-2">Appointments</span>
                            </MDBCardHeader>
                            <MDBCardBody className="py-0 flex-column">
                                <MDBStepper vertical className="m-0 p-0 timelineStepperRight" >
                                    {this.buildTimeline(td.getTimeline())}
                                </MDBStepper>
                            </MDBCardBody>
                        </MDBCard>
            </MDBBox>
        )
    }
}
const mapStateToProps = state => {
    return {
        localization: state.localization,
        lead : state.lead,
        shift: state.shift
    }
}

export default connect(mapStateToProps)(LeadTimeline);
