const Sequelize = require("sequelize");

const sequelize = new Sequelize("node_complete", "postgres", "1421217", {
  host: "localhost",
  dialect: "postgres",
});

module.exports = sequelize;
