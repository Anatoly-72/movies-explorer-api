const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  updateProfile,
  getCurrentUser,
} = require('../controllers/users');

userRouter.get('/users/me', getCurrentUser);

userRouter.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
    }),
  }),
  updateProfile,
);

module.exports = userRouter;
