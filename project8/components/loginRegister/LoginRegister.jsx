/* eslint-disable react/prop-types */
import React, { useState } from "react";
import axios from 'axios';
import Login from "./Login";
import Register from "./Register";

/**
 * A view component in the main view of application, which provides a way for user to
 * login and register a new user.
 */

class LoginRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            register_status: 0,
        }
    }

    handleClick = () => {
        this.setState({ register_status: 1 })
    }

    handleRegister = () => {
        this.setState({ register_status: 2 })
    }

    renderRegister = () => {
        if (this.state.register_status == 1) {
            return <Register callback={this.handleRegister}/>;
        } else if (this.state.register_status == 0) {
            return <i className="register" onClick={this.handleClick}> Not a user? Register Now</i>;
        } else {
            return <p>Woohoo, Welcome!</p>;
        }

    }

    render() {
        let updateLoggedIn = this.props.callback;
        return (
            <div>
                <Login callback={updateLoggedIn} />
                {this.renderRegister()}
            </div>
        );
    }

}

export default LoginRegister;