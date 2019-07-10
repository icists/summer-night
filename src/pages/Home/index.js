import React from 'react';

import TeamCard from '../../components/TeamCard';

import { withFirebase } from '../../components/Firebase';

import './Home.css';
import { GameListItem } from '../../components/Game';
import GameMap, { translateGamesToMap } from '../../components/Map';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firebaseColorsLoaded: false,
      firebaseGamesLoaded: false,
      colors: {},
      games: {},
    }
  }

  componentDidMount() {
    this.props.firebase.colors().on('value', snapshot => {
      this.setState({
        firebaseColorsLoaded: true,
        colors: snapshot.val(),
      })
    })
    this.props.firebase.games().on('value', snapshot => {
      this.setState({
        firebaseGamesLoaded: true,
        games: snapshot.val(),
      })
    })
  }

  test = () => {

  }

  render() {
    const { firebaseColorsLoaded, firebaseGamesLoaded, colors , games } = this.state;
    const data = translateGamesToMap(games);
    return (
      <div className="home-page">
        <div className="test">
          <button onClick={this.test}></button>
        </div>
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
          {firebaseGamesLoaded
            ? <ol className="list-group">
                {Object.keys(games).map((gameID) => {
                  const game = games[gameID];
                  return <GameListItem game={game} id={gameID} key={gameID} />;
                })}
            </ol>
            : <div className="loading-mark text-center"> <div className="spinner-border text-secondary" role="status">
                <span className="sr-only">Loading...</span>
              </div></div>}
        </div>
      </div>
    );
  }
}
export default withFirebase(HomePage);