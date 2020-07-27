import React, { useEffect, useState } from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Home from './Home';
import User from './User';
import Settings from './Settings';
import { RECIPE_FRAGMENT } from '../components/Recipe';
import NavigationBar from '../components/NavigationBar';
import Button from '../components/Button';
import Icon from '../components/Icon';
import '../assets/css/loggedin.css';
import { SearchResponse } from '../components/Search';

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
  const [isShowingArrowUp, setIsShowingArrowUp] = useState('hidden');
  const { data, loading, error } = useQuery(GET_COOKBOOK);

  const handleScroll = () => {
    if (window.scrollY <= 260) {
      setIsShowingArrowUp('hidden');
    } else {
      setIsShowingArrowUp('showed');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>An error has occurred. ${error.message}</h1>;

  return (
    <div className="body-loggedin">
      <NavigationBar username={data.me.username} uri={data.me.avatar?.uri} />
      <section className="loggedin-section">
        <Switch>
          <Redirect exact from="/" to="/home" />
          <Route
            path="/home"
            render={() => (
              <>
                <Home
                  cookbookId={data.me.cookbook.id}
                  recipes={data.me.cookbook.recipes}
                />
                <div className={`back-to-top-icon ${isShowingArrowUp}`}>
                  <Button
                    type="button"
                    actionType="default"
                    handleOnClick={() => {
                      window.scrollTo(0, 0);
                    }}
                  >
                    <Icon icon="keyboard_arrow_up" />
                  </Button>
                </div>
              </>
            )}
          />
          <Route
            path="/account-settings"
            render={() => (
              <Settings username={data.me.username} uri={data.me.avatar?.uri} />
            )}
          />
          <Route path="/user/:username" children={<User />} />
          <Route path="/search/:value" children={<SearchResponse />} />
        </Switch>
      </section>
    </div>
  );
}

export default LoggedIn;
