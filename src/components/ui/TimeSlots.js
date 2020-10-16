import React, {Component} from 'react'
import {MDBBox, MDBNav, MDBNavItem, MDBNavLink} from "mdbreact"
import {connect} from "react-redux"
import Button from "./Button";
import moment from "moment";

class TimeSlots extends Component {

    constructor(props) {
        super(props)

        const office = props.lead.client.offices.find(office => office.id === props.officeID)
        if (office === undefined) {
            // this office's data is not in client data, this could only happen via demonic possession
            console.log("Missing client data for office " + this.props.officeID)
        }

        this.state = {
            officeTimezone: office.timezone,
            activeSlot: "morning"
        }
    }

    toggleTimeOfDay = (time) => () => {
        this.setState({activeSlot: time})
    }

    generateSlotDisplayValue = () => {
        const slotValues = this.props.values
        let morning = []
        let afternoon = []
        let evening = []

        if (slotValues && slotValues.length > 0) {
            slotValues.forEach((value) => {
                // value is in office timezone, format HH:MM
                // turn this into a moment object
                const hour = value.substring(0, value.indexOf(":"))
                const minute = value.substring(value.indexOf(":") + 1)
                let slotTimeObject = moment().tz(this.state.officeTimezone).hours(hour).minutes(minute)

                // the actual display text depends on whether the office and lead are in the same time zone
                let slotTimeDisplay = ""
                if (this.state.officeTimezone !== this.props.lead.details.timezone) {
                    const officeTime = slotTimeObject.format("h:mma z")
                    const leadTime = slotTimeObject.clone().tz(this.props.lead.details.timezone).format("h:mma z")
                    slotTimeDisplay = (<span>{this.props.localization.officeSlotLabel} <span
                        className="font-weight-bold">{officeTime}</span> ({this.props.localization.leadSlotLabel} {leadTime})</span>)
                } else {
                    slotTimeDisplay = slotTimeObject.format("h:mma z")
                }
                const chip = <Button rounded outline="accent" color="secondary" className="lowercaseButton" key={value}
                                     clickHandler={() => {
                                         this.props.timeSelect(value)
                                     }}>{slotTimeDisplay}</Button>

                // push the slot into a time category array
                if (hour < 12) morning.push(chip)
                else if (hour < 17) afternoon.push(chip)
                else evening.push(chip)
            })
        }
        return {morning, afternoon, evening}
    }

    render() {
        const {morning, afternoon, evening} = this.generateSlotDisplayValue()
        const boxClass = this.state.officeTimezone === this.props.lead.details.timezone ? "d-flex flex-wrap justify-content-center" : "d-flex flex-column align-content-center"
        return (
            <MDBBox className={"d-flex flex-column " + this.props.className}>
                <MDBNav className="d-flex">
                    <MDBNavItem>
                        <MDBNavLink to="#" onClick={this.toggleTimeOfDay("morning")}
                                    className={this.state.activeSlot === "morning" ? "skin-primary-color" : "skin-secondary-color"}>
                            <span className="mr-1">{this.props.localization.morningLabel}</span>{morning.length > 0 &&
                        <span
                            className={"fa-layers-counter fa-3x fa-layers-top-right " + (this.state.activeSlot === "morning" ? "skin-primary-background-color" : "skin-secondary-background-color")}>
                                <span className="skin-text">{morning.length}</span>
                            </span>}
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink to="#" onClick={this.toggleTimeOfDay("afternoon")}
                                    className={this.state.activeSlot === "afternoon" ? "skin-primary-color" : "skin-secondary-color"}>
                            <span
                                className="mr-1">{this.props.localization.afternoonLabel}</span>{afternoon.length > 0 &&
                        <span
                            className={"fa-layers-counter fa-3x fa-layers-top-right " + (this.state.activeSlot === "afternoon" ? "skin-primary-background-color" : "skin-secondary-background-color")}>
                                <span className="skin-text">{afternoon.length}</span>
                            </span>}
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink to="#" onClick={this.toggleTimeOfDay("evening")}
                                    className={this.state.activeSlot === "evening" ? "skin-primary-color" : "skin-secondary-color"}>
                            <span className="mr-1">{this.props.localization.eveningLabel}</span>{evening.length > 0 &&
                        <span
                            className={"fa-layers-counter fa-3x fa-layers-top-right " + (this.state.activeSlot === "evening" ? "skin-primary-background-color" : "skin-secondary-background-color")}>
                                <span className="skin-text">{evening.length}</span>
                            </span>}
                        </MDBNavLink>
                    </MDBNavItem>
                </MDBNav>
                {this.state.activeSlot === "morning" &&
                <MDBBox>
                    {morning.length > 0 ? <MDBBox className={boxClass}>{morning}</MDBBox> :
                        <div>{this.props.localization.noSlotsAvailable}</div>}
                </MDBBox>
                }
                {this.state.activeSlot === "afternoon" &&
                <MDBBox>
                    {afternoon.length > 0 ? <MDBBox className={boxClass}>{afternoon}</MDBBox> :
                        <div>{this.props.localization.noSlotsAvailable}</div>}
                </MDBBox>
                }
                {this.state.activeSlot === "evening" &&
                <MDBBox>
                    {evening.length > 0 ? <MDBBox className={boxClass}>{evening}</MDBBox> :
                        <div>{this.props.localization.noSlotsAvailable}</div>}
                </MDBBox>
                }
            </MDBBox>

        )
    }
}

const mapStateToProps = state => {
    return {
        localization: state.localization.interaction.appointment.calendar,
        lead: state.lead
    }
}

export default connect(mapStateToProps)(TimeSlots);
