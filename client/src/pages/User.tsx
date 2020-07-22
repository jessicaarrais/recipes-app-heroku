import React from 'react';
import gql from 'graphql-tag';
import { useParams } from 'react-router';
import { useQuery } from '@apollo/react-hooks';
import '../assets/css/user.css';

const GET_USER = gql`
  query User($username: String) {
    user(username: $username) {
      username
      avatar {
        uri
      }
      cookbook {
        recipes {
          id
          title
          ingredients {
            id
            text
          }
          instructions {
            id
            step
            text
          }
        }
      }
    }
  }
`;

function User() {
  const { username } = useParams();
  const { data, loading, error } = useQuery(GET_USER, { variables: { username } });

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>An error has occurred. ${error.message}</h1>;

  return data.user ? (
    <div>
      <h2>{`User: ${data.user.username}`}</h2>
      <img src={data.user.avatar?.uri} alt="user's avatar" />
      <ul className="recipes">
        {data.user.cookbook.recipes.map((recipe: any) => (
          <li key={recipe.id} className="recipe">
            <h2>{recipe.title}</h2>
            <ul className="ingredient">
              {recipe.ingredients.map((ingredient: any) => (
                <li key={ingredient.id}>
                  <p>{ingredient.text}</p>
                </li>
              ))}
            </ul>
            <ul className="instruction">
              {recipe.instructions.map((instruction: any) => (
                <li key={instruction.id}>
                  <p>{instruction.step + instruction.text}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <h3>User not found</h3>
  );
}

export default User;
