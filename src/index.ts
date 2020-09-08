import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { DataSources } from 'apollo-server-core/dist/graphqlOptions';
import { Op } from 'sequelize';
import cors from 'cors';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import path from 'path';
import { dbUser, UserModel } from './store';
import typeDefs from './schema';
import resolvers from './resolvers';
import User from './datasources/user';
import Avatar from './datasources/avatar';
import Cookbook from './datasources/cookbook';
import Recipe from './datasources/recipe';
import Ingredient from './datasources/ingredient';
import Instruction from './datasources/instruction';

const PORT = process.env.PORT || 4000;

interface MyContext {
  user: UserModel | null;
  token: string;
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
  const auth = req.headers && req.headers.authorization;
  if (auth == null || auth === '') return { user: null, token: null };

  let user = await dbUser.findOne({ where: { token: { [Op.contains]: [auth] } } });

  jwt.verify(auth, process.env.JWT_SECRET, (err: VerifyErrors | null) => {
    if (err) {
      user = null;
    }
  });

  return { user: user, token: auth };
};

const server = new ApolloServer({
  context,
  dataSources,
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

const app = express();
app.use(cors());
app.use('/images', express.static(path.join(__dirname, '../images')));
server.applyMiddleware({ app });

app.listen(PORT, () => {
  console.log(`server running on port http://localhost:${PORT}`);
});
