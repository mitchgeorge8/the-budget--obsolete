const { AuthenticationError } = require("apollo-server-express");
const { User, Budget } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("Not logged in");
      }

      const user = await User.findById(context.user._id)
        .select("-__v -password")
        .populate("budgets");

      return user;
    },
  },
  Mutation: {
    createUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },
    addBudget: async (parents, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in");
      }

      const budget = await Budget.create({
        ...args,
        user: context.user._id,
      });

      await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $push: { budgets: budget._id } },
        { new: true }
      );

      return budget;
    },
  },
};

module.exports = resolvers;
