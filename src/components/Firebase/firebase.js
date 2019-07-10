import React from 'react';

import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import firebaseConfig from './config.js';

export class Firebase extends React.Component {
  constructor(props) {
    super(props);

    app.initializeApp(firebaseConfig);
    this.db = app.database();
    this.auth = app.auth();
  }

  games = () => this.db.ref('games/');
  game = (gameID) => this.db.ref(`games/${gameID}/`);

  colors = () => this.db.ref('colors/');
  color = (colorName) => this.db.ref(`colors/${colorName}/`);
  
}
