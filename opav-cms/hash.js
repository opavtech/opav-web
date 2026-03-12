const bcrypt = require("bcrypt");

const password = "H*262672084045ah";

bcrypt.hash(password, 10).then(hash => {
  console.log(hash);
});