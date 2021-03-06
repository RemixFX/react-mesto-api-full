const { NODE_ENV, JWT_SECRET } = process.env;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const UnauthorizedError = require('../errors/unauthorized-error');
const CastError = require('../errors/cast-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.status(200).send({ message: 'Успешный вход' });
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
    });
};

const logout = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).send({ message: 'Выход из профиля' });
};

const getMyProfile = (req, res, next) => User.findById(req.user._id)
  .orFail(new NotFoundError('Пользователь не найден'))
  .then((users) => res.status(200).send(users))
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new CastError('Некорректный Id пользователя'));
    } else {
      next(err);
    }
  });

const getUsers = (req, res, next) => User.find({})
  .orFail(new NotFoundError('Пользователи не найдены'))
  .then((users) => res.status(200).send(users))
  .catch(next);

const getUserId = (req, res, next) => User.findById(req.params.userId)
  .orFail(new NotFoundError('Пользователь не найден'))
  .then((users) => res.status(200).send(users))
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new CastError('Некорректный Id пользователя'));
    } else {
      next(err);
    }
  });

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new CastError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  login,
  logout,
  getMyProfile,
  getUsers,
  getUserId,
  createUser,
  updateProfile,
  updateAvatar,
};
