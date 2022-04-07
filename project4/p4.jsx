import React from 'react';
import ReactDOM from 'react-dom';
import States from './components/states/States';
import Example from './components/example/Example';
import Header from './components/header/Header';

class Jump extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            button_text: "Switch to Example"
        };

    }

    handleClick(){
        if (this.state.button_text === "Switch to Example"){
            this.setState({button_text: "Switch to States"});
        }
        else{
            this.setState({button_text: "Switch to Example"});
        }
    }

    displayPage(){
        if (this.state.button_text === "Switch to Example"){
            return <States/>;
        }
        else {
            return <Example/>;
        }
    }

    render() {
        return (
            <div>
                <br></br>
                <button onClick={()=>this.handleClick()}>
                    {this.state.button_text}
                </button>
                {this.displayPage()}
            </div>
        );
    }
}

ReactDOM.render(
    <div>
        <Header />
        <Jump />
    </div>,
    document.getElementById('reactapp'),
);