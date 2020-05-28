import React, { Component } from 'react'
import {MDBBox, MDBNav, MDBNavItem, MDBNavLink} from "mdbreact"
import { connect } from "react-redux"
import Button from "./Button";

class TimeSlots extends Component {

    constructor(props) {
        super(props)
        this.toggleTimeOfDay = this.toggleTimeOfDay.bind(this)

        this.state = {
            activeSlot : "morning"
        }

    }
    toggleTimeOfDay(time) {
        this.setState({activeSlot : time})
    }

    render() {
        const values = this.props.values
        let morning = []
            let afternoon = []
                let evening = []
        if (values && values.length > 0) {
            values.forEach((value) => {
                const chip = <Button rounded outline="accent" color="secondary" className="f-l" key={value}>{value}</Button>
                const shortValue = value.substring(0,value.indexOf(":"))
                if (shortValue < 12) morning.push(chip)
                else if (shortValue < 17) afternoon.push(chip)
                else evening.push(chip)

            })
        }

        return (
            <MDBBox className={"d-flex" + this.props.className}>
                <MDBNav className="d-flex">
                    <MDBNavItem>
                        <MDBNavLink to="#" onClick={()=> this.toggleTimeOfDay("morning")} className={this.state.activeSlot === "morning" ? "skin-primary-color" : "skin-secondary-color"}>
                            <span className="mr-1">Morning</span>{morning.length > 0 && <span className={"fa-layers-counter fa-3x fa-layers-top-right " + (this.state.activeSlot === "morning" ? "skin-primary-background-color" : "skin-secondary-background-color")}>
                                <span className="skin-text">{morning.length}</span>
                            </span>}
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink to="#" onClick={()=> this.toggleTimeOfDay("afternoon")} className={this.state.activeSlot === "afternoon" ? "skin-primary-color" : "skin-secondary-color"}>
                            <span className="mr-1">Afternoon</span>{afternoon.length > 0 && <span className={"fa-layers-counter fa-3x fa-layers-top-right " + (this.state.activeSlot === "afternoon" ? "skin-primary-background-color" : "skin-secondary-background-color")}>
                                <span className="skin-text">{afternoon.length}</span>
                            </span>}
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink to="#" onClick={()=> this.toggleTimeOfDay("evening")} className={this.state.activeSlot === "evening" ? "skin-primary-color" : "skin-secondary-color"}>
                            <span className="mr-1">Evening</span>{evening.length > 0 && <span className={"fa-layers-counter fa-3x fa-layers-top-right " + (this.state.activeSlot === "evening" ? "skin-primary-background-color" : "skin-secondary-background-color")}>
                                <span className="skin-text">{evening.length}</span>
                            </span>}
                        </MDBNavLink>
                    </MDBNavItem>
                </MDBNav>
                {this.state.activeSlot === "morning" &&
                    <MDBBox className="d-flex">
                        {morning.length > 0 ? <MDBBox>{morning}</MDBBox> : <div>No Appointments Available.</div>}
                    </MDBBox>
                }
                {this.state.activeSlot === "afternoon" &&
                <MDBBox className="d-flex">
                    {afternoon.length > 0 ? <MDBBox>{afternoon}</MDBBox> : <div>No Appointments Available.</div>}
                </MDBBox>
                }
                {this.state.activeSlot === "evening" &&
                <MDBBox className="d-flex">
                    {evening.length > 0 ? <MDBBox>{evening}</MDBBox> : <div>No Appointments Available.</div>}
                </MDBBox>
                }
            </MDBBox>

        )
    }
}
const mapStateToProps = store => {
    return {
        localization: store.localization
    }
}

export default connect(mapStateToProps)(TimeSlots);
