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

  /* Database RefBuilders */
  games = () => this.db.ref('games/');
  game = (gameID) => this.db.ref(`games/${gameID}/`);

  colors = () => this.db.ref('colors/');
  color = (colorName) => this.db.ref(`colors/${colorName}/`);

  visible = () => this.db.ref('visible');

  /* Auth */

  doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);
  doSignOut = () => this.auth.signOut();
  
}
