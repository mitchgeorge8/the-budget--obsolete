const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    budgets: [Budget]
    transactions: [Transaction]
  }

  type Budget {
    _id: ID
    name: String
    amount: Float
    frequency: Int
    timeframe: String
  }

  type Transaction {
    _id: ID
  }

  type Auth {
    token: ID!
    user: User
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
    ): Auth
    login(email: String!, password: String!): Auth
    addBudget(
      name: String!
      amount: Float!
      frequency: Int!
      timeframe: String!
    ): Budget
  }
`;

module.exports = typeDefs;
