import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { DataSources } from 'apollo-server-core/dist/graphqlOptions';
import isEmail from 'isemail';
import typeDefs from './schema';
import resolvers from './resolvers';
import { dbUser, UserModel } from './store';
import User from './datasources/user';
import Avatar from './datasources/avatar';
import Todo from './datasources/todo';
import Sheet from './datasources/sheet';
import path from 'path';
import Notebook from './datasources/notebook';

interface MyContext {
  user: UserModel | null;
}
interface MyDataSources {
  dataSources: {
    userAPI: User;
    avatarAPI: Avatar;
    notebookAPI: Notebook;
    sheetAPI: Sheet;
    todoAPI: Todo;
  };
}
export type Context = MyContext & MyDataSources;

const dataSources = (): DataSources<Context> => ({
  userAPI: new User(),
  avatarAPI: new Avatar(),
  notebookAPI: new Notebook(),
  sheetAPI: new Sheet(),
  todoAPI: new Todo(),
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
