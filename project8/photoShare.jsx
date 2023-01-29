import React from 'react';
import ReactDOM from 'react-dom';
import {
    HashRouter, Route, Switch, Redirect
} from 'react-router-dom';
import {
    Grid, Paper
} from '@material-ui/core';
import './styles/main.css';

// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/userDetail';
import UserList from './components/userList/userList';
import UserPhotos from './components/userPhotos/userPhotos';
import LoginRegister from './components/loginRegister/LoginRegister';
import UserFavorites from './components/userFavorites/UserFavorites';

class PhotoShare extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logged_in: false,
            login_name: undefined,
            userName: "",
            first_name: "",
            last_name: "",
            currentComponent: "",
            user_id: "",
        };
    }

    updateCompName = (curComp, name) => {
        this.setState(
            {
                currentComponent: curComp,
                userName: name,
            });
    };


    updateLoggedIn = (login_value, login_name, first_name, user_id) => {
        this.setState(
            {
                logged_in: login_value,
                login_name: login_name,
                first_name: first_name,
                user_id: user_id,
            })
    }

    userIsLoggedIn = () => {
        return this.state.logged_in;
    }

    render() {
        console.log("logged in?", this.userIsLoggedIn());
        return (
            <HashRouter>
                <div>
                    <Grid container spacing={8}>
                        <Grid item xs={12}>
                            <TopBar state={this.state} callback={this.updateLoggedIn} />
                        </Grid>
                        <Grid item xs={12}>
                        </Grid>
                        <div className="cs142-main-topbar-buffer" />
                        <Grid item sm={3}>
                            <Paper className="cs142-main-grid-item">
                                {
                                    this.userIsLoggedIn() ?
                                        <UserList />
                                        :
                                        <Redirect path="/users/:userId" to="/login-register" />
                                }
                            </Paper>
                        </Grid>
                        <Grid item sm={9}>
                            <Paper className="cs142-main-grid-item">
                                <Switch>
                                    {
                                        this.userIsLoggedIn() ?
                                            <Route path="/users/:userId"
                                                render={props => <UserDetail {...props} callback={this.updateCompName} />}
                                            />
                                            :
                                            <Redirect path="/users/:userId" to="/login-register" />
                                    }
                                    {
                                        this.userIsLoggedIn() ?
                                            <Route path="/photos/:userId"
                                                render={props => <UserPhotos {...props} callback={this.updateCompName} user_id={this.state.user_id}/>}
                                            />
                                            :
                                            <Redirect path="/users/:userId" to="/login-register" />
                                    }
                                    {
                                        this.userIsLoggedIn() ?
                                            <Route path="/favorites"
                                                render={props => <UserFavorites {...props} user_id={this.state.user_id}/>} />
                                            :
                                            <Redirect path="/users/:userId" to="/login-register" />
                                    }
                                    <Route path="/login-register"
                                        render={props => <LoginRegister {...props} callback={this.updateLoggedIn} />} />
                                    <LoginRegister callback={this.updateLoggedIn} />
                                </Switch>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </HashRouter>
        );
    }
}


ReactDOM.render(
    <PhotoShare />,
    document.getElementById('photoshareapp'),
);
