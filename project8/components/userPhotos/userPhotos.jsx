/* eslint-disable react/prop-types */
import React from 'react';
import './userPhotos.css';
import axios from 'axios';
import PhotoWithComments from './PhotoWithComments'
import { MentionsInput, Mention } from 'react-mentions'

/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: {},
            userName: "",
        };
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.match.params.userId !== this.props.match.params.userId) {
            axios.get(`/user/${this.props.match.params.userId}`).then(
                (res) => {
                    this.setState({ userName: res.data.first_name + " " + res.data.last_name });
                    this.props.callback("userPhotos",
                        res.data.first_name + " " + res.data.last_name,
                    );
                },
                (rej) => { console.log(rej); });

            axios.get(`/photosOfUser/${this.props.match.params.userId}`).then(
                (res) => {
                    this.setState({ photos: res.data });
                },
                (rej) => { console.log(rej); });
        }
    };

    componentDidMount = () => {
        axios.get(`/user/${this.props.match.params.userId}`).then(
            (res) => {
                this.setState({ userName: res.data.first_name + " " + res.data.last_name });
                this.props.callback("userPhotos",
                    res.data.first_name + " " + res.data.last_name,
                );
            },
            (rej) => { console.log(rej); });

        axios.get(`/photosOfUser/${this.props.match.params.userId}`).then(
            (res) => {
                this.setState({ photos: res.data });
            },
            (rej) => { console.log(rej); });

    };


    handleConfirm = () => {
        axios.get(`/photosOfUser/${this.props.match.params.userId}`).then(
            (res) => {
                this.setState({ photos: res.data, });
            },
            (rej) => { console.log(rej); });
    }


    render() {
        let list = [];
        for (let i = 0; i < this.state.photos.length; i++) {
            let photo = this.state.photos[i];
            list.push(<PhotoWithComments key={i} photo={photo} handleConfirm={this.handleConfirm}
                user_id={this.props.user_id} />)
        }
        return (
            <div>
                {list}
            </div>

        );
    }
}

export default UserPhotos;