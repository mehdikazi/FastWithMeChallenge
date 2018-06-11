import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { readFile, Series, DataFrame } from 'data-forge';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default class HasntCheckedInXTimesSinceYDate extends Component {
  constructor(props) {
    super(props);
    this.state = {
     startDate: moment().add(1, 'd'),
     numberOfCheckins: 1,
   };
 }

  handleDateChange = (date) => {
    this.setState({
      startDate: date,
    });
  }

  handleNumberOfCheckinsChange = (event) => {
    this.setState({
      numberOfCheckins: event.target.value,
    })
  }

  checkDate = (checkInDate) => {
    return checkInDate.isSameOrAfter(this.state.startDate, 'day');
  }

  render() {
    const filteredTable = this.props.df
      .where(row => this.checkDate(row.check_in_date));

    const countCheckIns = filteredTable
      .groupBy(row => row.email)
      .select(group => ({
        email: group.first().email,
        number_of_check_ins: group.deflate(row => row.check_in_date).count(),
      }))
      .inflate()
      .where(row => row.number_of_check_ins <= this.state.numberOfCheckins);

    return (
      <div>
        <DatePicker
          selected={this.state.startDate}
          onChange={this.handleDateChange}
        />
        <input type='number' value={this.state.numberOfCheckins} onChange={this.handleNumberOfCheckinsChange} />
        <div dangerouslySetInnerHTML={{ __html: countCheckIns.toHTML() }} />
      </div>
    );
  }
}
