import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { readFile, Series, DataFrame } from 'data-forge';
import moment from 'moment';

export default class NumberOfWeeksInChallenge extends Component {
  constructor(props) {
    super(props);
 }

  render() {
    const numberOfWeeks = this.props.df
      .groupBy(row => row.email)
      .select(group => ({
        email: group.first().email,
        start_date: group.first().start_date.format("dddd, MMMM Do YYYY"),
        number_of_weeks_in_challenge: moment().diff(group.first().start_date, 'weeks'),
      }))
      .inflate()
      .orderBy(column => column.number_of_weeks_in_challenge);



    return (
      <div>
        <div dangerouslySetInnerHTML={{ __html: numberOfWeeks.toHTML() }} />
      </div>
    );
  }
}
