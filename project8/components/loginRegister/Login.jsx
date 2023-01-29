/* eslint-disable react/prop-types */
import React, { useState } from "react";
import './LoginRegister.css';
import axios from 'axios';
import { Redirect } from "react-router";


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login_name: "",
            password: "",
            isAuthUser: false,
            user_id: "",
            message: "",
        }
    }

    handleChangeName = (event) => {
        this.setState({ login_name: event.target.value });

    }

    handleChangePassword = (event) => {
        this.setState({ password: event.target.value });

    }
    handleSubmit = (event) => { // Process submit from this.state
        event.preventDefault();   // Need to stop DOM from generating a POST
        axios.post('/admin/login', {
            login_name: this.state.login_name,
            password: this.state.password,
        }).then(
            (res) => {
                // Pass login name and first name back to photoshare
                this.props.callback(true, this.state.login_name, res.data.first_name, res.data._id);
                this.setState({ isAuthUser: true, user_id: res.data._id });
            },
            (rej) => {
                this.setState({ message: rej.response.data });
            });
    }

    render() {
        if (this.state.isAuthUser) {
            return (<Redirect path="/" to={"/users/" + this.state.user_id} />);
        }
        return (
            <div>
                <h1>Login</h1>
                <form onSubmit={this.handleSubmit}>
                    <label className="required"> Login Name:
                    </label>
                    <input type="text"
                        value={this.state.login_name}
                        onChange={this.handleChangeName} />
                    <br></br>
                    <br></br>
                    <label className="required"> password:
                    </label>
                    <input type="password"
                        value={this.state.password}
                        onChange={this.handleChangePassword} />
                    <br></br>
                    <br></br>
                    <input type="submit" value="Submit" />
                </form>
                <p className="error_message">{this.state.message}</p>
            </div>

        );
    }

}

export default Login;