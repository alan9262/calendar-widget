import React, { Component } from "react";
import moment from "moment";
import "./calendar.css";
import Scheduler from "../components/Scheduler";

class Calendar extends Component {
  state = {
    currentMoment: moment(),
    showMonths: false,
    showYears: false
  }

  weekdays = moment.weekdays();
  shortWeekdays = moment.weekdaysShort();
  months = moment.months();
  daysPerMonth = () => {
    return this.state.currentMoment.daysInMonth();
  }
  currentDate = () => {
    return this.state.currentMoment.get('date');
  }
  currentDay = () => {
    return this.state.currentMoment.format('D');
  }
  year = () => {
    return this.state.currentMoment.format('Y');
  }
  month = () => {
    return this.state.currentMoment.format('MMMM')
  }
  getFirstDayOfMonth = () => {
    return moment(this.state.currentMoment).startOf('month').format('d');
  }
  formatTheCalendar = (emptyWeeks, daysPerMonth) => {
    var totalDays = [...emptyWeeks, ...daysPerMonth];
    let rows = [];
    let cells = [];
    totalDays.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row);
      } else {
        let oldRow = cells.slice();
        rows.push(oldRow);
        cells = [];
        cells.push(row);
      }
      if (i === totalDays.length - 1) {
        let tmpRow = cells.slice();
        rows.push(tmpRow);
      }
    })
    return rows;
  }
  setMonth = (month) => {
    let currMonth = this.months.indexOf(month);
    let newMoment = Object.assign({}, this.state.currentMoment);
    newMoment = moment(newMoment).set("month", currMonth);
    this.setState({ currentMoment: newMoment })
  }
  onsSelectChange = (e, data) => {
    this.setMonth(data);
    this.props.onMonthChange && this.props.onMonthChange();
  }
  SelectList = (props) => {
    let popup = props.data.map((data) => {
      return (
        <div key={data}>
            <a href="#" onClick = {(e) => {this.onsSelectChange(e, data)}}>
              {data}
            </a>
        </div>
      )
    });
    return (
      <div className = "month-popup">
        {popup}
      </div>
    )
  }
  monthChange = (e, month) => {
    this.setState({
      showMonths: !this.state.showMonths
    })
  }
  RenderMonth = () => {
    return (
      <span className = "label-month" onClick = {(e) => {this.monthChange(e, this.month())}}>
        {this.month()}
        {this.state.showMonths && <this.SelectList data = {this.months} />}
        
      </span>
    )
  }
  showYears = () => {
    this.setState({
      showYearPopup: true
    })
  }
  setYear = (year) => {
    let tempMoment = Object.assign({}, this.state.currentMoment);
    tempMoment = moment(tempMoment).set("year", year);
    this.setState( {
      currentMoment: tempMoment
    })
  }
  onKeyUpYear = (e) => {
    if(e.which === 13 || e.which === 27) {
      this.setYear(e.target.value);
      this.setState( {
        showYearPopup: false
      })
    }
  }
  onYearChange = (e) => {
    this.setYear(e.target.value);
    this.props.onYearChange && this.props.onYearChange(e, e.target.value);
  }
  RenderYear = () => {
    return (
      this.state.showYearPopup ? 
      <input defaultValue = {this.year()}
             className="editor-year"
             ref = {(yearValue) => this.yearValue = yearValue}
             onKeyUp = {(e) => this.onKeyUpYear(e)}
             onChange = {(e) => this.onYearChange(e)}
             type = "number"/>
       :
      <span className="label-year" onClick = {(e) => {this.showYears()}}>
        {this.year()}
      </span>
    );
  }
  prevMonth = () => {
    let tmpMoment = Object.assign({}, this.state.currentMoment);
    tmpMoment = moment(tmpMoment).subtract(1, "month");
    this.setState({currentMoment: tmpMoment})
  }
  nextMonth = () => {
    let tmpMoment = Object.assign({}, this.state.currentMoment);
    tmpMoment = moment(tmpMoment).add(1, "month");
    this.setState({currentMoment: tmpMoment})
  }

  render() {
    let wd = this.shortWeekdays.map(element => {
      return (
        <td key={element} className="day">{element}</td>
      )
    });
    let emptyWeeks = [];
    let daysPerMonth = [];
    for (let i in this.getFirstDayOfMonth()) {
      emptyWeeks.push(
        <td key={i} className="blank">
          {""}
        </td>
      )
    }
    for (let d = 1; d <= this.daysPerMonth(); d++) {
      daysPerMonth.push(
        <td key={d}>
          <span>{d}</span>
        </td>
      )
    }
    var calendarRows = this.formatTheCalendar(emptyWeeks, daysPerMonth).map((value, index) => {
      return (
        <tr key={index * 10}>
          {value}
        </tr>
      )
    });

    return (
      <div className="container">
        <table className="calendar">
          <thead>
            <tr className="header">
              <td colSpan="5">
                  <this.RenderMonth/>&nbsp;
                  <this.RenderYear/>
                  <td colSpan = "2">
                    <i onClick={(e) => {this.prevMonth()}}>
                      {"<"}
                    </i>
                    <i onClick={(e) => {this.nextMonth()}}>
                      {">"}
                    </i>
                  </td>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              {wd}
            </tr>
            {calendarRows}
          </tbody>
        </table>
        <Scheduler weekdays={wd} rows={calendarRows}/>
      </div>
    )
  }

}


export default Calendar;