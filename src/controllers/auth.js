var jwt = require('jsonwebtoken');
const config = require('../config');

function verifyToken(req, res, next) {
    var token = req.headers['x-access-token'];
    if (token == null || !token)
    {
        token = req.headers['authorization'];
        token = token.replace("Bearer ", "");
    }
    if (!token || token == null)
      return res.status(403).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err)
      return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
      // if everything good, save to request for use in other routes
      if (!decoded.authenticated)
        return res.status(401).send({ auth: false, message: 'Authenticatd not completed. Two factor authentication must validated before using.' });
      req.userId = decoded.id;
      next();
    });
  }

  function verifyTokenCode(req, res, next) {
    var token = req.headers['x-access-token'];
    if (token == null || !token)
    {
        token = req.headers['authorization'];
        token = token.replace("Bearer ", "");
    }
    if (!token || token == null)
      return res.status(403).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err)
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
      // if everything good, save to request for use in other routes
      if (!decoded.authenticated)
      {
        if (!req.body.code)
          return res.status(403).send({ auth: false, message: 'No code provided.' });
        req.body.token = token;
        next();
      }
      else
      {
        req.userId = decoded.id;
        next();
      }
    });
  }

  exports.verifyToken = verifyToken;
  exports.verifyCode = verifyTokenCode;