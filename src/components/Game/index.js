import React from 'react';
import { Link } from 'react-router-dom';

import './Game.css';
import { displayGameType, displayTeam } from '../Map';

export const GameListItem = ({ game, id }) => (
  <li href="#" className="list-group-item clickable" data-toggle="modal" data-target={`#gameInfoModal-${id}`} data-backdrop={false}>
    <div className="modal fade" id={`gameInfoModal-${id}`} tabIndex={-1} role="dialog" aria-labelledby="gameInfoModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="gameInfoModalLabel">
              {game.name}
              {game.isRunning ? <span className="badge badge-info small-tag">Running</span> : <span className="badge badge-secondary small-tag">Free to go</span>}
              {game.isWaiting ? <span className="badge badge-info small-tag">Waiting</span> : null}
            </h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="game-small-info">
                <ul className="list-group text-center">
                  <li className="list-group-item">
                    <h5>Type</h5>
                    {displayGameType(game.type)}
                    <footer className="blockquote-footer">Team Vs. Team / Team Recording / Team Game</footer>
                  </li>
                  <li className="list-group-item">
                    <h5>Team</h5>
                    {displayTeam(game.team)}
                    <footer className="blockquote-footer">Which team is capturing this game?</footer>
                  </li>
                </ul>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    {game.name}
    {game.isRunning ? <span className="badge badge-info small-tag">Running</span> : <span className="badge badge-secondary small-tag">Free to go</span>}
    {game.isWaiting ? <span className="badge badge-info small-tag">Waiting</span> : null}
  </li>
);

export const GameAdminListItem = ({ game, id }) => (
  <li className="list-group-item">
    <Link to={`admin/${id}`}>
      <div className="game-item" style={{ color: "black" }}>
        {game.name}
        {game.isRunning ? <span className="badge badge-info small-tag">Running</span> : <span className="badge badge-secondary small-tag">Free to go</span>}
        {game.isWaiting ? <span className="badge badge-info small-tag">Waiting</span> : null}
      </div>
    </Link>
  </li>
);