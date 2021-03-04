import React, { Component } from "react";
import moment from "moment";
import "./calendar.css";
import Scheduler from "../components/Scheduler";
import Header from "../components/Header";

const schedulerObj = {
  "00:00": "",
  "01:00": "",
  "02:00": "",
  "03:00": "",
  "04:00": "",
  "05:00": "",
  "06:00": "",
  "07:00": "",
  "08:00": "",
  "09:00": "",
  "10:00": "",
  "11:00": "",
  "12:00": "",
  "13:00": "",
  "14:00": "",
  "15:00": "",
  "16:00": "",
  "17:00": "",
  "18:00": "",
  "19:00": "",
  "20:00": "",
  "21:00": "",
  "22:00": "",
  "23:00": ""
}

class Calendar extends Component {
  state = {
    currentMoment: moment(),
    showMonths: false,
    showYears: false,
    selectedDay: String,
    selectedMonth: String,
    message: "h1",
    users: ["Alan", "Matt", "D", "E", "F"],
    scheduler: schedulerObj
  }
  constructor(props) {
    super(props);
    this.formatTheCalendar = this.formatTheCalendar.bind(this);
  }

  weekdays = moment.weekdays();
  shortWeekdays = moment.weekdaysShort();
  months = moment.months();
 
  UNSAFE_componentWillReceiveProps(props) {
    this.setState ({
      currentUser: this.props.selectedUser
    });
  }
  
