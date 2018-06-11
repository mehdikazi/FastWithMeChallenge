import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class ColoredTiles extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const color = this.props.color
    return (
      <div style={{
        width: 168,
        height: 168,
        padding: 8,
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 16,
        backgroundColor: color,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alighContent: 'center',
        flexDirection: 'column',
      }}>
        <div style={{
          fontSize: 20,
          color: '#fff',
          textAlign: 'center',
        }}>
          {this.props.description}
        </div>
        <div style={{
          color: '#fff',
          fontSize: 60,
          marginTop: 24,
        }}>
          {this.props.number}
        </div>
      </div>
    );
  }
}
