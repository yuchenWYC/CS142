/* eslint-disable react/prop-types */
import React, { useState } from "react";
import './LoginRegister.css';
import axios from 'axios';
import { reject } from "bluebird";


class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login_name: "",
            password: "",
            confirm_password: "",
            first_name: "",
            last_name: "",
        }
    }

    handleChangeLoginName = (event) => {
        this.setState({ login_name: event.target.value });  // Common approach to push into component state
    }

    handleChangePassword = (event) => {
        this.setState({ password: event.target.value });  // Common approach to push into component state
    }

    handleChangeConfirmPassword = (event) => {
        this.setState({ confirm_password: event.target.value });  // Common approach to push into component state
    }

    handleChangeFirstName = (event) => {
        this.setState({ first_name: event.target.value });  // Common approach to push into component state
    }

    handleChangeLastName = (event) => {
        this.setState({ last_name: event.target.value });  // Common approach to push into component state
    }

    handleChangeLocation = (event) => {
        this.setState({ location: event.target.value });  // Common approach to push into component state
    }

    handleChangeDescription = (event) => {
        this.setState({ description: event.target.value });  // Common approach to push into component state
    }

    handleChangeOccupation = (event) => {
        this.setState({ occupation: event.target.value });  // Common approach to push into component state
    }


    handleSubmit = (event) => { // Process submit from this.state
        event.preventDefault();   // Need to stop DOM from generating a POST
        if (this.state.password !== this.state.confirm_password) {
            this.setState({message: "Two passwords did not match"});
            return;
        }
        // login_name, password, first_name, last_name, location, description, occupation
        axios.post('/user', 
            {
                login_name: this.state.login_name,
                password: this.state.password,
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                location: this.state.location,
                description: this.state.description,
                occupation: this.state.occupation,
            }
        ).then (
            (res) => {
                this.props.callback();
            }
        ).catch(
            (rej) => {
                this.setState({message: rej.response.data});
            }
        )
    }

    render() {
        return (
            <div>
                <h1>Register</h1>
                <form onSubmit={this.handleSubmit}>
                    <label className="required"> Login Name:
                    </label>
                    <input type="text"
                            defaultValue={this.state.login_name}
                            onChange={this.handleChangeLoginName} />
                    <br></br>
                    <br></br>
                    <label className="required"> Password:
                    </label>
                    <input type="password"
                            defaultValue={this.state.password}
                            onChange={this.handleChangePassword} />
                    <br></br>
                    <br></br>
                    <label className="required"> Confirm password:
                    </label>
                    <input type="password"
                            defaultValue={this.state.confirm_password}
                            onChange={this.handleChangeConfirmPassword} />
                    <br></br>
                    <br></br>
                    <label className="required"> First Name:
                    </label>
                    <input type="text"
                            defaultValue={this.state.first_name}
                            onChange={this.handleChangeFirstName} />
                    <br></br>
                    <br></br>
                    <label className="required"> Last Name:
                    </label>
                    <input type="text"
                            defaultValue={this.state.last_name}
                            onChange={this.handleChangeLastName} />
                    <br></br>
                    <br></br>
                    <label> Location:
                        <input type="text"
                            defaultValue={this.state.location}
                            onChange={this.handleChangeLocation} />
                    </label>
                    <br></br>
                    <br></br>
                    <label> Description:
                        <textarea
                            defaultValue={this.state.description}
                            onChange={this.handleChangeDescription} />
                    </label>
                    <br></br>
                    <br></br>
                    <label> Occupation:
                        <input type="text"
                            defaultValue={this.state.occupation}
                            onChange={this.handleChangeOccupation} />
                    </label>
                    <br></br>
                    <br></br>
                    <input type="submit" value="Register Me" />
                    <p className="error_message">{this.state.message}</p>
                </form>                
            </div>

        );
    }

}

export default Register;