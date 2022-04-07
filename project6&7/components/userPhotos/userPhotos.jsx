import React from 'react';
import {
  Typography
} from '@material-ui/core';
import './userPhotos.css';
import {Link} from "react-router-dom";
import axios from 'axios';

function gencomments(comments){
  if (comments) {
    return (
      comments.map((comment) => (
        <Typography variant="body1" key={comment.comment}>
          {comment.date_time + " "}
          <Link className="username" to={"/users/" + comment.user._id}>
              {comment.user.first_name + " " +
               comment.user.last_name}
          </Link> 
          <br/>
          {comment.comment}
        </Typography>
        )));
    } 
  return "";
}

/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: "",
    };
    const promise = axios.get(`/photosOfUser/${this.props.match.params.userId}`);
    promise.then(
      (res) => {
        this.setState({photos: JSON.parse(res.data)});
        this.props.callback("userPhotos");
      }, 
      (rej) => {console.log(rej);});
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.match.params.userId !== this.props.match.params.userId){
      this.props.callback("userPhotos");
    }
  };

  componentDidMount = () => {
    this.props.callback("userPhotos");
  };

  render() {
    let list = [];
    for (let i = 0; i < this.state.photos.length; i++){
      let photo = this.state.photos[i];
      let comments = photo.comments;
        list.push(
          <div className='photo' key={photo._id}>
            <img src={"./images/" + photo.file_name}/>
            <br/>
            <Typography variant="caption">
            creation time: {photo.date_time} <br/>
            </Typography>
            <div>
            {gencomments(comments)}
            </div>          
          </div>);

    }
    return (
      <div>
      {list}
      </div>

    );
  }
}

export default UserPhotos;