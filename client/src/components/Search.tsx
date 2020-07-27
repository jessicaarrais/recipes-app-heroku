import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Button from './Button';
import Icon from './Icon';
import '../assets/css/search.css';

const SEARCH_RECIPES = gql`
  query SearchRecipes($value: String) {
    searchRecipes(value: $value) {
      id
      title
    }
  }
`;

export function Search() {
  const history = useHistory();
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="search-container">
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />

      <Button
        type="button"
        actionType="secondary"
        disabled={searchValue === '' ? true : false}
        handleOnClick={() => {
          history.push(`/search/${searchValue}`);
          setSearchValue('');
        }}
      >
        <Icon icon="search" />
      </Button>
    </div>
  );
}

export function SearchResponse() {
  const { value } = useParams();

  const { data, loading, error } = useQuery(SEARCH_RECIPES, {
    variables: { value },
  });

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>An error has occurred. ${error.message}</h1>;

  return data?.searchRecipes.length > 0 ? (
    data.searchRecipes.map((recipe: any) => <h2 key={recipe.id}>{recipe.title}</h2>)
  ) : (
    <p>Could not find a recipe</p>
  );
}
