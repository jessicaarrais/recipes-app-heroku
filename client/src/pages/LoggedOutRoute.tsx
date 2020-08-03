import React from 'react';
import NavigationBar from '../components/NavigationBar';
import '../assets/css/loggedout.css';
import { Redirect, Route, Switch } from 'react-router';
import UserProfilePage from './UserProfilePage';
import { SearchResponse } from '../components/Search';
import HomeLoggedOutPage from './HomeLoggedOutPage';

function LoggedOutRoute() {
  return (
    <div className="body-loggedout">
      <NavigationBar />
      <section className="loggedout-section">
        <Switch>
          <Redirect from="/home" to="/" />
          <Route exact path="/" component={HomeLoggedOutPage} />
          <Route path="/users/:username" component={UserProfilePage} />
          <Route path="/search/:value" component={SearchResponse} />
        </Switch>
      </section>
    </div>
  );
}

export default LoggedOutRoute;
