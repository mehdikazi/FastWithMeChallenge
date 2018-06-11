import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { readFile, Series, DataFrame } from 'data-forge';
import moment from 'moment';

export default class PerfectStreak extends Component {
  constructor(props) {
    super(props);
 }

  render() {
    const countCheckIns = this.props.df
      .groupBy(row => row.email)
      .select(group => ({
        email: group.first().email,
        start_date: group.first().start_date,
        number_of_check_ins: group.deflate(row => row.check_in_date).count(),
      }))
      .inflate()
      .where(row => row.number_of_check_ins == (moment().diff(row.start_date, 'days') + 1))
      .select(row => ({
        email: row.email,
        start_date: row.start_date.format("dddd, MMMM Do YYYY"),
        number_of_check_ins: row.number_of_check_ins
      }))



    return (
      <div>
        <div dangerouslySetInnerHTML={{ __html: countCheckIns.toHTML() }} />
      </div>
    );
  }
}
