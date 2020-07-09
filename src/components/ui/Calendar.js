import React from "react";
import {MDBCard, MDBIcon} from "mdbreact";
import moment from "moment";
import PropTypes from "prop-types";
import {connect} from "react-redux";

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.onDateClick = this.onDateClick.bind(this)
        this.state = {
            today : moment().startOf("day"),
            currentMonth: moment(), //new Date(),
            selectedDate: moment(), //new Date()
        };
    }

    renderHeader() {
        const dateFormat = "MMMM yyyy";

        return (
            <div className="header d-flex flex-wrap justify-content-between align-items-center">
                <div className="">
                    <div className="icon" onClick={this.prevMonth}>
                        <MDBIcon icon="chevron-left"/>
                    </div>
                </div>
                <div className="d-flex flex-column">
                    <div>{this.state.currentMonth.format(dateFormat)}</div>
                    {this.props.subtitle && <div className={"subtitle"}>{this.props.subtitle}</div>}
                </div>
                <div className="icon" onClick={this.nextMonth}>
                    <MDBIcon icon="chevron-right"/>
                </div>
            </div>
        );
    }

    renderDays() {
        //const dateFormat = "ddd";

        const days = [];

        //let startDate = this.state.currentMonth.clone().startOf("week");
        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="col col-center px-0" key={i}>
                    { this.props.localization.days[i]}
                </div>
            );
        }

        return <div className="days d-flex flex-wrap">{days}</div>;
    }

    renderCells() {
        const { currentMonth, selectedDate, today } = this.state;
        const monthStart = currentMonth.clone().startOf("month");
        const monthEnd = currentMonth.clone().endOf("month");
        const startDate = monthStart.clone().startOf("week");
        const endDate = monthEnd.clone().endOf("week")
        const dayFormat = "D";
        const dateFormat = "YYYY-MM-DD"
        const rows = [];

        let days = [];
        let day = startDate.clone();

        while (endDate.isAfter(day)) {
            for (let i = 0; i < 7; i++) {
                const formattedDay = day.format(dayFormat);
                const formattedDate = day.format(dateFormat)
                const av = this.props.alternateValue.appointments[formattedDate] ? this.props.alternateValue.appointments[formattedDate].length : ""
                days.push(
                    <div
                        className={`col cell ${
                            !monthStart.isSame(day,"month") || 
                            (this.props.disablePastDates === true && day.isBefore(today,"day"))
                                ? "disabled"
                                : selectedDate.isSame(day,"day") ? "selected" : ""
                        }`}
                        key={day}
                        onClick={() => this.onDateClick(formattedDate)}
                    >
                        <div className="number">{formattedDay}</div>
                        {av !== undefined && <div className="bg">{av}</div>}
                    </div>
                );
                day.add(1,"day");
            }
            rows.push(
                <div className="d-flex flex-wrap" key={day}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="body">{rows}</div>;
    }

    onDateClick(selectedDay) {
        const day = moment(selectedDay)
        this.setState({ selectedDate: day }, () => {
              if (this.props.onChange) {
                  this.props.onChange(selectedDay)
              }
            }
        );
    };

    nextMonth = () => {
        const newDate = this.state.currentMonth.add(1, "month")

        if (typeof(this.props.loadCalendarMonth) === "function") {
            this.props.loadCalendarMonth(newDate)
        }

        this.setState({
            currentMonth: newDate
        });

    };

    prevMonth = () => {
        const newDate = this.state.currentMonth.subtract(1, "month")

        if (typeof(this.props.loadCalendarMonth) === "function") {
            this.props.loadCalendarMonth(newDate)
        }

        this.setState({
            currentMonth: newDate
        });
    };

    render() {
        return (
            <MDBCard className={"calendar shadow-sm bg-white " + this.props.className}>
                {this.renderHeader()}
                {this.renderDays()}
                {this.renderCells()}
            </MDBCard>
        );
    }
}
Calendar.propTypes = {
    disablePastDates : PropTypes.bool.isRequired,
    subtitle : PropTypes.string.isRequired,
    alternateValue : PropTypes.object,
    onChange : PropTypes.func,
    loadCalendarMonth: PropTypes.func
}

const mapStateToProps = store => {
    return {
        localization: store.localization
    }
}

export default connect(mapStateToProps)(Calendar);
