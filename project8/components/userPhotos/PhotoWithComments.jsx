/* eslint-disable react/prop-types */
import React from 'react';
import {
    Typography
} from '@material-ui/core';
import './userPhotos.css';
import { Link } from "react-router-dom";
import axios from 'axios';
import { MentionsInput, Mention } from 'react-mentions';
import { FaRegHeart, FaHeart } from 'react-icons/fa'


class PhotoWithComments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: "",
            comment: "",
            comment_submitted: false,
            fail: false,
            mentions: [],
            liked: false,
        };
    }

    componentDidMount() {
        axios.get(`/user/${this.props.user_id}`).then(
            res => {
                let value = false;
                if (res.data.favorites.includes(this.props.photo._id)){
                    value = true;
                }
                this.setState({liked: value});
            }
        ).catch(err => console.error(err));
    }

    genComments = (comments) => {
        if (comments) {
            return (
                comments.map((comment) => (
                    <Typography variant="body1" key={comment.comment + comment.date_time}>
                        {comment.date_time + " "}
                        <Link className="username" to={"/users/" + comment.user._id}>
                            {comment.user.first_name + " " +
                                comment.user.last_name}
                        </Link>
                        <br />
                        {comment.comment}
                    </Typography>
                )));
        }
        return "";
    }

    handleChangeText = (event) => {
        this.setState({ comment: event.target.value });

    }

    handleConfirm = () => {
        this.setState({ comment_submitted: false, fail: false, mentions: [] });
        this.props.handleConfirm();
    }

    handleFail = () => {
        if (this.state.fail) {
            return (
                <div>
                    <p>Cannot submit an empty comment.</p>
                    <button onClick={this.handleConfirm}>Confirm</button>
                </div>
            );
        }

    }

    handleAdd = (username) => {
        let mentions = this.state.mentions;
        mentions.push(username);
        this.setState({ mentions: mentions });
    }

    getSuggestions = (search, callback) => {
        axios.get("user/list").then(
            (res) => {
                let suggestions = [];
                for (let i = 0; i < res.data.length; i++) {
                    let username = res.data[i].login_name;
                    if (username.toLowerCase().includes(search.toLowerCase())) {
                        suggestions.push({
                            id: username,
                            display: username
                        });
                    }
                }
                return suggestions;
            }).then((res) => callback(res));
    }

    handleSubmit = (event) => { // Process submit from this.state
        axios.post(`/commentsOfPhoto/${this.props.photo._id}`, {
            comment: event.target[0].value,
            mentions: this.state.mentions,
        }).then(
            (res) => { },
            (rej) => { this.setState({ fail: true }); });
        this.setState({
            comment_submitted: true,
            comment: "",
        });
    }

    genAddComment = () => {
        if (this.state.comment_submitted) {
            if (this.state.comment_submitted && !this.state.fail) {
                return (
                    <div className="pop-up">
                        <p>The request was successful!</p>
                        <button onClick={this.handleConfirm}>Confirm</button>
                    </div>
                );
            } else {
                return;
            }
        } else {
            return (
                <div>
                    <h2>Add Comment</h2>
                    <form onSubmit={this.handleSubmit} >
                        <MentionsInput
                            value={this.state.comment}
                            id={this.props.photo._id}
                            onChange={this.handleChangeText}
                            placeholder="Mention someone using @login_name"
                        >
                            < Mention
                                trigger="@"
                                data={this.getSuggestions}
                                onAdd={this.handleAdd}
                                displayTransform={(id) => "@" + id}
                            />
                        </MentionsInput>
                        <br></br>
                        <input type="submit" value="Comment" />
                        <br></br>
                        <br></br>
                    </form>
                </div>
            );
        }

    }

    handleClickLike = () => {
        if (!this.state.liked) {
            axios.post("/favorite/add", {
                user_id: this.props.user_id,
                photo_id: this.props.photo._id,
            }).then().catch(err => console.error(err));
        } else {
            axios.post("/favorite/remove", {
                user_id: this.props.user_id,
                photo_id: this.props.photo._id,
            }).then().catch(err => console.error(err));
        }
        this.setState({ liked: !this.state.liked });

    }

    render() {
        let photo = this.props.photo;
        let comments = photo.comments;
        return (
            <div>
                <div className='photo' key={photo._id}>
                    <img src={"./images/" + photo.file_name} />
                    <br />
                    <button onClick={this.handleClickLike}>
                        {this.state.liked ?
                            <div><FaHeart /> Liked</div>
                            : <div><FaRegHeart /> Like this photo</div>}

                    </button>
                    <br />
                    <Typography variant="caption">
                        creation time: {photo.date_time} <br />
                    </Typography>
                    <div>
                        {this.genComments(comments)}
                        {this.genAddComment(photo._id)}
                        {this.handleFail()}
                    </div>
                </div>
            </div>
        );
    }

}

export default PhotoWithComments;