const allowedCors = [
  'https://insta-mesto.nomoredomains.work',
  'http://insta-mesto.nomoredomains.work',
  'api.https://insta-mesto.nomoredomains.work',
  'api.http://insta-mesto.nomoredomains.work',
  'http://localhost:3000',
  'localhost:3000',
];

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', true);
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.end();
    return;
  }
  next();
};
