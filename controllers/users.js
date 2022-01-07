const User = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  let { email, password } = req.body;
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(8).max(12).required(),
  });
  let validation = await schema.validate(req.body);
  if (validation.error) {
    return res
      .status(200)
      .send({ message: validation.error.details[0].message, error: true });
  }

  User.findOne({ email })
    .then((user) => {
      if (user?.status && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign(
          {
            email,
          },
          "wallet!"
        );
        return res.send({ message: "Signin Success!", token });
      }
      return res.status(200).send({
        message: "Invalid email/password. Please try again.",
        error: true,
      });
    })
    .catch((e) => {
      console.log(e);
      return res.status(200).send({ message: e, error: true });
    });
};

exports.signup = async (req, res) => {
  let { email, name, password } = req.body;

  const schema = Joi.object().keys({
    name: Joi.string().min(5).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(8).max(12).required(),
  });

  let validation = await schema.validate(req.body);
  if (validation.error) {
    return res
      .status(200)
      .send({ message: validation.error.details[0].message, error: true });
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  let user = new User({
    email,
    password: passwordHash,
    name,
  });

  user
    .save()
    .then((result) => {
      return res.send({ message: "Sigup Success!" });
    })
    .catch((e) => {
      if (e.code === 11000) {
        return res
          .status(200)
          .send({ message: "User already exists", error: true });
      } else return res.status(200).send({ message: e, error: true });
    });
};

exports.validateToken = (req, res) => {
  res.send({ message: "Validation Success" });
};
