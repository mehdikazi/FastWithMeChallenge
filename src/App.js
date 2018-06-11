import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CsvParse from '@vtex/react-csv-parse';
import { readFile, Series, DataFrame } from 'data-forge';
import HighLevelDashBoardData from './HighLevelDashBoardData';
import Demographics from './Demographics';
import NegativeRatings from './NegativeRatings';
import ActiveUserTable from './ActiveUserTable';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questionaireData: null,
      checkInData: null
    }
  }

  handleQuestionaireData = questionaireData => {
    this.setState({ questionaireData })
  }

  handleCheckInData = checkInData => {
    this.setState({ checkInData })
  }

  handleError = error => {
    this.setState({ error })
  }

  render() {
    if (this.state.questionaireData && this.state.checkInData) {
      var questionaireDf = new DataFrame(this.state.questionaireData);
      const questionaireTable = questionaireDf.toHTML();

      var checkinDf = new DataFrame(this.state.checkInData);
      const checkInTable = checkinDf.toHTML();

      var joinedDf = questionaireDf.join(
        checkinDf,
        left => left.email,
        right => right.email,
        (left, right) => {
          return {
            email: left.email,
            first_name: left.first_name,
            last_name: left.last_name,
            check_in_date: right.date,
            weight_on_day: right.weight,
            goal_weight: left.goal_weight,
            city_state: left.city_state,
          }
        }
      )
      const joinTable = joinedDf.toHTML();

      return (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <HighLevelDashBoardData
              questionaireDf={questionaireDf}
            />
            <Demographics
              questionaireDf={questionaireDf}
            />
          </div>
          <h1> Check-In Stats </h1>
          <NegativeRatings
            checkinDf={checkinDf}
          />
          <ActiveUserTable
            questionaireDf={questionaireDf}
          />
        </div>
      )
    } else {
      const questionaireKeys = [
        'first_name',
        'last_name',
        'agree_to_terms',
        'gender',
        'age',
        'is_new_to_if',
        'is_wl_goal',
        'goal_weight',
        'start_weight',
        'height',
        'activity_level',
        'schedule',
        'schedule_4_3',
        'time_4_3',
        'schedule_5_2',
        'time_5_2',
        'time_20_4',
        'time_16_8',
        'email',
        'city_state',
        'country',
        'facebook_url',
        'weight_loss_from_if',
        'introduction',
        'start_date',
        'submited_at',
        'token',
        'challenge_period',
      ]
      const checkInKeys = [
        'token',
        'date',
        'fast_or_eat',
        'weight',
        'calories',
        'is_workout_calories',
        'is_body_fat',
        'is_measurments',
        'is_progress_photos',
        'none_chosen',
        'bf_percent',
        'burned_calories',
        'neck',
        'chest',
        'waist',
        'hips',
        'upper_thigh',
        'mid_calf',
        'bicept',
        'forearm',
        'front_facing',
        'side_facing',
        'rating',
        'notes',
        'name',
        'email',
        'tdee',
        'goal'
      ]
      return (
        <div>
          <h1>FastWithMe Challenge Dashboard</h1>
          <div>
            <div>
              Upload FastWithMe Challenge Questionaire
            </div>
            <CsvParse
              keys={questionaireKeys}
              onDataUploaded={this.handleQuestionaireData}
              onError={this.handleError}
              render={onChange => <input type="file" onChange={onChange} />}
            />
          </div>

          <div>
            <div>
              Upload FastWithMe Challenge Check-Ins
            </div>
            <CsvParse
              keys={checkInKeys}
              onDataUploaded={this.handleCheckInData}
              onError={this.handleError}
              render={onChange => <input type="file" onChange={onChange} />}
            />
          </div>
        </div>
      );
    }
  }
}

export default App;
