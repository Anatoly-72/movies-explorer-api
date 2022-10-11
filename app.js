require('dotenv').config(); // загружаем переменные среды из .envфайла в файлы process.env
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const routes = require('./routes/index');
const centralErrorHandler = require('./middlewares/central-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/rateLimiter');
// const { DATABASE } = require('./utils/utils');

const { PORT, MONGO_URL } = process.env;

const app = express();

app.use(cors());

// защищаем HTTP-заголовки
app.use(helmet());
app.disable('x-powered-by');

// собираем JSON-формат
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаем логгер запросов
app.use(requestLogger);

// ограничиваем количество запросов для одного IP
app.use(limiter);

// Код для краш-теста (сервер должен подняться после падения сам, исп. pm2)
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// подключаем роуты
app.use(routes);

// подключаем логгер ошибок
app.use(errorLogger);

// централизованная обработка ошибок
app.use(errors());
app.use(centralErrorHandler);

// Последовательное подключение: сначала база, затем порт
async function main() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  await app.listen(PORT);
  console.log(`Сервер запущен на ${PORT} порту`);
}

main();
