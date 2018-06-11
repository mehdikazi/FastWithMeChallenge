import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { readFile, Series, DataFrame } from 'data-forge';

export default class NegativeRatings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
    }
  }

  onChange = (event) => {
    this.setState({
      value: event.target.value
    });
  }

  render() {
    const table = this.props.checkinDf
      .where(row => row.rating == 1)
      .groupBy(row => row.email)
      .select(group => ({
        email: group.first().email,
        number_one_stars: group.deflate(row => row.rating).count()
      }))
      .inflate()
      .where(row => row.number_one_stars >= this.state.value);

    return (
      <div>
        <input type='number' value={this.state.value} onChange={this.onChange} />
        <div dangerouslySetInnerHTML={{ __html: table.toHTML() }} />
      </div>
    );
  }
}
