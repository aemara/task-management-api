const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = {
  signUp: (req, res) => {
    const user = new User({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      const token = jwt.sign({ id: user._id }, process.env.SECRET, {
        expiresIn: 86400,
      });

      res.status(200).send({
        id: user._id,
        username: user.username,
        accessToken: token,
      });
    });
  },

  signIn: (req, res) => {
    User.findOne({
      username: req.body.username,
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      const token = jwt.sign({ id: user._id }, process.env.SECRET, {
        expiresIn: 86400,
      });

      res.status(200).send({
        id: user._id,
        username: user.username,
        accessToken: token,
      });
    });
  },
};
