import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { readFile, Series, DataFrame } from 'data-forge';
import moment from 'moment';
import ColoredTiles from './ColoredTiles';

export default class Demographics extends Component {
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
    const age_series = this.props.questionaireDf.getSeries("age")
    const new_age_series = age_series.select(value => this.transform(value))
    var new_df = this.props.questionaireDf.withSeries("age", new_age_series);
    const average_age = new_df.getSeries('age').average();

    const new_if_series = new_df.getSeries("is_new_to_if");
    const new_new_if_series = new_if_series.select(value => this.transform_boolean(value));
    const percent_new_if = new_new_if_series.sum() / new_new_if_series.count();

    const current_weight_series = new_df.getSeries("start_weight");
    const goal_weight_series = new_df.getSeries("goal_weight");
    new_df = new_df.withSeries("start_weight", current_weight_series);
    new_df = new_df.withSeries("goal_weight", goal_weight_series);
    const average_expected_loss = new_df
      .select(row => ({
        difference: row.start_weight - row.goal_weight
      }))
      .getSeries('difference')
      .average();
    const median_expected_loss = new_df
      .select(row => ({
        difference: row.start_weight - row.goal_weight
      }))
      .getSeries('difference')
      .median();

    const new_challenge_period_series = new_df
      .getSeries("challenge_period")
      .select(value => this.transform_challenge_period(value))
    const new_start_date_series = new_df
      .getSeries("start_date")
      .select(value => this.transform_date(value))
    new_df = new_df.withSeries("challenge_period", new_challenge_period_series);
    new_df = new_df.withSeries("start_date", new_start_date_series);
    const number_active_users = new_df
      .select(row => ({
        is_active: this.calculate_is_active(row.start_date, row.challenge_period)
      }))
      .getSeries('is_active')
      .sum()

    const demographics_table = new DataFrame([
      {
        Average_Age: Math.round(average_age),
        Percent_New_To_IF: Math.round(percent_new_if*100) / 100,
        Average_Expected_Loss: Math.round(average_expected_loss*100) / 100,
        Median_Expected_Loss: median_expected_loss,
        number_active_users: number_active_users,
      }
    ])

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
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: 32,
        }}>
          <div style={{
            display: 'flex'
          }}>
            <ColoredTiles number={Math.round(percent_new_if*100) / 100} description={"% New To IF"} color={'#98abc5'}/>
            <ColoredTiles number={Math.round(average_expected_loss*100) / 100} description={"Average Expected Loss"} color={"#8a89a6"}/>
            <ColoredTiles number={median_expected_loss} description={"Median Expected Loss"} color={"#7b6888"}/>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 28,
          }}>
            <ColoredTiles number={number_active_users} description={"Active Users"} color={"#6b486b"}/>
            <ColoredTiles number={Math.round(average_age)} description={"Average Age"} color={"#a05d56"}/>
          </div>
        </div>
      </div>
    );
  }
}

// <div dangerouslySetInnerHTML={{ __html: acitive_user_table.toHTML() }} />
