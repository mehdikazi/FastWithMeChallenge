import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { readFile, Series, DataFrame } from 'data-forge';
import InteractiveDonut from './InteractiveDonut';

export default class ProgramBreakdownStats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      challenge_period_data: null,
      schedule_data: null,
      gender_data: null,
      data: null,
      current_stat: "Challenge Periods"
    }
  }

  onClickChallenge = () => {
    this.setState({data: this.state.challenge_period_data})
  }

  onClickSchedule = () => {
    this.setState({data: this.state.schedule_data})
  }

  onClickGender= () => {
    this.setState({data: this.state.gender_data})
  }

  componentWillMount = () => {
    const challenge_period_table = this.props.questionaireDf
      .groupBy(row => row.challenge_period)
      .select(group => ({
        challenge_period: group.first().challenge_period,
        count: group.deflate(row => row.challenge_period).count()
      }))
      .inflate();

    const challenge_period_table_with_color = challenge_period_table
      .select(row => ({
        key: String(row.count),
        value: row.count,
      }))
      .withSeries('color', new Series({values: ['#98abc5', "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]}))
      .withSeries('label', new Series({values: ['30 Days', '30 Days + 1:1', '60 Days + 1:1', '90 Days', '90 Days + 1:1']}));

    const schedule_table = this.props.questionaireDf
      .groupBy(row => row.schedule)
      .select(group => ({
        schedule: group.first().schedule,
        count: group.deflate(row => row.schedule).count()
      }))
      .inflate();

    const schedule_table_with_color = schedule_table
      .select(row => ({
        key: String(row.count),
        value: row.count
      }))
      .withSeries('color', new Series({values: ['#98abc5', "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c"]}))
      .withSeries('label', new Series({values: ['4:3', "20/4", "16/8", "5:2", "6:1", "Unsure"]}));

    const gender_table = this.props.questionaireDf
      .groupBy(row => row.gender)
      .select(group => ({
        gender: group.first().gender,
        count: group.deflate(row => row.gender).count()
      }))
      .inflate();

    const gender_table_with_color = gender_table
      .select(row => ({
        key: String(row.count),
        value: row.count
      }))
      .withSeries('color', new Series({values: ['#98abc5', "#8a89a6", '#7b6888']}))
      .withSeries('label', new Series({values: ['Female', "Male", 'Not Listed']}));

    this.setState({
      data: challenge_period_table_with_color,
      challenge_period_data: challenge_period_table_with_color,
      gender_data: gender_table_with_color,
      schedule_data: schedule_table_with_color,
    });
  }

  onClickUp = () => {
    const stats = ["Challenge Periods", "Schedules", "Gender"]
    const table = [this.state.challenge_period_data, this.state.schedule_data, this.state.gender_data]
    const index = stats.indexOf(this.state.current_stat)
    if (index + 1 < stats.length) {
      this.setState({
        current_stat: stats[index + 1],
        data: table[index + 1]
      })
    } else {
      this.setState({
        current_stat: stats[0],
        data: table[0]
      })
    }
  }

  onClickDown = () => {
    const stats = ["Challenge Periods", "Schedules", "Gender"]
    const table = [this.state.challenge_period_data, this.state.schedule_data, this.state.gender_data]
    const index = stats.indexOf(this.state.current_stat)
    if (index - 1 < 0) {
      this.setState({
        current_stat: stats[stats.length - 1],
        data: table[stats.length - 1]
      })
    } else {
      this.setState({
        current_stat: stats[index - 1],
        data: table[index - 1]
      })
    }
  }

  render() {
    return (
      <div style={{
        width:500,
        paddingTop: 28,
        paddingRight: 40,
      }}>
        <div>
          <div style={{
            fontSize: 24,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 500,
            marginBottom: 4,
          }}>
            <span>
              BreakDown {' '} By:{' '}
              <span style={{fontWeight: 'bold'}}>{this.state.current_stat}</span>
            </span>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              position: 'absolute',
              marginLeft: 220,
            }}>
              <img
                src={require('./images/arrow-up.png')}
                onClick={this.onClickUp}
                style={{
                  cursor: 'pointer'
                }}
              />
              <img
                src={require('./images/arrow-pointing-down.png')}
                onClick={this.onClickDown}
                style={{
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>
          <div style={{backgroundColor: 'black', height: 2, width: 500}}></div>
        </div>
        <div style={{
          marginLeft: 50,
          marginTop: 20,
        }}>
          <InteractiveDonut data={this.state.data.toJSON()}/>
        </div>
      </div>
    );
  }
}
