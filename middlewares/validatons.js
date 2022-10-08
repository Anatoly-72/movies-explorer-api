const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const BadRequestError = require('../errors/bad-request-err');

const joiSignUpScheme = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isEmail(value)) {
          return value;
        }
        return helpers.message('Некорректный email');
      }),
    password: Joi.string().required(),
  }),
});

const joiSignInScheme = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isEmail(value)) {
          return value;
        }
        return helpers.message('Некорректный email');
      }),
    password: Joi.string().required(),
  }),
});

const joiMovieScheme = {
  body: Joi.object().keys({
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    trailerLink: Joi.string().required().custom((value) => {
      if (!validator.isURL(value, { require_protocol: true })) {
        throw new BadRequestError('Ошибка валидации данных');
      }
      return value;
    }),
    image: Joi.string().required().custom((value) => {
      if (!validator.isURL(value, { require_protocol: true })) {
        throw new BadRequestError('Ошибка валидации данных');
      }
      return value;
    }),
    thumbnail: Joi.string().required().custom((value) => {
      if (!validator.isURL(value, { require_protocol: true })) {
        throw new BadRequestError('Ошибка валидации данных');
      }
      return value;
    }),
    year: Joi.string().required(),
    duration: Joi.number().required(),
    description: Joi.string().required(),
    country: Joi.string().required(),
    director: Joi.string().required(),
  }),
};

const joiMovieIdScheme = {
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
};

module.exports = {
  joiSignUpScheme,
  joiSignInScheme,
  joiMovieScheme,
  joiMovieIdScheme,
};
