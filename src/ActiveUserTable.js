import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { readFile, Series, DataFrame } from 'data-forge';
import moment from 'moment';
import ColoredTiles from './ColoredTiles';

export default class ActiveUserTable extends Component {
  constructor(props) {
    super(props);
  }

  transform = value => {
    if (value != "Nan") {
      return Number(value);
    } else {
      return 0;
    }
  }

  transform_boolean = value => {
    if (value) {
      return 1;
    } else {
      return 0;
    }
  }

  transform_challenge_period = value => {
    if (value == 31) {
      return 30;
    } else if (value == 61) {
      return 60;
    } else if (value == 91) {
      return 90;
    } else if (!value) {
      return 30;
    } else {
      return Number(value);
    }
  }

  transform_date = value => {
    if (!value) {
      return moment("1997-10-06");
    } else {
      return moment(value + " 2018");
    }
  }

  calculate_is_active(start_date, challenge_period) {
    if (moment().diff(start_date, 'days') + 1 <= challenge_period && moment().diff(start_date, 'days') + 1 > 0) {
      return 1;
    } else {
      return 0;
    }
  }

  render() {
    const new_challenge_period_series = this.props.questionaireDf
      .getSeries("challenge_period")
      .select(value => this.transform_challenge_period(value))
    const new_start_date_series = this.props.questionaireDf
      .getSeries("start_date")
      .select(value => this.transform_date(value))
    var new_df = this.props.questionaireDf.withSeries("challenge_period", new_challenge_period_series);
    new_df = this.props.questionaireDf.withSeries("start_date", new_start_date_series);

    const acitive_user_table = new_df
      .where(row => this.calculate_is_active(row.start_date, row.challenge_period) == 1)
      .setIndex("email")
      .select(row => ({
        first_name: row.first_name,
        last_name: row.last_name,
        schedule: row.schedule,
        day_number: moment().diff(row.start_date, 'days') + 1,
        challenge_period: row.challenge_period
      }))
      .orderBy(column => column.day_number)

    return (
      <div>
        <div dangerouslySetInnerHTML={{ __html: acitive_user_table.toHTML() }} />
      </div>
    );
  }
}
