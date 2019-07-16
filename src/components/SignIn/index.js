import React from 'react'
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';

import * as ROUTES from '../../pages/routes';
import { withAuthentication } from '../Session';

class SignInFormBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    }
  }

  onChange = e => {
    const target = e.currentTarget;
    this.setState({
      [target.name]: target.value,
    })
  }

  doSignIn = e => {
    const { email, password } = this.state;
    this.props.firebase.doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ email: "", password: "" });
        this.props.history.push(ROUTES.ADMIN);
      })
      .catch(error => {
        this.setState({ error: error });
      });
    e.preventDefault();
  }


  render() {
    const { email, password, error } = this.state;
    return (
      <React.Fragment>
      <div className="display-4">Admin</div>
      <form onSubmit={this.doSignIn}>
        <div className="form-group form-inline">
          <label>E-Mail</label>
          <input className="form-control" type="email" name="email" value={email} onChange={this.onChange}/>
        </div>
        <div className="form-group form-inline">
          <label>Password</label>
          <input className="form-control" type="password" name="password" value={password} onChange={this.onChange}/>
        </div>
        <button className="btn btn-primary btn-block" type="submit">Sign In</button>
      </form>
      {error ? error.message : null}
      <hr/>
      <button className="btn btn-danger btn-block" onClick={this.props.firebase.doSignOut}>Sign Out</button>
      </React.Fragment>
    );
  }
}

export default compose(
  withAuthentication
)(SignInFormBase);