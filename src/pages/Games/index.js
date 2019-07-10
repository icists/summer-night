import React from 'react';

import { withFirebase } from '../../components/Firebase';
import { GameListItem } from '../../components/Game';

class GamesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firebaseLoaded: false,
      games: {},
    }
  }

  componentDidMount() {
    this.props.firebase.games().on('value', snapshot => {
      this.setState({
        firebaseLoaded: true,
        games: snapshot.val(),
      });
    });
  }

  render() {
    const { games, firebaseLoaded } = this.state;

    if (!firebaseLoaded) {
      return (
        <div className="game-page">
          <div className="display-3">Games</div>
          <div className="spinner-border text-secondary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }

    return (
      <div className="game-page">
        <div className="display-3">Games</div>
        <ol className="list-group">
          {Object.keys(games).map(gameID => {
            const game = games[gameID];
            return <GameListItem game={game} key={gameID} />;
          })}
        </ol>
      </div>
    );
  }
}

export default withFirebase(GamesPage);