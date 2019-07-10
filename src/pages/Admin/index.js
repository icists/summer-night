import React from 'react';
import { withFirebase } from '../../components/Firebase';
import { GameAdminListItem } from '../../components/Game';


class NewGameBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cell: 1,
      floor: 1,
      name: "",
      type: "PassFail",
      valid: false,
    }
  }

  createNewGame = e => {
    const { cell, floor, name, type, valid } = this.state;
    const { firebase } = this.props;

    if (!valid) {
      return;
    }

    const newGame = firebase.games().push();
    newGame.set({
      location: {
        cell: cell,
        floor: floor,
      },
      name: name,
      type: type,
      team: "Uncaptured",
      isRunning: false,
    });

    this.setState({
      cell: 1,
      floor: 1,
      name: "",
      type: "",
      valid: false,
    });

    e.preventDefault();
  }

  validateGame = () => {
    const { name, cell, floor } = this.state;
    if (!name) {
      this.setState({
        valid: false,
      })
    }
    if (!(1 <= cell && cell <= 42)) {
      this.setState({
        valid: false,
      });
    }
    else {
      this.setState({
        valid: true,
      })
    }
    if (!(1 <= floor && floor <= 2)) {
      this.setState({
        valid: false,
      });
    }
    else {
      this.setState({
        valid: true,
      });
    }

  }

  onChange = e => {
    const target = e.currentTarget;
    this.setState(prevState => ({
      ...prevState,
      [target.name]: target.value,
    }));
    this.validateGame();
  }

  render() {
    const { cell, floor, name, type, valid } = this.state;
    return (
      <React.Fragment>
      <h4>Create New Game</h4>
      <form onSubmit={this.createNewGame} className="container">
        <div className="form-group row">
          <label className="col-4" htmlFor="new-game-name">Game Name</label>
          <input id="new-game-name" type="text" name="name" value={name} onChange={this.onChange} className="game-name col form-control"/>
        </div>
        <div className="form-group row">
          <label className="col-4" htmlFor="new-game-type">Game Type</label>
          <select className="game-type col form-control" name="type" value={type} onChange={this.onChange} id="new-game-type">
            <option value="PassFail">Pass or Fail</option>
            <option value="Match">Team Vs. Team</option>
            <option value="Record">Record</option>
          </select>
        </div>
        <div className="form-group row">
          <label className="col-2" htmlFor="new-game-floor">Floor</label>
          <input type="number" className="col-4 form-control" name="floor" value={floor} onChange={this.onChange} id="new-game-floor"/>
          <label className="col-2" htmlFor="new-game-cell">Cell</label>
          <input type="number" className="col-4 form-control" name="cell" value={cell} onChange={this.onChange} id="new-game-cell"/>
        </div>
        <div className="row">
          <div className="col-4">
            <button className="btn btn-success" type="submit">
              New Game
            </button>
          </div>
          <div className="col">
            { !valid ? <div className="alert alert-danger">Name! Floor is 1 or 2, and Cell is from 1 to 42.</div> : null}
          </div>
        </div>
      </form>
      </React.Fragment>
    );
  }
}

const NewGame = withFirebase(NewGameBase);

class InitializerBase extends React.Component {
  constructor(props) {
    super(props);
  }

  initColors = () => {
    this.props.firebase.colors().set({
      blue: { point: 0 },
      purple: { point: 0 },
      red: { point: 0 },
      yellow: { point: 0 },
    });
  }

  render() {
    return (
      <button className="btn btn-danger" onClick={this.initColors}>Init Games</button>
    );
  }

}

const Initializer = withFirebase(InitializerBase);

class AdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      games: {},
      firebaseGamesLoaded: false,
    }
  }

  componentDidMount() {
    this.props.firebase.games().on('value', snapshot => {
      this.setState({
        games: snapshot.val(),
        firebaseGamesLoaded: true,
      });
    });
  }

  render() {
    const { games, firebaseGamesLoaded } = this.state;
    return (
      <div className="admin-page">
        <div className="display-4 text-center">Admin</div>
        <h3>Games</h3>
        <ol className="list-group">
          {firebaseGamesLoaded
            ? <ol className="list-group">
                {Object.keys(games).map((gameID) => {
                  const game = games[gameID];
                  return <GameAdminListItem game={game} id={gameID} key={gameID} />;
                })}
            </ol>
            : <div className="loading-mark text-center"> <div className="spinner-border text-secondary" role="status">
                <span className="sr-only">Loading...</span>
              </div></div>}
        </ol>
        <hr/>
        <NewGame/>
        <Initializer/>
      </div>
    );
  }
}

export default withFirebase(AdminPage);