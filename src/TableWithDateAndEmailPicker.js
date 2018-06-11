import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { readFile, Series, DataFrame } from 'data-forge';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default class TableWithDateAndEmailPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
     startDate: moment().add(1, 'd'),
     emaill: '',
   };
 }

  handleDateChange = (date) => {
    this.setState({
      startDate: date,
    });
  }

  handleEmailChange = (event) => {
    this.setState({
      email: event.target.value,
    })
  }

  checkDate = (startDate, checkInDate) => {
    if (startDate.isSame(moment().add(1, 'd')), 'day') {
      return true;
    }
    return startDate.isSame(checkInDate, 'day');
  }

  checkEmail = (inputEmail, tableEmail) => {
    if (inputEmail == '' || !inputEmail) {
      return true;
    }
    return tableEmail.startsWith(inputEmail);
  }

  render() {
    const filteredTable = this.props.df
      .where(row => this.checkDate(this.state.startDate, row.check_in_date) && this.checkEmail(this.state.email, row.email));

    const convertedCheckInDatesSeries = filteredTable.getSeries("check_in_date").select(value => value.format("dddd, MMMM Do YYYY"))
    const convertedStartDatesSeries = filteredTable.getSeries("start_date").select(value => value.format("dddd, MMMM Do YYYY"))
    var newDf = filteredTable.withSeries('check_in_date', convertedCheckInDatesSeries)
    newDf = newDf.withSeries('start_date', convertedStartDatesSeries)
    return (
      <div>
        <DatePicker
          selected={this.state.startDate}
          onChange={this.handleDateChange}
        />
        <input value={this.state.email} onChange={this.handleEmailChange} />
        <div dangerouslySetInnerHTML={{ __html: newDf.toHTML() }} />
      </div>
    );
  }
}
