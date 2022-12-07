const { User } = require("../models/user");

module.exports = {
  checkDuplicateUsername: (req, res, next) => {
    User.findOne({
      username: req.body.username,
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).send({ message: "Username is already in use!" });
        return;
      }

      next();
    });
  },
};

