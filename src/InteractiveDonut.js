"use strict";

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CsvParse from '@vtex/react-csv-parse';
import { readFile, Series, DataFrame } from 'data-forge';
import {PieChart, Legend} from 'react-easy-chart';

export default class InteractiveDonut extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const config = [
      {color: '#98abc5'},
      {color: '#8a89a6'},
      {color: '#7b6888'},
      {color: '#6b486b'},
      {color: '#a05d56'},
      {color: '#d0743c'},
    ];

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center'
      }}>
        <PieChart
          labels
          data={eval(this.props.data)}
          size={400}
          styles={{
            '.pie-chart-label': {
              fontSize: '1em',
              fill: '#fff',
            },
            '.pie-chart-slice': {
              strokeWidth: 0
            }
          }}
          innerHoleSize={200}
        />
        <div style={{
          marginLeft: -259,
        }}>
          <Legend
            data={eval(this.props.data)}
            dataId={'label'}
            config={config}
            styles={defaultStyles}
            Horizontal
          />
        </div>
      </div>
    );
  }
}

const customStyle = {
  '.legend': {
    backgroundColor: '#f9f9f9',
    border: '1px solid #e5e5e5',
    borderRadius: '12px',
    fontSize: '0.5em',
    maxWidth: '150px',
    padding: '8px'
  }
};

const defaultStyles = {
  '.legend': {
    'list-style': 'none',
    margin: 0,
    padding: 4,
  },
  '.legend li': {
    display: 'block',
    lineHeight: '24px',
    marginRight: '24px',
    marginBottom: '6px',
    paddingLeft: '24px',
    position: 'relative'
  },
  '.legend li.horizontal': {
    display: 'inline-block'
  },
  '.legend .icon': {
    width: '12px',
    height: '12px',
    background: 'red',
    borderRadius: '6px',
    position: 'absolute',
    left: '0',
    top: '50%',
    marginTop: '-6px'
  }
};
