/* eslint-disable react/prop-types */
import React from 'react';
import {
    ListItemText,
} from '@material-ui/core';
import './userDetail.css';
import { Link } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import axios from 'axios';

/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            details: "",
            mentionDetails: [],
            photoOwner: "",
        };
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.match.params.userId !== this.props.match.params.userId) {
            axios.get(`/user/${this.props.match.params.userId}`).then(
                (res) => {
                    this.setState({ details: res.data });
                    this.props.callback("userDetail",
                        this.state.details.first_name + " " + this.state.details.last_name,
                    );
                },
                (rej) => { console.log(rej); });
            axios.get(`/mentionedByPhotos/${this.props.match.params.userId}`,
                {
                    // user_id: this.props.match.params.userId,
                    login_name: this.state.details.login_name
                }
            ).then(
                (res) => {
                    this.setState({ mentionDetails: res.data });
                },
                (rej) => { console.log(rej); });
        }
    };

    componentDidMount = () => {
        axios.get(`/user/${this.props.match.params.userId}`).then(
            (res) => {
                this.setState({ details: res.data });
                this.props.callback("userDetail",
                    this.state.details.first_name + " " + this.state.details.last_name,
                );
            },
            (rej) => { console.log(rej); });

        axios.get(`/mentionedByPhotos/${this.props.match.params.userId}`,
        ).then(
            (res) => {
                this.setState({ mentionDetails: res.data });
            },
            (rej) => { console.log(rej); });

    };

    genMentionDetails = () => {
        let res = [];
        for (let i = 0; i < this.state.mentionDetails.length; i++) {
            let md = this.state.mentionDetails[i];
            res.push(
                <li key={md.photo_id}>
                    <HashLink to={"/photos/" + md.user_id}>
                        <img className='thumbnail' src={"/images/" + md.file_name} />
                    </HashLink>
                    <Link to={"/users/" + md.user_id}>
                        {md.first_name + " " + md.last_name}
                    </Link>
                </li>
            )
        }
        return res;
    }

    render() {
        let list = [];
        for (let [key, value] of Object.entries(this.state.details)) {
            list.push(
                <div key={key}>
                    <li>
                        <ListItemText primary={key.replace("_", " ") + ": " + value} />
                    </li>
                </div>
            );
        }
        return (
            <div>
                <h2>Details of {this.state.details.first_name}</h2>
                <ul>
                    {list}
                </ul>
                <h2>Photos that mentioned {this.state.details.first_name}</h2>
                <ul>
                    {this.genMentionDetails()}
                </ul>
                <Link to={"/photos/" + this.props.match.params.userId}>
                    <button>
                        {this.state.details.first_name}&apos;s Photos
                    </button>
                </Link>
            </div>
        );
    }
}

export default UserDetail;
