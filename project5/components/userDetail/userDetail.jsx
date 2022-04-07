import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import './userDetail.css';
import { Link } from "react-router-dom";
import fetchModel from '../../lib/fetchModelData';

/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      details: "",
    };
    const promise = fetchModel(`/user/${this.props.match.params.userId}`);
    promise.then(
      (res) => {
        this.setState({ details: JSON.parse(res.data) });
        this.props.callback("userDetail", this.state.details.first_name + " " + this.state.details.last_name);
      },
      (rej) => { console.log(rej); });
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.match.params.userId !== this.props.match.params.userId) {
      const promise = fetchModel(`/user/${this.props.match.params.userId}`);
      promise.then(
        (res) => {
          this.setState({ details: JSON.parse(res.data) });
          this.props.callback("userDetail", this.state.details.first_name + " " + this.state.details.last_name);
        },
        (rej) => { console.log(rej); });
    }
  };

  componentDidMount = () => {
    const promise = fetchModel(`/user/${this.props.match.params.userId}`);
    promise.then(
      (res) => {
        this.setState({ details: JSON.parse(res.data) });
        this.props.callback("userDetail", this.state.details.first_name + " " + this.state.details.last_name);
      },
      (rej) => { console.log(rej); });
  };

  render() {
    let list = [];
    for (let [key, value] of Object.entries(this.state.details)) {
      list.push(
        <div key={key}>
          <ListItem>
            <ListItemText primary={key.replace("_", " ") + ": " + value} />
          </ListItem>
        </div>
      );
    }
    return (
      <Typography variant="h2">
        <List>
          {list}
        </List>
        <Link to={"/photos/" + this.props.match.params.userId}>
          <Typography variant="button">
            Photos
          </Typography>
        </Link>
      </Typography>
    );
  }
}

export default UserDetail;
