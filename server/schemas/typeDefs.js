const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    password: String
  }

  type Query {
    user: User
  }

  type Mutation {
    createUser(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    ): User
    login(email: String!, password: String!): User
    logout: User
  }
`;

module.exports = typeDefs;
