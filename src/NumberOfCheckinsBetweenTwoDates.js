import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { readFile, Series, DataFrame } from 'data-forge';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default class NumberOfCheckinsBetweenTwoDates extends Component {
  constructor(props) {
    super(props);
    this.state = {
     startDate: moment(),
     endDate: moment(),
   };
 }

  handleStartDateChange = (date) => {
    this.setState({
      startDate: date,
    });
  }

  handleEndDateChange = (date) => {
    this.setState({
      endDate: date,
    });
  }

  checkDate = (checkInDate) => {
    if (checkInDate.isSameOrAfter(this.state.startDate, 'day') && checkInDate.isSameOrBefore(this.state.endDate, 'day')) {
      return true;
    }
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
      .inflate();

    return (
      <div>
        <DatePicker
          selected={this.state.startDate}
          onChange={this.handleStartDateChange}
        />
        <DatePicker
          selected={this.state.endDate}
          onChange={this.handleEndDateChange}
        />
        <div dangerouslySetInnerHTML={{ __html: countCheckIns.toHTML() }} />
      </div>
    );
  }
}
