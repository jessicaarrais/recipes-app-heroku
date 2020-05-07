const { ApolloServer } = require('apollo-server');
const isEmail = require('isemail');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const createStore = require('./store');
const User = require('./datasources/user');
const Todo = require('./datasources/todo');
const Sheet = require('./datasources/sheet');

const store = createStore();

const dataSources = () => ({
  userAPI: new User(store),
  sheetAPI: new Sheet(store),
  todoAPI: new Todo(store),
});

const context = async ({ req }) => {
  const auth = (req.headers && req.headers.authorization) || '';
  const email = Buffer.from(auth, 'base64').toString('ascii');
  if (!isEmail.validate(email)) return { user: null };
  const user = await store.user.findOne({ where: { email } });

  return { user: { ...user.dataValues } };
};

const server = new ApolloServer({
  context,
  dataSources,
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`server running on port ${url}`);
});
