import React from 'react';

import './GameMap.css';
import { LavatoryIcon, ElevatorIcon, DoorIcon, StairsIcon } from '../../assets/icons';

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

  /* Hardcoded map facilities */
  Object.assign(map[1], {
    2: { facility: 'lavatory' },
    4: { facility: 'elevator' },
    5: { facility: 'stairs' },
    25: { facility: 'stairs' }
  });
  Object.assign(map[2], {
    3: { facility: 'door' },
    4: { facility: 'elevator' },
    5: { facility: 'stairs' },
    12: { facility: 'lavatory', },
    25: { facility: 'stairs' },
  });
  return map;
}

export function teamToColor(team) {
  if (team <= 0) return 'Uncaptured';
  if (team % 4 === 0) return 'Yellow';
  if (team % 4 === 1) return 'Red';
  if (team % 4 === 2) return 'Purple';
  if (team % 4 === 3) return 'Blue';
}

export function teamToDisplayColor(team) {
  if (team === undefined) return 'rgb(160, 160, 160)';
  if (team <= 0) return 'rgb(160, 160, 160)'; 
  if (team % 4 === 0)
    return '#FFF7B0';
  if (team % 4 === 1)
    return '#E63F5C';
  if (team % 4 === 2)
    return '#FFA1FB';
  if (team % 4 === 3)
    return '#6EC0FF';
}

function mapColor(cell) {
  if (!cell) {
    return 'white';
  }

  if (cell.facility) {
    return 'rgb(240, 240, 240)';
  }

  if (teamToColor(cell.team) === 'Uncaptured') {
    return 'rgb(160, 160, 160)';
  }

  if (teamToColor(cell.team) === 'Red') {
    return '#E63F5C';
  }

  if (teamToColor(cell.team) === 'Yellow') {
    return '#FFF7B0';
  }

  if (teamToColor(cell.team) === 'Blue') {
    return '#6EC0FF';
  }

  if (teamToColor(cell.team) === 'Purple') {
    return '#FFA1FB';
  }
}

function facilityIcon(facility) {
  if (facility === 'lavatory')
    return <img className="facility-icon" src={LavatoryIcon} alt="Lavatory" />;
  
  if (facility === 'elevator')
    return <img className="facility-icon" src={ElevatorIcon} alt="Elevator" />;
  
  if (facility === 'door')
    return <img className="facility-icon" src={DoorIcon} alt="Door"/>;

  if (facility === 'stairs')
    return <img className="facility-icon" src={StairsIcon} alt="Stairs"/>;
}

class GameMapCell extends React.Component {
  render() {
    const { id, index, data } = this.props;
    if (data) {
      // Facility Cell
      if (data.facility) {
        return (
          <div className={`cell map-cell-${id}-${index}`} style={{ backgroundColor: mapColor(data) }} >
            {facilityIcon(data.facility)}
          </div>
        );
      }
      // Game Cell
      if (data.team) {
        return (
          <div
            href="#"
            className={`cell map-cell-${id}-${index} clickable`}
            data-toggle="modal"
            data-target={`#mapCellModal-${id}-${index}`}
            style={{ backgroundColor: mapColor(data)}}
          >
            {data.isRunning
              ? <div className="loading-mark text-center">
                  <div className="spinner-border spinner-border-sm text-secondary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
              </div>
              : null}
            <div className="modal fade" id={`mapCellModal-${id}-${index}`} tabIndex="-1" role="dialog" aria-labelledby="mapCellModalLabel" aria-hidden={true}>
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="mapCellModalLabel">
                      {data.name} {data.isRunning ? <span className="badge badge-info">Running</span> : <span className="badge badge-secondary">Free to go</span>}
                    </h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="game-small-info">
                      <ul>
                        <li> Floor: {data.location.floor} </li>
                        <li> Type: {data.type} </li>
                        <li> Rules: {data.rules} </li>
                        <li> Team: {data.team} </li>
                      </ul>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
              </div>
          </div>
        );
      }
    }
    else {
      return (
          <div className={`cell map-cell-${id}-${index}`} style={{ backgroundColor: mapColor(data) }} />
      );
    }
  }
} 
  const GameMap = ({ id, data }) => (
    <div className="game-map">
      {[...(new Array(42)).keys()].map((v, index) => (
        <GameMapCell key={id+(index+1)} id={id} index={index+1} data={data[index+1]} />
      ))}
    </div>
  );

export default GameMap;
