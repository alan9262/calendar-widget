import React, { Component } from "react";
import './calendar.css'

class Header extends Component {
    state = {
        selectedUser: ""
    }
    constructor(props) {
        super(props);
        this._handleChange = this._handleChange.bind(this);
        this.getUsers = this.getUsers.bind(this);
    }

    getUsers = () =>{
        let usersList = this.props.users.map(user => {
            return (
                <option value={user}>{user}</option>
            )
        })
        return usersList;
    }
    _handleChange(e) {
        let {name, value} = e.target;
        this.setState ({
          selectedUser: value,
        });
        localStorage.setItem("currentUser", value);
    }
    render() {
        return (
            <div className = "header-class">
                    <h4 >Calendar Widget</h4>
                        <div className="pull-right">Active user:
                        <select onChange={this._handleChange}>{this.getUsers()}
                        </select>
                </div>
            </div>
        )
    }
}

export default Header;