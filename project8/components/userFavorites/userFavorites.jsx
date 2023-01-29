/* eslint-disable react/prop-types */
import axios from "axios";
import React from "react";
import { MDBCol } from "mdbreact";
import Lightbox from "react-image-lightbox";
import "./userFavorites.css"
import "./Lightbox.css";

class UserFavorites extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: [],
            modal_window: false,
        }
    }

    componentDidMount() {
        this.findFavorites();
    }

    findFavorites() {
        axios.get(`/user/${this.props.user_id}`).then(
            res => {
                axios.post("/photos", { photo_ids: res.data.favorites }).then(
                    response => {
                        this.setState({ photos: response.data });
                    }
                );
            }
        );
    }

    genImages = () => {
        let res = [];
        if (this.state.photos) {
            for (let i = 0; i<this.state.photos.length; i++){
                const photo = this.state.photos[i];
                var removeFavorite = () => {
                    axios.post("/favorite/remove", {
                        user_id: this.props.user_id,
                        photo_id: photo._id
                    }).then(() => {
                        this.findFavorites();
                    }).catch(err => console.error(err));
                }
                res.push(
                    <MDBCol md="4" key={photo._id}>
                        <li key={photo._id}>
                            <img className='thumbnail'
                                src={`/images/${photo.file_name}`}
                                onClick={() => this.setState({ photo_key: i, modal_window: true })}
                            />
                            <button onClick={removeFavorite}>Unlike</button>
                        </li>
                    </MDBCol>
                );
            }
        }

        return res;
    }

    render() {
        const photos = this.state.photos;
        const index = this.state.photo_key;
        const photo_len = photos.length;
        return (
            <div>
                {this.genImages()}
                {this.state.modal_window ?
                    <Lightbox
                        mainSrc={'/images/' + photos[index].file_name}
                        nextSrc={'/images/' + photos[(index + 1) % photo_len].file_name}
                        prevSrc={
                            '/images/' + photos[(index + photo_len - 1) % photo_len].file_name
                        }
                        imageCaption={
                            "The photo was created on " + photos[index].date_time
                        }
                        onCloseRequest={() => this.setState({ modal_window: false })}
                        onMovePrevRequest={() =>
                            this.setState({
                                photo_key: (index + photo_len - 1) % photo_len
                            })
                        }
                        onMoveNextRequest={() =>
                            this.setState({
                                photo_key: (index + 1) % photo_len
                            })
                        }
                    /> :
                    <></>
                }
            </div>
        );
    }
}

export default UserFavorites;
