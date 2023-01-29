/* eslint-disable react/prop-types */
import React from 'react';
import {
    AppBar, Grid,
} from '@material-ui/core';
import './TopBar.css';
import axios from 'axios';
import { Link } from "react-router-dom";

/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            info: "",
            file_selected: false,
        };
    }

    componentDidMount = () => {
        axios.get("http://localhost:3000/test/info").then(
            (res) => {
                this.setState({ info: res.data });
            },
            (rej) => { console.log(rej); });
    }

    handleLogOut = () => {
        axios.post('/admin/logout').then(
            (res) => {
                this.props.callback(false, undefined, "");
                this.setState({ redirect: true });
            },
            (rej) => { console.log(rej); }
        );
    }

    handleIntro = () => {
        const currentComponent = this.props.state.currentComponent;
        const user = this.props.state.userName;
        let intro = "";
        if (user) {
            if (currentComponent === "userDetail") {
                intro = user;
            }
            else if (currentComponent === "userPhotos") {
                intro = "Photos of " + user;
            }
        }
        return intro;
    }

    //this function is called when user presses the update button
    handleUploadButtonClicked = (e) => {
        e.preventDefault();
        if (this.uploadInput.files.length > 0) {
            // Create a DOM form and add the file to it under the name uploadedphoto
            const domForm = new FormData();
            domForm.append('uploadedphoto', this.uploadInput.files[0]);
            axios.post('/photos/new', domForm)
                .then((res) => {
                    console.log(res.data);
                })
                .catch(err => console.log(`POST ERR: ${err}`));
        } else {
            console.log("No file selected!");
        }
    }

    render() {
        return (
            <AppBar className="cs142-topbar-appBar">
                <div className='toolbar'>
                    <Grid container spacing={6}>
                        <Grid item sm={2}>
                            {
                                this.props.state.logged_in ?
                                    <p>Hi {this.props.state.first_name}</p> :
                                    <p>Please log in</p>
                            }
                        </Grid>
                        <Grid item sm={1}>
                            {
                                this.props.state.logged_in ?
                                <Link className="favorites" to="/favorites"><p className='button'>Favorites</p></Link> :
                                    <></>
                            }
                        </Grid>
                        <Grid item sm={1}>
                            {this.props.state.logged_in ?
                                <p className='button' onClick={this.handleLogOut}>Log out</p>
                                :
                                <></>
                            }
                        </Grid>
                        <Grid item sm={4}>
                            <p>{this.handleIntro()}</p>
                        </Grid>
                        <Grid item sm={4}>
                            {this.props.state.logged_in ?
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={(domFileRef) => { this.uploadInput = domFileRef; }} />
                                    <button onClick={this.handleUploadButtonClicked}>Upload </button>
                                </div>

                                :
                                <></>
                            }
                        </Grid>
                    </Grid>
                </div>
            </AppBar>
        );
    }
}

export default TopBar;
