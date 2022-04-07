import React from 'react';
import './States.css';

/**
 * Define States, a React componment of CS142 project #4 problem #2.  The model
 * data for this view (the state names) is available
 * at window.cs142models.statesModel().
 */
class States extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      s: window.cs142models.statesModel(),
      sub: ""
    };
}

  handleChange(event) {
    this.setState({sub: event.target.value});
  }

  handleFilter(){
    let filtered = [];
    for (let i = 0; i < this.state.s.length; i++) {
      let state = this.state.s[i];
      if (state.toLowerCase().includes(this.state.sub.toLowerCase())){
        filtered.push(<li key={state}>{state}</li>);
      }
    }
    if (filtered.length < 1) {
      filtered.push("No matching states with the substring '" + this.state.sub + "'");
    } 
    return filtered;
  }

  render() {
    return (
      <div>
        <br></br>
        <label>Enter a substring to filter the states: </label>
        <input
              type="text"
              value={this.state.sub}
              onChange={(event) => this.handleChange(event)}
        />
        <ul> 
          <li> <b>States</b> </li>
          {this.handleFilter()} 
        </ul>
      </div>
    );
  }
}

export default States;
