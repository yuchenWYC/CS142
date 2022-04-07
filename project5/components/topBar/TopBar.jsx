import React from 'react';
import {
  AppBar, Typography, Grid
} from '@material-ui/core';
import './TopBar.css';
import fetchModel from '../../lib/fetchModelData';

/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: "",
    };
    const promise = fetchModel("http://localhost:3000/test/info");
    promise.then(
      (res) => {
        this.setState({ info: JSON.parse(res.data)});
      },
      (rej) => { console.log(rej); });
  }

  render() {
    const currentComponent = this.props.state.currentComponent;
    const user = this.props.state.userName;
    var intro = "";
    if (user) {
      if (currentComponent === "userDetail") {
        intro = user;
      }
      else if (currentComponent === "userPhotos") {
        intro = "Photos of " + user;
      }
    }

    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Typography variant="h6" color="inherit">
          <div className='toolbar'>
            <Grid container spacing={8}>
              <Grid item sm={3}>
                Yuchen Wang 
                {" | "}
                Version: {this.state.info.__v}
              </Grid>
              <Grid item sm={9}>
                {intro}
              </Grid>
            </Grid>
          </div>
        </Typography>
      </AppBar>
    );
  }
}

export default TopBar;
