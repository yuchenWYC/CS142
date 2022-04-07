import React from 'react';
import ReactDOM from 'react-dom';

import { HashRouter, Route, Link } from "react-router-dom";

import States from './components/states/States';
import Example from './components/example/Example';
import Header from './components/header/Header';
import "./p5.css";

class Page extends React.Component {

    render() {
        return (
            <HashRouter>
                <div>
                    <br></br>
                    <div className="toolbar">
                        <Link to="/example"><button className='left'> Example </button></Link>
                        <Link to="/states"><button> States </button></Link>
                    </div>
                    <Route exact path="/states" component={States} />
                    <Route exact path="/example" component={Example} />
                </div>
            </HashRouter>
        );
    }
}

ReactDOM.render(
    <div>
        <Header />
        <Page />
    </div>,
    document.getElementById('reactapp'),
);