const express = require('express');
const movieRouter = require('express').Router();
const { celebrate } = require('celebrate');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const { joiMovieScheme, joiMovieIdScheme } = require('../middlewares/validatons');

movieRouter.get('/movies', getMovies);
movieRouter.post('/movies', express.json(), celebrate(joiMovieScheme), createMovie);
movieRouter.delete('/movies/:movieId', celebrate(joiMovieIdScheme), deleteMovie);

module.exports = movieRouter;
