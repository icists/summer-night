import React from 'react';
import { Link } from 'react-router-dom';

export const GameListItem = ({ game, id }) => (
  <li href="#" className="list-group-item clickable" data-toggle="modal" data-target={`#gameInfoModal-${id}`}>
    <div className="modal fade" id={`gameInfoModal-${id}`} tabIndex={-1} role="dialog" aria-labelledby="gameInfoModalLabel" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="gameInfoModalLabel">
              {game.name} {game.isRunning ? <span className="badge badge-info">Running</span> : <span className="badge badge-secondary">Free to go</span>}
            </h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="game-mini-map">Game Mini Map</div>
            <div className="game-small-info">
              <ul>
                <li> Floor: {game.location.floor} </li>
                <li> Type: {game.type} </li>
                <li> Rules: {game.rules} </li>
                <li> Team: {game.team} </li>
              </ul>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    {game.name} {game.isRunning ? <span className="badge badge-info">Running</span> : <span className="badge badge-secondary">Free to go</span>}
  </li>
);

export const GameAdminListItem = ({ game, id }) => (
  <li className="list-group-item">
    <Link to={`admin/${id}`}>
      <div className="game-item" style={{ color: "black" }}>
        {game.name} {game.isRunning ? <span className="badge badge-info">Running</span> : <span className="badge badge-secondary">Free to go</span>}
      </div>
    </Link>
  </li>
);