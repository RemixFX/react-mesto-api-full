/* eslint-disable consistent-return */
const { isCelebrateError } = require('celebrate');

const errorHandler = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    const errorBody = err.details.get('body');
    const errorParams = err.details.get('params');
    if (errorBody) {
      res.status(400).send({ message: `${err.message}: ${errorBody.message}` });
    } if (errorParams) {
      res.status(400).send({ message: `${err.message}: ${errorParams.message}` });
    }
    return;
  }
  const { statusCode = 500, message } = err;
  res.status(statusCode).send(
    { message: statusCode === 500 ? 'На сервере произошла ошибка' : message },
  );
  next();
};
module.exports = errorHandler;
