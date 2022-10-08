const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/del-card-err');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

// Создаем карточку с фильмом по id
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка валидации данных'));
      } else {
        next(err);
      }
    });
};

// Удаляем карточку с фильмом
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(
      () => new NotFoundError('Пользователь с указанным id не существует'),
    )
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        Movie.findByIdAndRemove({
          _id: req.params.movieId,
        })
          .then((delMovie) => res.send({ data: delMovie }))
          .catch(next);
      } else {
        throw new ForbiddenError('Нельзя удалить чужой фильм');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка валидации данных'));
      } else {
        next(err);
      }
    });
};
