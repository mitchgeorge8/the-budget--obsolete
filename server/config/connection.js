const { connect, connection } = require("mongoose");

connect(process.env.MONGODB_URI || "mongodb://localhost/the-budget", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((m) => m.connection.getClient());

module.exports = connection;
