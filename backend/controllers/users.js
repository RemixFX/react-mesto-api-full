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
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
    });
};

const getMyProfile = (req, res, next) => User.findById(req.user._id)
  .orFail(new NotFoundError('Пользователь не найден'))
  .then((users) => res.status(200).send({ data: users }))
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new CastError('Некорректный Id пользователя'));
    } else {
      next(err);
    }
  });

const getUsers = (req, res, next) => User.find({})
  .orFail(new NotFoundError('Пользователи не найдены'))
  .then((users) => res.status(200).send({ data: users }))
  .catch(next);

const getUserId = (req, res, next) => User.findById(req.params.userId)
  .orFail(new NotFoundError('Пользователь не найден'))
  .then((users) => res.status(200).send({ data: users }))
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
    .then((user) => res.status(201).send({ data: user }))
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
    .then((user) => res.status(200).send({ data: user }))
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
    .then((user) => res.status(200).send({ data: user }))
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
  getMyProfile,
  getUsers,
  getUserId,
  createUser,
  updateProfile,
  updateAvatar,
};
