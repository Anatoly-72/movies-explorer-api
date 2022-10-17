const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { login, createUser } = require('../controllers/users');
const {
  joiSignUpScheme,
  joiSignInScheme,
} = require('../middlewares/validatons');

router.post('/signup', joiSignUpScheme, createUser);
router.post('/signin', joiSignInScheme, login);

router.use(auth);

// все роуты, кроме /signup и /signin защищены авторизацией
router.use('/', userRouter);
router.use('/', movieRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

module.exports = router;
