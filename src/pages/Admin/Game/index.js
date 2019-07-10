import React from 'react';
import { withFirebase } from '../../../components/Firebase';

import './GameAdmin.css';

class GameAdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firebaseGameLoaded: false,
      game: {},
    }
  }

  componentDidMount() {
    const { gameID } = this.props.match.params;
    console.log(gameID);
    this.props.firebase.game(gameID).on('value', snapshot => {
      this.setState({
        firebaseGameLoaded: true,
        game: snapshot.val(),
      })
    })
  }

  render() {
    const { firebaseGameLoaded, game } = this.state;
    if (!firebaseGameLoaded) {
      return (
        <div className="loading-mark text-center">
          <div className="spinner-border text-secondary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }
    return (
      <div className="game-admin-page form-group">
        <h3 id="game-admin-title">Game: {game.name}</h3>
        <div className="game-admin-running">
          {game.isRunning
            ? <button className="btn btn-secondary" type="button" disabled>
                Game is running
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              </button>
            : <button className="btn btn-primary" type="button">
                Game Start!
              </button>}
        </div>
        <div className="game-admin-waiting">
          <input className="form-control" type="checkbox" name="" id=""/>
        </div>
        <div className="game-admin-team-match">
          <div className="game-admin-team-one">
            <label htmlFor="">Team</label>
            <input className="form-control" type="text"/> 
            <div className="game-admin-team-one-color"></div>
          </div>
          <div className="game-admin-team-two">
            <label htmlFor="">Team</label>
            <input className="form-control" type="text"/>
            <div className="game-admin-team-one-color"></div>
          </div>
        </div>
        <div className="game-admin-version"></div>
          <label htmlFor="">Version</label>
          <input className="form-control" type="number"/>
        <div className="game-admin-history">
          <div className="list-group">

          </div>
        </div>

        <div className="game-information form-group">
        </div>

      </div>
    )
  }
}

export default withFirebase(GameAdminPage);