import React from 'react';
import NavigationBar from '../components/NavigationBar';
import '../assets/css/loggedout.css';
import { Redirect, Route, Switch } from 'react-router';
import User from './UserProfilePage';
import { SearchResponse } from '../components/Search';
import HomeLoggedOut from './HomeLoggedOutPage';

function LoggedOut() {
  return (
    <div className="body-loggedout">
      <NavigationBar />
      <section className="loggedout-section">
        <Switch>
          <Redirect from="/home" to="/" />
          <Route exact path="/" component={HomeLoggedOut} />
          <Route path="/users/:username" component={User} />
          <Route path="/search/:value" component={SearchResponse} />
        </Switch>
      </section>
    </div>
  );
}

export default LoggedOut;
