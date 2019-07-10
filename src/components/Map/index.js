import React from 'react';

import './GameMap.css';

export function translateGamesToMap(games) {
  let map = { 1: {}, 2: {}};
  for (let [id, game] of Object.entries(games)) {
    const cell = {
      [game.location.floor]: {
        [game.location.cell]: {
          ...game,
        }
      }
    };
    Object.assign(map[game.location.floor], cell[game.location.floor]);
  }
  return map;
}

function gameColor(game) {
  if (!game) {
    return 'white';
  }

  if (game.team === 'Uncaptured') {
    return 'rgb(160, 160, 160)';
  }

  if (game.team === 'Red') {
    return 'hotpink';
  }

  if (game.team === 'Yellow') {
    return 'lemonchiffon';
  }

  if (game.team === 'Blue') {
    return 'skyblue';
  }

  if (game.team === 'Purple') {
    return 'violet';
  }
}

const GameMapCell = ({ id, index, data }) => (
  <div
    className={`cell map-cell-${id}-${index}`}
    data-toggle="modal"
    data-target={`#mapCellModal-${id}-${index}`}
    style={{ backgroundColor: gameColor(data)}}
  >
    { id === 'mapFirstFloor' && index === 2 ? <i className="material-icons"> wc </i> : null}
    {data ?
      <div className="modal fade" id={`mapCellModal-${id}-${index}`} tabIndex="-1" role="dialog" aria-labelledby="mapCellModalLabel" aria-hidden={true}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="mapCellModalLabel">{data.name}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              ...
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div> : null}
    {data ? data.name : ""}
  </div>
);

  const GameMap = ({ id, data }) => (
    <div className="game-map">
      {[...(new Array(42)).keys()].map((v, index) => (
        <GameMapCell key={id+(index+1)} id={id} index={index+1} data={data[index+1]} />
      ))}
    </div>
  );

export default GameMap;
