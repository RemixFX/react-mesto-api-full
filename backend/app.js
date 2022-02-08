const express = require('express');

const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler');
const NotFoundError = require('./errors/not-found-error');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');

const app = express();
app.use(bodyParser.json());

mongoose.connect(
  'mongodb://localhost:27017/mestodb',
  { useNewUrlParser: true },
  () => console.log('База данных загружена'),
);
app.use(cors);
app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).messages({
    'string.empty': 'Поле {#label} не может быть пустым',
    'string.min': 'Поле {#label} должно быть минимум {#limit} символов',
    'any.required': '{#label} - обязательное поле',
    'string.email': 'Неверный формат почты',
    'object.unknown': 'Переданы не разрешенные данные',
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string()
      .regex(/^(https?:\/\/)(w{0,3})(([\da-z-]+)\.){1,3}([a-z.]{2,6})([\w-:~?#@!$&'()*+,;=./]*)*\/?$/),
  }).messages({
    'string.empty': 'Поле {#label} не может быть пустым',
    'string.min': 'Поле {#label} должно быть минимум {#limit} символов',
    'any.required': '{#label} - обязательное поле',
    'string.email': 'Неверный формат почты',
    'string.pattern.base': 'Некорректный адрес ссылки',
  }),
}), createUser);

app.use(auth);
app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));

// app.use(errors());
app.use(errorLogger);
app.use('*', (req, res, next) => {
  next(new NotFoundError('запрашиваемый ресурс не найден'));
});
app.use(errorHandler);

app.listen(PORT);
