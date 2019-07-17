import React from 'react';
import { withFirebase } from '../../../components/Firebase';

import './GameAdmin.css';
import { teamToDisplayColor, teamToColor } from '../../../components/Map';
import { withAuthentication, withAuthorization } from '../../../components/Session';
import { compose } from 'recompose';

class GameAdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.GAME_RUNNING_INIT = {
      teamOne: undefined,
      teamTwo: undefined,
      version: "A",
      record: undefined,
    };
    this.state = {
      firebaseGameLoaded: false,
      game: {},
      running: {
        ...this.GAME_RUNNING_INIT
      },
      valid: {
        duplicated: false,
        version: true,
      },
    }
  }

  componentDidMount() {
    const { gameID } = this.props.match.params;
    this.props.firebase.game(gameID).on('value', snapshot => {
      this.setState({
        firebaseGameLoaded: true,
        game: snapshot.val(),
      });
    });
  }

  componentWillUnmount() {
    const { gameID } = this.props.match.params;
    this.props.firebase.game(gameID).off();
  }

  startGame = () => {
    const { gameID } = this.props.match.params;
    this.props.firebase.game(gameID).update({
      isRunning: true,
      isWaiting: false,
    });
  }

  finishGame = e => {
    const { gameID } = this.props.match.params;
    const { valid } = this.state;
    const { type } = this.state.game;
    const { teamOne, teamTwo, version, record } = this.state.running;
    const target = e.currentTarget;

    const game = this.props.firebase.game(gameID);

    if (!valid.version) return;

    if (target.id === 'team-one-card-button-win') {
      /* Team 1 Win */
      if (!teamOne) return alert("Please Enter Team 1");
      game.update({
        isRunning: false,
      }).then(() => {
        if (type === "Record") {
          const newLog = game.child('history').push();
          newLog.set({
            team: parseInt(teamOne, 10),
            version: version,
            record: parseFloat(record),
          });
        }
        if (type === "PassFail") {
          game.update({
            team: parseInt(teamOne, 10),
          });
          const newLog = game.child('history').push();
          newLog.set({
            team: parseInt(teamOne, 10),
            version: version,
            result: 'win',
          });
        }
        if (type === "Match") {
          game.child('history').push().set({
            team: parseInt(teamOne, 10),
            version: version,
            result: 'win'
          });
          game.child('history').push().set({
            team: parseInt(teamTwo, 10),
            version: version,
            result: 'lose',
          });
          game.child(`history/group/${teamToColor(teamOne).toLowerCase()}`)
            .ref.transaction(currPoint => {
              if (currPoint) { return currPoint + 1; }
              else { return 1; }
            }, (error, committed, snapshot) => {
                snapshot.ref.parent.once('value', groupSnapshot => {
                  let maxGroup = "";
                  let maxPoint = 0;
                  for (let [group, point] of Object.entries(groupSnapshot.val())) {
                    if (point > maxPoint) {
                      maxGroup = group;
                      maxPoint = point;
                    }
                  }
                  console.log(maxGroup, maxPoint);
                  if (teamToColor(teamOne).toLowerCase() === maxGroup) {
                    game.update({ team: teamOne })
                  }
                });
            });
        }
      }).then(() => {
        this.setState({ running: { team: parseInt(teamOne, 10), ...this.GAME_RUNNING_INIT } });
      });
    }


    if (target.id === 'team-one-card-button-lose') {
      /* Team 1 Lose */
      game.update({
        isRunning: false,
      }).then(() => {
        if (type === "PassFail") {
          game.child('history').push().set({
            team: parseInt(teamOne, 10),
            version: version,
            result: 'lose',
          })
        }

      }).then(() => {
        this.setState({ running: { ...this.GAME_RUNNING_INIT } });
      });
    }

    if (target.id === 'team-two-card-button-win') {
      /* Team 2 Win */
      if (!teamOne) return alert("Please enter Team 1");
      if (!teamTwo) return alert("Please enter Team 2");
      game.update({
        isRunning: false,
      }).then(() => {
        if (type === "Match") {
          game.child('history').push().set({
            team: parseInt(teamTwo, 10),
            version: version,
            result: 'win',
          });
          game.child('history').push().set({
            team: parseInt(teamOne, 10),
            version: version,
            result: 'lose',
          });
          game.child(`history/group/${teamToColor(teamTwo).toLowerCase()}`)
            .ref.transaction(currPoint => {
              if (currPoint) { return currPoint + 1; }
              else { return 1; }
            }, (error, committed, snapshot) => {
              snapshot.ref.parent.once('value', groupSnapshot => {
                let maxGroup = "";
                let maxPoint = 0;
                for (let [group, point] of Object.entries(groupSnapshot.val())) {
                  if (point > maxPoint) {
                    maxGroup = group;
                    maxPoint = point;
                  }
                }
                console.log(maxGroup, maxPoint);
                if (teamToColor(teamTwo).toLowerCase() === maxGroup) {
                  game.update({ team: teamTwo })
                }
              });
            });
          }
        }).then(() => {
        this.setState({ running: { ...this.GAME_RUNNING_INIT } });
      });
    }
  }

  abortGame = e => {
    const { gameID } = this.props.match.params;
    this.props.firebase.game(gameID).update({
      isRunning: false,
    });
    this.setState({
      running: {
        teamOne: undefined,
        teamTwo: undefined,
        version: "",
        record: undefined,
      }
    });
  }

  toggleWait = () => {
    const { isWaiting } = this.state.game;
    const { gameID } = this.props.match.params;
    this.props.firebase.game(gameID).update({
      isWaiting: isWaiting ? false : true,
    });
  }

  onRunningChange = e => {
    const target = e.currentTarget;
    this.setState(prevState => ({
      running: {
        ...prevState.running,
        [target.name]: target.value,
      }
    }), () => {
      const { version } = this.state.running;
      
      this.setState(prevState => ({
        valid: {
          ...prevState.valid,
          version: version ? true : false,
        }
      }));
    });
  }

  render() {
    const { firebaseGameLoaded, game, running, valid } = this.state;
    const { history } = this.state.game;
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
        <h3 className="text-center" id="game-admin-title">Game: {game.name}</h3>

        <div className="row">
          <div className="col game-admin-running text-center">
            {game.isRunning
              ? <button className="btn btn-secondary btn-block" type="button" disabled>
                  Game is running
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                </button>
              : <button className="btn btn-primary btn-block" type="button" onClick={this.startGame}>
                  Game Start!
                </button>}
          </div>
          {game.type === 'Match'
              ? (game.isWaiting
                ? <div className="col game-admin-waiting text-center">
                    <button className="btn btn-secondary btn-block" type="button" onClick={this.toggleWait}>
                      Waiting
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    </button>
                  </div>
                : <div className="col game-admin-waiting text-center">
                    <button className="btn btn-primary btn-block" type="button" disabled={game.isRunning} onClick={this.toggleWait}>
                      Not waiting
                    </button>
                  </div>)
              : null}
        </div>

        <hr/>

        <div className="game-admin-team-match">
          <div className="row">
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <div className="container">
                    <div className="row">
                      <div className="col-4 text-center">
                        <label className="">Team</label>
                      </div>
                      <div className="col-8">
                        <input className="form-control" type="number" disabled={!game.isRunning} name="teamOne" value={running.teamOne && running.teamOne !== -1 ? running.teamOne : ""} onChange={this.onRunningChange}/>
                      </div>
                    </div>
                    {game.type === 'Record'
                      ? <div className="row">
                          <div className="col-4 text-center">
                            <label className="">Record</label>
                          </div>
                          <div className="col-8">
                            <input className="form-control" type="number" disabled={!game.isRunning} name="record" value={running.record ? running.record : ""} onChange={this.onRunningChange} />
                          </div>
                        </div>
                      : null}
                  </div>
                  <hr/>
                  <div className="row">
                    <div className="col">
                      <div className="team-color">
                        <div className="card">
                          <div className="team-color-card card-body" style={{ backgroundColor: teamToDisplayColor(running.teamOne) }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr/>
                  <div className="row">
                    <div className="col">
                      <button className="btn btn-primary btn-block" id="team-one-card-button-win" disabled={!game.isRunning} onClick={this.finishGame}> {game.type !== 'Record' ? <span>Win</span> : <span>Record</span>}  </button>
                    </div>
                    {game.type === 'PassFail' ? <div className="col"> <button className="btn btn-primary btn-block" id="team-one-card-button-lose" disabled={!game.isRunning} onClick={this.finishGame}> {game.type !== 'Record' ? <span>Lose</span> : <span>Record</span>}  </button></div> : null}
                  </div>
                </div>
              </div>
            </div>
            {game.type === 'Match'
              ? <div className="col">
                  <div className="card">
                    <div className="card-body">
                      <div className="container">
                        <div className="row">
                          <div className="col-4 text-center">
                            <label className="">Team</label>
                          </div>
                          <div className="col-8">
                            <input className="form-control" type="number" disabled={!game.isRunning} name="teamTwo" value={running.teamTwo ? running.teamTwo : ""} onChange={this.onRunningChange} />
                          </div>
                        </div>
                      </div>
                      <hr/>
                      <div className="row">
                        <div className="col">
                          <div className="team-color">
                            <div className="card">
                              <div className="card-body" style={{ backgroundColor:teamToDisplayColor(running.teamTwo) }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr />
                      <button className="btn btn-primary btn-block" id="team-two-card-button-win" disabled={!game.isRunning} onClick={this.finishGame}> Win </button>
                    </div>
                  </div>
                </div>
              : null}
          </div>
        </div>
        <div className="game-version row">
          <div className="offset-2 col-4 align-middle text-center ">
            <label>Game Version</label>
          </div>
          <div className="col-4">
            <input
              className="form-control"
              type="text"
              name="version"
              value={running.version ? running.version : ""}
              onChange={this.onRunningChange}
              style={{borderColor: valid.version ? "inherit" : "red" }}
            />
          </div>
        </div>
        {!valid.version ?
          <>
          <hr />
          <div className="row">
            <div className="col">
              <div className="alert alert-danger">
                Please enter game version :)
              </div>
            </div>
            </div>
          </> : null}
        <hr/>
        <button className="btn btn-danger btn-block" disabled={!game.isRunning} onClick={this.abortGame}>Abort Game</button>
        <hr/>

        <div className="game-admin-history">
          <h5>History</h5>
          <div className="list-group">
            {history
              ? Object.keys(history).reverse().map(historyID => {
                if (historyID === 'group') return null;
                const log = history[historyID];
                return (
                  <li key={historyID} className="list-group-item d-flex justify-content-between align-items-center">
                    <span
                      className="log-team-color-badge badge badge-pill"
                      style={{ backgroundColor: teamToDisplayColor(log.team) }}
                    >{log.result !== 'lose' ? <span>Win</span> : <span>Lose</span> }</span>
                    <ul className="list-group list-group-horizontal">
                      <li className="list-group-item">Team: {log.team}</li>
                      <li className="list-group-item">Version: {log.version}</li>
                      {game.type === 'Record' ?
                      <li className="list-group-item">Record: {log.record}</li> : null}
                    </ul>
                  </li>
                );
              })
              : <div className="card text-center">
                  <div className="card-body">
                    No history
                  </div>
                </div>}
          </div>
        </div>

      </div>
    )
  }
}

const condition = authUser => authUser != null;

export default compose(
  withFirebase,
  withAuthentication,
  withAuthorization(condition)
)(GameAdminPage);