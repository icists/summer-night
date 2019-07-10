import React from 'react';
import { Switch, Route, HashRouter } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import * as ROUTES from '../routes';

import HomePage from '../Home';
import AdminPage from '../Admin';
import AboutPage from '../About';
import RulesPage from '../Rules'
import TeamPage from '../Team';
import GamesPage from '../Games';
import GameAdminPage from '../Admin/Game';

import './App.css';

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Navigation/>
        <div className="container">
          <Switch>
            <Route exact={true} path={ROUTES.HOME} component={HomePage}/>
            <Route exact={true} path={ROUTES.ADMIN} component={AdminPage}/>
            <Route path={ROUTES.ADMIN_GAME} component={GameAdminPage}/>
            <Route path={ROUTES.ABOUT} component={AboutPage}/>
            <Route path={ROUTES.RULES} component={RulesPage}/>
            <Route path={ROUTES.TEAM} component={TeamPage}/>
            <Route path={ROUTES.GAMES} component={GamesPage}/>
          </Switch>
        </div>
      <div className="page-footer">
        Bongjun Jang, ICISTS Division of Tech & Design
      </div>
      </HashRouter>
    </div>
  );
}

export default App;
