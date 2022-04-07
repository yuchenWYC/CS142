import React from 'react';
import {
  Divider,
  List,
  ListItem,
}
  from '@material-ui/core';
import './userList.css';
import { Link } from "react-router-dom";
import axios from 'axios';

/**
 * Define UserList, a React componment of CS142 project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: "",
    };
    const promise = axios.get("/user/list");
    promise.then(
      (res) => {
        this.setState({ users: JSON.parse(res.data) });
      },
      (rej) => { console.log(rej); });
  }


  render() {
    let list = [];
    if (this.state.users) {
      for (let i = 0; i < this.state.users.length; i++) {
        let name = this.state.users[i].first_name + " " + this.state.users[i].last_name;
        list.push(
          <div key={this.state.users[i]._id}>
            <ListItem>
              <Link to={"/users/" + this.state.users[i]._id}>{name}</Link>
            </ListItem>
            <Divider />
          </div>
        );
      }
    }

    return (
      <div>
        <List component="nav">
          {list}
        </List>
      </div>
    );
  }
}

export default UserList;
