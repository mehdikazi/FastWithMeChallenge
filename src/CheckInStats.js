import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { readFile, Series, DataFrame } from 'data-forge';
import moment from 'moment';
import TableWithDateAndEmailPicker from './TableWithDateAndEmailPicker';
import NegativeRatings from './NegativeRatings';
import NumberOfCheckinsBetweenTwoDates from './NumberOfCheckinsBetweenTwoDates';
import HasntCheckedInXTimesSinceYDate from './HasntCheckedInXTimesSinceYDate';
import PerfectStreak from './PerfectStreak';
import NumberOfWeeksInChallenge from './NumberOfWeeksInChallenge';

export default class CheckInStats extends Component {
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

  transform_calories_eaten = value => {
    if (value != "Nan") {
      return Number(value);
    } else {
      return "missing";
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

  transform_checkin_date = value => {
    if (!value) {
      return moment("1997-10-06");
    } else {
      return moment(value);
    }
  }

  calculate_is_active(start_date, challenge_period) {
    if (moment().diff(start_date, 'days') + 1 <= challenge_period && moment().diff(start_date, 'days') + 1 > 0) {
      return 1;
    } else {
      return 0;
    }
  }

  calculateActiveUsers = () => {
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
      .select(row => ({
        email: row.email,
        first_name: row.first_name,
        last_name: row.last_name,
        schedule: row.schedule,
        day_number: moment().diff(row.start_date, 'days') + 1,
        challenge_period: row.challenge_period,
        start_date: row.start_date,
      }))

    return acitive_user_table;
  }

  joinActiveUserAndCheckin = (activeUserDf) => {
    const joinedDf = activeUserDf.join(
      this.props.checkinDf,
      left => left.email,
      right => right.email,
      (left, right) => {
        return {
          email: left.email,
          first_name: left.first_name,
          last_name: left.last_name,
          check_in_date: right.date,
          weight_on_day: right.weight,
          goal_weight: right.goal,
          rating: right.rating,
          schedule: left.schedule,
          challenge_period: left.challenge_period,
          calories_eaten: right.calories_eaten,
          day_of_challenge: left.day_number,
          start_date: left.start_date,
        }
      }
    );
    return joinedDf;
  }

  cleanDf = (df) => {
    const new_checkin_series = df
      .getSeries("check_in_date")
      .select(value => this.transform_checkin_date(value));

    const new_weight_series = df
      .getSeries("weight_on_day")
      .select(value => this.transform(value));

    const new_goal_weight_series = df
      .getSeries("goal_weight")
      .select(value => this.transform(value));

    const new_calories_eaten_series = df
      .getSeries("calories_eaten")
      .select(value => this.transform_calories_eaten(value))

    var new_df = df.withSeries("check_in_date", new_checkin_series);
    new_df = new_df.withSeries("weight_on_day", new_weight_series);
    new_df = new_df.withSeries("goal_weight", new_goal_weight_series);
    new_df = new_df.withSeries("calories_eaten", new_calories_eaten_series);

    return new_df

  }

  addDayNumberForCheckin = (df) => {
    const new_series = df
      .select(row => ({
        day_of_checkin: row.check_in_date.diff(row.start_date, 'days') + 1
      }))
      .deflate(row => row.day_of_checkin);

    const new_df = df
      .withSeries("day_of_checkin", new_series);

    return new_df;
  }

  render() {
    const activeUserDf = this.calculateActiveUsers();
    const joinedDf = this.joinActiveUserAndCheckin(activeUserDf);
    const cleanedDf = this.cleanDf(joinedDf);
    const addDayNumberForCheckinDf = this.addDayNumberForCheckin(cleanedDf);
    const finalDf = addDayNumberForCheckinDf
      .select(row => ({
        email: row.email,
        first_name: row.first_name,
        last_name: row.last_name,
        check_in_date: row.check_in_date.format("dddd, MMMM Do YYYY"),
        day_of_checkin: row.day_of_checkin,
        current_day_in_challenge: row.day_of_challenge,
        weight: row.weight_on_day,
        rating: row.rating,
        calories_eaten: row.calories_eaten,
        goal_weight: row.goal_weight,
        challenge_period: row.challenge_period,
        schedule: row.schedule,
        start_date: row.start_date.format("dddd, MMMM Do YYYY"),
      }));

    return (
      <div>
        <h3>Filter by date or email (or both!)</h3>
        <TableWithDateAndEmailPicker
          df={addDayNumberForCheckinDf}
        />

        <h3>Filter by # of negative since a date</h3>
        <NegativeRatings
          df={addDayNumberForCheckinDf}
        />

        <h3>Number of check ins between two dates</h3>
        <NumberOfCheckinsBetweenTwoDates
          df={addDayNumberForCheckinDf}
        />

        <h3>Hasnt checked in X times since Date Y</h3>
        <HasntCheckedInXTimesSinceYDate
          df={addDayNumberForCheckinDf}
        />

        <h3>Has a perfect streak!</h3>
        <PerfectStreak
          df={addDayNumberForCheckinDf}
        />

        <h3>Number of weeks in challege</h3>
        <NumberOfWeeksInChallenge
          df={addDayNumberForCheckinDf}
        />
      </div>
    );
  }
}
