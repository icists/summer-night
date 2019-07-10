import React from 'react';

/**
 * Props
 * - location
 * - game 
 * - point
 */

class Room extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      team: "",
      isRunning: false,
      visible: true,
    }
  }

  render() {
    return (
      <div className="room-header">
        <ul>
          <li>Location: {this.props.location}</li>
          <li>Game: {this.props.game}</li>
          <li>Game Point: {this.props.point}</li>
          <li>{this.state.isRunning ? "A game is runner" : "A game is not running"}</li>
        </ul>
      </div>

    );
  }
}