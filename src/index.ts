import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { DataSources } from 'apollo-server-core/dist/graphqlOptions';
import path from 'path';
import isEmail from 'isemail';
import { dbUser, UserModel } from './store';
import typeDefs from './schema';
import resolvers from './resolvers';
import User from './datasources/user';
import Avatar from './datasources/avatar';
import Cookbook from './datasources/cookbook';
import Recipe from './datasources/recipe';
import Ingredient from './datasources/ingredient';
import Instruction from './datasources/instruction';

interface MyContext {
  user: UserModel | null;
}
interface MyDataSources {
  dataSources: {
    userAPI: User;
    avatarAPI: Avatar;
    cookbookAPI: Cookbook;
    recipeAPI: Recipe;
    ingredientAPI: Ingredient;
    instructionAPI: Instruction;
  };
}
export type Context = MyContext & MyDataSources;

const dataSources = (): DataSources<Context> => ({
  userAPI: new User(),
  avatarAPI: new Avatar(),
  cookbookAPI: new Cookbook(),
  recipeAPI: new Recipe(),
  ingredientAPI: new Ingredient(),
  instructionAPI: new Instruction(),
});

const context = async ({ req }): Promise<MyContext> => {
  const auth = (req.headers && req.headers.authorization) || '';
  const email = Buffer.from(auth, 'base64').toString('ascii');
  if (!isEmail.validate(email)) return { user: null };
  const user = await dbUser.findOne({ where: { email } });

  return { user: user };
};

const server = new ApolloServer({
  context,
  dataSources,
  typeDefs,
  resolvers,
});

const app = express();
app.use('/images', express.static(path.join(__dirname, '../images')));
server.applyMiddleware({ app });

app.listen(4000, () => {
  console.log(`server running on port http://localhost:4000`);
});
