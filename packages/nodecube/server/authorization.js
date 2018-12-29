const jwtMiddleware = 'express-jwt';

module.exports = function authorization({
  jwtSecret,
  credentialsRequired = true,
  queryTokenName = 'token',
  getToken,
  publicPath = [],
  unauthorizedMessage = 'INVALID TOKEN',
}) {
  function fromHeaderOrQuery(req) {
    const {
      headers,
      query: { [queryTokenName]: token },
    } = req;
    const authHeader = headers.authorization
      ? headers.authorization.split(' ')
      : [];
    if (authHeader[0] === 'Bearer') {
      return authHeader[1];
    } else if (token) {
      return token;
    }
    return null;
  }

  return {
    authorized: jwtMiddleware({
      secret: jwtSecret,
      credentialsRequired,
      getToken: getToken || fromHeaderOrQuery,
    }).unless({
      path: publicPath,
    }),

    unauthorized(err, req, res, next) {
      if (err.name === 'UnauthorizedError') {
        res.status(401).send(unauthorizedMessage);
      }
      return next(err);
    },
  };
};