  componentDidMount() {
    let today = moment(new Date()).format("DD/MM/YYYY");
    let darr = today.split("/");  
    var dobj = new Date(parseInt(darr[2]),parseInt(darr[1])-1,parseInt(darr[0]));
    let weekStart = moment(dobj).startOf('week');
    var currDays = [];
    for (let i = 0; i <= 6; i++) {
      currDays.push(
        <td key={moment(weekStart).add(i, 'days').format("D")}>
          <span>{moment(weekStart).add(i, 'days').format("D")}</span>
        </td>
      )
    }
    localStorage.setItem("users", this.state.users);
    this.setState({
      currentWeek: currDays,
      currentUser: localStorage.getItem("currentUser")
    })
  }
  componentWillUnmount() {
    this.setState({
      currentMoment: moment(),
      showMonths: false,
      showYears: false,
      selectedDay: String,
      selectedMonth: String
    })
  }
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
    let totalDays = [...emptyWeeks, ...daysPerMonth];
    let rows = [];
    let cells = [];
    totalDays.forEach((row, z) => {
      if (z % 7 !== 0) {
        cells.push(row);
      } else {
        let oldRow = cells.slice();
        rows.push(oldRow);
        cells = [];
        cells.push(row);
      }
      if (z === totalDays.length - 1) {
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
  onSelectChange = (e, data) => {
    this.setMonth(data);
    this.props.onMonthChange && this.props.onMonthChange();
  }
  SelectList = (props) => {
    let popup = props.data.map((data) => {
      return (
        <div key={data}>
          <a href="#" onClick={(e) => { this.onSelectChange(e, data) }}>
            {data}
          </a>
        </div>
      )
    });
    return (
      <div className="month-popup">
        {popup}
      </div>
    )
  }
  monthChange = () => {
    this.setState({
      showMonths: !this.state.showMonths
    })
  }
  RenderMonth = () => {
    return (
      <span className="label-month" onClick={(e) => { this.monthChange(e, this.month()) }}>
        {this.month()}
        {this.state.showMonths && <this.SelectList data={this.months} />}

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
    this.setState({
      currentMoment: tempMoment
    })
  }
  onKeyUpYear = (e) => {
    if (e.which === 13 || e.which === 27) {
      this.setYear(e.target.value);
      this.setState({
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
        <input defaultValue={this.year()}
          className="editor-year"
          ref={(yearValue) => this.yearValue = yearValue}
          onKeyUp={(e) => this.onKeyUpYear(e)}
          onChange={(e) => this.onYearChange(e)}
          type="number" />
        :
        <span className="label-year" onClick={(e) => { this.showYears() }}>
          {this.year()}
        </span>
    );
  }
  prevMonth = () => {
    let tmpMoment = Object.assign({}, this.state.currentMoment);
    tmpMoment = moment(tmpMoment).subtract(1, "month");
    this.setState({ currentMoment: tmpMoment })
    this.props.onPrevMonth && this.props.onPrevMonth();
  }
  nextMonth = () => {
    let tmpMoment = Object.assign({}, this.state.currentMoment);
    tmpMoment = moment(tmpMoment).add(1, "month");
    this.setState({ currentMoment: tmpMoment })
    this.props.nextMonth && this.props.nextMonth();
  }
  onDayClick = (e, day) => {
    let tmpMoment = Object.assign({}, this.state.currentMoment)
    let currentMonth = moment(tmpMoment).format("M");
    let currentYear = moment(tmpMoment).format("YYYY");
    let currDate = day + "/" + currentMonth + "/" + currentYear;
    let darr = currDate.split("/");  
    var dobj = new Date(parseInt(darr[2]),parseInt(darr[1])-1,parseInt(darr[0]));
    let weekStart = moment(dobj).startOf('week');
    var currDays = [];
    for (let i = 0; i <= 6; i++) {
      currDays.push(
        <td id={moment(weekStart).add(i, 'days').format("D")} >
          <span>{moment(weekStart).add(i, 'days').format("D")}</span>
        </td>
      )
    }
    this.setState({
      selectedDay: day,
      currentWeek: currDays
    });
    this.props.onDayClick && this.props.onDayClick(e, day);
  }
  
  
  render() {
    console.log(this.state);
    let wd = this.shortWeekdays.map(element => {
      return (
        <td key={element} className="week-day">{element}</td>
      )
    });
    let emptyWeeks = [];
    let daysPerMonth = [];
    for (var zz = 0; zz <  this.getFirstDayOfMonth(); zz++) {
      emptyWeeks.push(
        <td key={zz} className="blank">
          {""}
        </td>
      )
    }
    for (let d = 1; d <= this.daysPerMonth(); d++) {
      let className = (d == this.currentDay() ? " day current-day" : "day");
      let selectedClass = (d == this.state.selectedDay ? " selected-day " : "")
      daysPerMonth.push(
        <td key={d} className={className + selectedClass}>
          <span onClick={(e) => { this.onDayClick(e, d) }}>{d}</span>
        </td>
      )
    }
    var formattedObj = this.formatTheCalendar(emptyWeeks, daysPerMonth);
    var calendarRows = formattedObj.map((value, index) => {
      return (
        <tr key={index * 10}>
          {value}
        </tr>
      )
    });
    return (
      <div>
        <Header users={this.state.users}/>
        <div className="divider">
          <div className="container-page">
            <table className="calendar">
              <thead className="table-header">
                <tr className="header">
                  <td colSpan="5">
                    <this.RenderMonth />&nbsp;
                    <this.RenderYear />
                    <td colSpan="2" className="switchers">
                      <button onClick={(e) => { this.prevMonth() }}>
                        <b>{"<"}</b>
                      </button>
                      <button onClick={(e) => { this.nextMonth() }}>
                        <b>{">"}</b>
                      </button>
                    </td>
                  </td>
                </tr>
              </thead>
              <tbody className="table-body">
                <tr>
                  {wd}
                </tr>
                {calendarRows}
              </tbody>
            </table>
          </div>
          <div className="scheduler">
            <Scheduler schedulerObj={this.state.schedulerObj} selectedUser={this.props.selectedUser} rows={calendarRows} getCurrentWeek={this.state.currentWeek} getCurrentDate={this.state.currentDate} currentMoment={this.state.currentMoment}/>
          </div>
        </div>
      </div>
    )
  }
}


export default Calendar;