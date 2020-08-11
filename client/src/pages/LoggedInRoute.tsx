import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { gql, useQuery } from '@apollo/client';
import NavigationBar from '../components/NavigationBar';
import UserProfileButton from '../components/UserProfileButton';
import AccountSettingsButton from '../components/AccountSettingsButton';
import HomeLoggedInPage from './HomeLoggedInPage';
import UserProfilePage from './UserProfilePage';
import AccountSettingsPage from './AccountSettingsPage';
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

function LoggedInRoute() {
  const { data, loading, error } = useQuery(GET_COOKBOOK);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>An error has occurred. ${error.message}</h1>;

  return (
    <div className="body-loggedin">
      <NavigationBar
        rightItems={
          <>
            <UserProfileButton username={data.me.username} uri={data.me.avatar?.uri} />
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
              <HomeLoggedInPage
                cookbookId={data.me.cookbook.id}
                recipes={data.me.cookbook.recipes}
              />
            )}
          />
          <Route
            path="/account-settings"
            render={() => (
              <AccountSettingsPage
                username={data.me.username}
                uri={data.me.avatar?.uri}
              />
            )}
          />
          <Route path="/users/:username" component={UserProfilePage} />
          <Route path="/search/:value" component={SearchResponse} />
          <Route path="/:recipeTitle/:recipeId" render={() => <div>recipe page</div>} />
        </Switch>
      </section>
    </div>
  );
}

export default LoggedInRoute;
