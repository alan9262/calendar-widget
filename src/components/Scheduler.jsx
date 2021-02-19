import React, { Component } from "react";


class Scheduler extends Component {
    state = {
        weekDays: this.props.weekdays
    }
    constructor(props) {
        super(props);
    }
    render() {
        var hours = [];
        for(let i = 0; i < 24; i++){
            hours.push(i + ":00");
        }
        var display = hours.map((val, ind) => {
            return(
                <tr key={ind*10}>
                    <td>{val}</td>
                </tr>
            )
        });
        return(
            <table>
                <thead>
                    <tr>{this.props.weekdays}</tr>
                </thead>
                <tbody>
                    {display}
                </tbody>
            </table>
        )
    }
}

export default Scheduler;