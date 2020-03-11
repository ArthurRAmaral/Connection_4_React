require("dotenv").config();
module.exports =
  process.env.BACK_END_URL || "http://connect4-node.herokuapp.com/";
// || "http://localhost:3000";
