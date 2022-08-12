const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");

const resolvers = {
  Query: {
    user: async (parent, args, req) => {
      if (req.session.userId) {
        const user = await User.findById(context.user._id);
        return user;
      }
      throw new AuthenticationError("Not logged in");
    },
  },
  Mutation: {
    createUser: async (parent, args, req) => {
      const user = await User.create(args);

      req.session.userId = user._id;
      req.session.loggedIn = true;

      return user;
    },
    login: async (parent, { email, password }, req) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      req.session.userId = user._id;
      req.session.loggedIn = true;

      console.log(req.session);

      return user;
    },
    logout: async (parent, args, req) => {
      if (req.session.loggedIn) {
        req.session.destroy();
        console.log(req.session);
      }
    },
  },
};

module.exports = resolvers;
