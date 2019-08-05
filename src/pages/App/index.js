import React from 'react';
import { Switch, Route, HashRouter } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import * as ROUTES from '../routes';

import HomePage from '../Home';
import AdminPage from '../Admin';
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
          </Switch>
        </div>
      <div className="page-footer">
        <p>Bongjun Jang, ICISTS Division of Tech & Design</p>
        <p>Icon 1: Created by Oksana Latysheva from Noun Project</p>
        <p>Icon 2: Created by Soomin Kang, ICISTS Division of Tech & Design</p>
      </div>
      </HashRouter>
    </div>
  );
}

export default App;
