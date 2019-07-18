import React from 'react';

import TeamCard from '../../components/TeamCard';

import { withFirebase } from '../../components/Firebase';

import './Home.css';
import { GameListItem } from '../../components/Game';
import GameMap, { translateGamesToMap } from '../../components/Map';
import { Logo } from '../../assets/icons';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firebaseColorsLoaded: false,
      firebaseGamesLoaded: false,
      firebaseVisibleLoaded: false,
      colors: {},
      games: {},
      visible: {},
    }
  }

  componentDidMount() {
    this.props.firebase.colors().on('value', snapshot => {
      this.setState({
        firebaseColorsLoaded: true,
        colors: snapshot.val(),
      })
    });
    this.props.firebase.games().on('value', snapshot => {
      this.setState({
        firebaseGamesLoaded: true,
        games: snapshot.val(),
      })
    });
    this.props.firebase.visible().on('value', snapshot => {
      this.setState({
        firebaseVisibleLoaded: true,
        visible: snapshot.val(),
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.colors().off();
    this.props.firebase.games().off();
    this.props.firebase.visible().off();
  }

  renderEndgame() {
    const { firebaseColorsLoaded } = this.state;
    return (
      <div className="home-page">
        <div className="score-board">
          {firebaseColorsLoaded
            ? <React.Fragment><div className="score-board-team-cards">
                <TeamCard teamNumber={1} teamName="Red" point="?" />
                <TeamCard teamNumber={2} teamName="Yellow" point="?" />
                <TeamCard teamNumber={3} teamName="Blue" point="?" />
                <TeamCard teamNumber={4} teamName="Purple" point="?" />
              </div>
              <div className="home-page-game-section">
                <div className="home-page-game-map text-center">
                  <h3> The summer night ends soon </h3>
                  <div className="card text-center">
                    <div className="card-body">
                      <img className="home-page-game-end-logo" src={Logo} alt="ICISTS logo"/>
                    </div>
                  </div>
                  <h6 style={{padding: "1rem"}}>
                     Please hurry to catch the flags!
                  </h6>
                </div>
                <hr />
                <div className="home-page-game-list"></div>
              </div>
            </React.Fragment>
            : <div className="loading-mark text-center">
                <div className="spinner-border text-secondary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>}
        </div>
      </div>
    );
  }

  render() {
    const { firebaseColorsLoaded, firebaseGamesLoaded, colors , games } = this.state;
    const { visible } = this.state.visible;
    const data = translateGamesToMap(games);

    if (!visible) {
      return this.renderEndgame();
    }
    return (
      <div className="home-page">
        <div className="score-board">
          {firebaseColorsLoaded
            ? <div className="score-board-team-cards">
                <TeamCard teamNumber={1} teamName="Red" point={colors.red.point} />
                <TeamCard teamNumber={2} teamName="Yellow" point={colors.yellow.point} />
                <TeamCard teamNumber={3} teamName="Blue" point={colors.blue.point} />
                <TeamCard teamNumber={4} teamName="Purple" point={colors.purple.point} />
              </div>
            : <div className="loading-mark text-center"> <div className="spinner-border text-secondary" role="status">
                <span className="sr-only">Loading...</span>
              </div> </div>}
        </div>
        <div className="home-page-game-section">
          <div className="home-page-game-map">
            <h3>1F</h3>
            <GameMap id="mapFirstFloor" data={data[1]}/>
            <hr/>
            <h3>2F</h3>
            <GameMap id="mapSecondFloor" data={data[2]}/>
          </div>
          <hr/>
          <div className="home-page-game-list">
          {firebaseGamesLoaded
            ? <ol className="list-group">
                {Object.keys(games).map((gameID) => {
                  const game = games[gameID];
                  return <GameListItem game={game} id={gameID} key={gameID} />;
                })}
            </ol>
            : <div className="loading-mark text-center">
                <div className="spinner-border text-secondary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>}
          </div>
        </div>
      </div>
    );
  }
}
export default withFirebase(HomePage);