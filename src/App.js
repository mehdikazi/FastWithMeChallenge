import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CsvParse from '@vtex/react-csv-parse';
import { readFile, Series, DataFrame } from 'data-forge';
import HighLevelDashBoardData from './HighLevelDashBoardData';
import Demographics from './Demographics';
import ActiveUserTable from './ActiveUserTable';
import CheckInStats from './CheckInStats';

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
          <CheckInStats
            questionaireDf={questionaireDf}
            checkinDf={checkinDf}
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
        'is_weight',
        'weight',
        'is_calories',
        'calories_eaten',
        'is_calories_burnt',
        'is_body_fat',
        'is_measurments',
        'is_progress_photos',
        'is_none_chosen',
        'bf_percent',
        'burned_calories',
        'neck',
        'chest',
        'waist',
        'hips',
        'upper_thigh',
        'mid_calf',
        'bicep',
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

// <ActiveUserTable
//   questionaireDf={questionaireDf}
// />

export default App;
