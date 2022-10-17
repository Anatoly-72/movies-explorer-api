const userRouter = require('express').Router();
// const { celebrate, Joi } = require('celebrate');

const {
  updateProfile,
  getCurrentUser,
} = require('../controllers/users');

const { joiUserInfoScheme } = require('../middlewares/validatons');

userRouter.get('/users/me', getCurrentUser);

userRouter.patch('/users/me', joiUserInfoScheme, updateProfile);

module.exports = userRouter;
