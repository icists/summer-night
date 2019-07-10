import React from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../pages/routes';

const Navigation = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
    <Link to={ROUTES.HOME}>
      <div className="navbar-brand">
        ICISTS Summer Night
      </div>
    </Link>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div className="navbar-nav">
        <Link to={ROUTES.HOME}>
          <div className="nav-item nav-link">
            Home
          </div>
        </Link>
        <Link to={ROUTES.ABOUT}>
          <div className="nav-item nav-link">
            About
          </div>
        </Link>
        <Link to={ROUTES.RULES}>
          <div className="nav-item nav-link">
            Rules
          </div>
        </Link>
        <Link to={ROUTES.GAMES}>
          <div className="nav-item nav-link">
            Games
          </div>
        </Link>
        <Link to={ROUTES.ADMIN}>
          <div className="nav-item nav-link">
            Admin
          </div>
        </Link>
      </div>
    </div>
  </nav>
);

export default Navigation;