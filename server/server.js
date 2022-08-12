const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const db = require("./config/connection");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { typeDefs, resolvers } = require("./schemas");

const oneDay = 1000 * 60 * 60 * 24;

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  context: ({ req }) => {
    return req;
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "Super secret secret",
    cookie: { maxAge: oneDay },
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || "mongodb://localhost/the-budget",
    }),
  })
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`Server now running on port ${PORT}`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
}

startApolloServer();
