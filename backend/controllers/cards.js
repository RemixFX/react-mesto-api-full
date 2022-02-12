const Card = require('../models/cards');
const NotFoundError = require('../errors/not-found-error');
const CastError = require('../errors/cast-error');
const ForbiddenError = require('../errors/forbidden-error');

const getCards = (req, res, next) => Card.find({})
  .populate([{ path: 'owner', select: 'name about avatar' },
    { path: 'likes', select: 'name about avatar' }])
  .orFail(new NotFoundError('Карточки не найдены'))
  .then((cards) => res.status(200).send(cards))
  .catch(next);

const createCard = (req, res, next) => {
  const { _id } = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner: { _id } })
    .then((c) => Card.findById(c._id)
      .populate('owner', ['name', 'about', 'avatar']))
    .then((card) => res.status(201).send(card))
    .catch(next);
};

const deleteCard = (req, res, next) => Card.findById(req.params.cardId)
  .orFail(new NotFoundError('Карточка не найдена'))
  .then((card) => {
    if (card.owner._id.toString() !== req.user._id.toString()) {
      throw new ForbiddenError('Нельзя удалить не свою карточку');
    } else {
      card.remove();
      res.status(200).send({ message: 'карточка удалена' });
    }
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new CastError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  });

const sendLike = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
).populate([{ path: 'owner', select: 'name about avatar' },
  { path: 'likes', select: 'name about avatar' }])
  .orFail(new NotFoundError('Карточка не найдена'))
  .then((card) => res.status(200).send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new CastError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  });

const deleteLike = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
).populate([{ path: 'owner', select: 'name about avatar' },
  { path: 'likes', select: 'name about avatar' }])
  .orFail(new NotFoundError('Карточка не найдена'))
  .then((card) => res.status(200).send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new CastError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  });

module.exports = {
  getCards,
  createCard,
  deleteCard,
  sendLike,
  deleteLike,
};
