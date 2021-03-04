import React, { Component } from "react";
import './calendar.css'
import moment from "moment";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from "react-bootstrap";
import { Multiselect } from 'multiselect-react-dropdown';


class Scheduler extends Component {
    state = {
        weekDays: this.props.weekdays,
        show: false,
        options: "",
        meetTitle: "",
        activeCell: true
    }
    constructor(props) {
        super(props);
        this.textInput = React.createRef();
    }

    componentDidMount() {
        let users = localStorage.getItem('users').split(",");
        let obj = {name: "", id: ""}
        var usersTotal = [];
        for(let i = 0; i < users.length; i++) {
            usersTotal.push({name: users[i], id: i+1})
        }
        this.setState({
            options: usersTotal
        })
    }

    clickedScheduler = (e) => {
        let curreMoment = this.props.currentMoment;
        let currMonth = curreMoment.format('MM');
        let currYear = curreMoment.format('YYYY');
        let cellIndex = e.target.cellIndex;
        let timeHead = e.target.parentElement.innerText.trim();
        let dateHead = document.getElementById('date')
        let dayHead;
        if(dateHead.childNodes[cellIndex] != undefined) {
            dayHead = dateHead.childNodes[cellIndex].innerText.trim();
        }
        let currDate = dayHead + "/" + currMonth + "/" + currYear;
        let darr = currDate.split("/");
        var dobj = new Date(parseInt(darr[2]), parseInt(darr[1]) - 1, parseInt(darr[0]));
        this.setState({
            show: true,
            activeCell: e
        })
    }

    handleClose = (e) => {
        this.setState({
            show: false
        })
    }
 confirmMeeting = () => {
        
        let currentUser = localStorage.getItem("user");
        if(!currentUser) {
            currentUser = this.state.options[0]
        }
        // localStorage.setItem("")
        this.setState({
            show: false
        })
        this.state.activeCell.target.innerHTML = "<div style='background-color:red;' className='event-created'>" + this.state.meetTitle ? this.state.meetTitle : "Meeting with " + this.state.currentUser + "<div>"
        var userSpecificMeeting = {
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
          var time = this.state.activeCell.target.parentNode.cells[0].innerText;
          var getDate = this.props.getCurrentWeek[this.state.activeCell.target.cellIndex - 1]["key"];
          console.log(Object.keys(userSpecificMeeting), this.state, time, getDate, this.props.currentMoment.format('MMMM'), this.props.currentMoment.format('d'), this.props.currentMoment.format('YYYY'));
    }
    handleShow = () => {
        this.setState({
            show: true
        })
    }
    getTitle = (e) => {
        this.setState({
            meetTitle: e.target.value
        })
    }

    render() {
        let weekD = moment.weekdaysShort();
        weekD.splice(0, 0, "");
        var hours = [];
        for (let i = 0; i < 24; i++) {
            if (i < 11) {
                i = "0" + i;
            }
            hours.push(i + ":00");
        }
        let wDay = weekD.map(element => {
            return (
                <td key={element} className="week-day">{element}</td>
            )
        });
        var display = hours.map((val, ind) => {
            return (
                <tr key={ind * 10} onClick={(e) => this.clickedScheduler(e)}>
                    <td><b>{val}</b></td>
                    <td>{""}</td>
                    <td>{""}</td>
                    <td>{""}</td>
                    <td>{""}</td>
                    <td>{""}</td>
                    <td>{""}</td>
                    <td>{""}</td>
                </tr>
            )
        });
        const data = [{ value: 'One', selected: true }, { value: 'Two' }, { value: 'Three' }]
        return (
            <table className="scheduler" ref={this.tableHead}>
                <thead className="scheduler-thead">
                    <tr>{wDay}</tr>
                    <tr className="scheduler-thead-week" id="date">
                        <td className="week-day-head">{"0:00"}</td>
                        {this.props.getCurrentWeek}
                    </tr>
                </thead>
                <tbody className="scheduler-tbody">
                    <div className="time-header">{display}</div>
                    <>
                        <Modal show={this.state.show}>
                            <Modal.Header closeButton>
                                <Modal.Title>Create Meeting Schedule</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <input id="meeting-title" placeholder="Meeting Title" onChange={(e) => this.getTitle(e)}></input><br></br>
                                Who are you scheduling the meeting with?
                                <Multiselect
                                    options={this.state.options} 
                                    selectedValues={this.state.selectedValue} 
                                    onSelect={this.onSelect}
                                    onRemove={this.onRemove}
                                    displayValue="name"
                                />

                                For how many hours ? &nbsp;
                                <select>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                </select>

                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={(e) => this.handleClose(e)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={this.confirmMeeting}>
                                    Create Meeting
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </>
                </tbody>
            </table>
        )
    }
}

export default Scheduler;