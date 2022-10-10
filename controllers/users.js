const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ExistEmailError = require('../errors/exist-email-err');
const BadAuthError = require('../errors/bad-auth-err');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');

const { STATUS_OK, SALT_ROUNDS } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

// POST /signin — авторизация(залогинивание) пользователя по email и password
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => {
      next(new BadAuthError('Неправильные почта или пароль.'));
    });
};

// GET /users/me — возвращаем информацию о текущем пользователе
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};

// POST /signup — создаём пользователя по обязательным полям email и password
module.exports.createUser = (req, res, next) => {
  const { name } = req.body;

  // хешируем пароль
  bcrypt
    .hash(req.body.password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.status(STATUS_OK).send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка валидации данных'));
      } else if (err.code === 11000) {
        next(new ExistEmailError('Передан уже зарегистрированный email.'));
      } else {
        next(err);
      }
    });
};

// PATCH /users/me — обновляем данные пользователя
module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка валидации данных'));
      } else {
        next(err);
      }
    });
};
