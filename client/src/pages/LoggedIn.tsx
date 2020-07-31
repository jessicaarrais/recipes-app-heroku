import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import NavigationBar from '../components/NavigationBar';
import ProfileButton from '../components/ProfileButton';
import AccountSettingsButton from '../components/AccountSettingsButton';
import Home from './Home';
import User from './User';
import Settings from './Settings';
import { SearchResponse } from '../components/Search';
import { RECIPE_FRAGMENT } from '../components/Recipe';
import '../assets/css/loggedin.css';

export const COOKBOOK_FRAGMENT = gql`
  fragment CookbookFragment on Cookbook {
    __typename
    id
    recipes {
      ...RecipeFragment
    }
  }
  ${RECIPE_FRAGMENT}
`;

export const GET_COOKBOOK = gql`
  query Me {
    me {
      id
      username
      avatar {
        uri
      }
      cookbook {
        ...CookbookFragment
      }
    }
  }
  ${COOKBOOK_FRAGMENT}
`;

function LoggedIn() {
  const { data, loading, error } = useQuery(GET_COOKBOOK);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>An error has occurred. ${error.message}</h1>;

  return (
    <div className="body-loggedin">
      <NavigationBar
        rightItems={
          <>
            <ProfileButton username={data.me.username} uri={data.me.avatar?.uri} />
            <AccountSettingsButton />
          </>
        }
      />
      <section className="loggedin-section">
        <Switch>
          <Redirect exact from="/" to="/home" />
          <Route
            path="/home"
            render={() => (
              <Home cookbookId={data.me.cookbook.id} recipes={data.me.cookbook.recipes} />
            )}
          />
          <Route
            path="/account-settings"
            render={() => (
              <Settings username={data.me.username} uri={data.me.avatar?.uri} />
            )}
          />
          <Route path="/users/:username" component={User} />
          <Route path="/search/:value" component={SearchResponse} />
          <Route path="/:recipeTitle/:recipeId" render={() => <div>recipe page</div>} />
        </Switch>
      </section>
    </div>
  );
}

export default LoggedIn;
