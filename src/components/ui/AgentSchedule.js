import React, { Component } from 'react'
import {connect} from "react-redux";
import {
    MDBBadge,
    MDBBox,
    MDBSelect,
    MDBSelectInput,
    MDBSelectOption,
    MDBSelectOptions,
} from "mdbreact";
import * as moment from 'moment'
import AgentAPI from "../../api/agentAPI";

class AgentSchedule extends Component {

    constructor(props) {
        super(props)

        this.state = {
            targetDate: moment().format("YYYY-MM-DD"),
            schedule: props.scheduleData,
            nextWeekMode: false,
        }
    }

    handleWeekSelector = (values) => {
        this.setState({
            nextWeekMode: values[0] === "true"
        })
    }

    pollAppStats = (targetDate) => {
        AgentAPI.getAppStats(targetDate).then(response => {
            this.setState({
                schedule: response.schedule,
                targetDate: targetDate,
            })
        }).catch(reason => {
            console.log("Schedule poll failed: ", reason)
        })
    }

    renderCalendar = () => {
        // start with this week or next week depending on mode
        let baseTime = moment()
        if (this.state.nextWeekMode) {
            baseTime.add(1, 'w')
        }
        baseTime.startOf('week').add(1, "d")

        // build array of data for the week period
        let dateArray = []
        for (let i=0;i<7;i++) {
            const dateData = {
                day: baseTime.format("ddd"),
                date: baseTime.format("D"),
                fullDate: baseTime.format("YYYY-MM-DD")
            }
            dateArray.push(dateData)
            baseTime.add(1, "d")
        }

        // build array of rendered date components
        const dates = dateArray.map( data => {
            const dayColor = data.fullDate === this.state.targetDate ? "skin-primary-color" : "grey-text"

            let dateDisplay = (<div className="grey-text f-rs">{data.date}</div>)
            if (data.fullDate === this.state.targetDate) {
                dateDisplay = (<MDBBadge pill color="deep-orange lighten-3 f-rs">{data.date}</MDBBadge>)
            }

            return (
                <MDBBox key={data.date} className="d-flex flex-column align-items-center pointer" onClick={() => this.pollAppStats(data.fullDate)}>
                    <div className={dayColor}>{data.day}</div>
                    {dateDisplay}
                </MDBBox>
            )
        })

        return (
            <MDBBox className="w-100 d-flex flex-row align-items-center justify-content-between border-bottom border-light pb-3">
                {dates}
            </MDBBox>
        )
    }

    renderAssignments = () => {
        if (this.state.schedule.length > 0) {
            const steps = this.state.schedule.map( scheduleBlock => {
                return (
                    <MDBBox key={scheduleBlock.timeLabel} className="mt-3">
                        <span>
                            {scheduleBlock.timeLabel}
                        </span>
                        <div className="d-flex flex-column w-100">
                            {scheduleBlock.assignments.map( assignment => {
                                return (
                                    <MDBBox key={assignment.clientName} className="deep-orange lighten-5 rounded d-flex justify-content-between p-3 mb-2 f-rs">
                                        <div className="font-weight-bold">{assignment.clientName.toUpperCase()}</div>
                                        <div className="align-self-end">{assignment.timeRange.toUpperCase()}</div>
                                    </MDBBox>
                                )
                            })}
                        </div>
                    </MDBBox>
                )
            })

            return (
                <MDBBox vertical className="p-0 m-0">
                    {steps}
                </MDBBox>
            )

        } else {
            return (<div>No Shift Assignments</div>)
        }
    }

    render() {
        const targetDate = moment(this.state.targetDate)
        return (
            <MDBBox className="d-flex flex-column">
                <MDBBox className="d-flex flex-row justify-content-between">
                    <h5>{this.props.localization.home.scheduleTitle}</h5>
                    <MDBSelect getValue={this.handleWeekSelector} className="mb-1 mt-1 mr-2 w-25 f-rs">
                        <MDBSelectInput className="f-rs" selected="false" />
                        <MDBSelectOptions>
                            <MDBSelectOption value="false" checked className="f-rs">{this.props.localization.home.scheduleThisWeek}</MDBSelectOption>
                            <MDBSelectOption value="true" className="f-rs">{this.props.localization.home.scheduleNextWeek}</MDBSelectOption>
                        </MDBSelectOptions>
                    </MDBSelect>
                </MDBBox>
                <div><span className="font-weight-bold">{targetDate.format("D MMM")},</span> {targetDate.format("dddd")}</div>
                <MDBBox className="my-2">
                    {this.renderCalendar()}
                </MDBBox>
                <MDBBox className="my-2">
                    {this.renderAssignments()}
                </MDBBox>
            </MDBBox>
        )
    }
}

const mapStateToProps = state => {
    return {
        localization: state.localization
    }
}

export default connect(mapStateToProps)(AgentSchedule);
