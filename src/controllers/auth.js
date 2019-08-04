var jwt = require('jsonwebtoken');
const config = require('../config');

function loadHeaders(req, res, next) {
  if (req.headers.clientid)
    req.clientId = req.headers.clientid;
  else
    return res.status(400).send({ auth: false, message: 'Invalid client id.' });
  next();
}
function verifyToken(req, res, next) {
    var token = req.headers['authorization'];
    if (token === null || token == undefined)
    {
        token = req.headers['x-access-token'];
        if (!token || token == null)
          return res.status(403).send({ auth: false, message: 'No token provided.' });
          console.log(token)
    }
    if (!token || token == null)
      return res.status(403).send({ auth: false, message: 'No token provided.' });
      token = token.replace("Bearer ", "");
    
      jwt.verify(token, config.secret, function(err, decoded) {
      if (err)
      return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
      // if everything good, save to request for use in other routes
      req.userId = decoded.id;
      console.log("auth : " + JSON.stringify(decoded));
      next();
    });
}

function getAppToken(req, res, next) {
  var result = {"access_token" : process.env.API_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMjZlNzkyZWI3NjFiMDAxN2YxOTVhZSIsImFjY291bnRfdHlwZSI6ImZyZWUiLCJpYXQiOjE1NjQ5MDk3MTAsImV4cCI6MTU2NzUwMTcxMH0.zxfUrJO7iHDYF8a2uHT_vFSZG1S_AZI2wPMoS_8PJ5I"}
  res.send(result);
}
 exports.loadHeaders = loadHeaders;
 exports.verifyToken = verifyToken;
 exports.gettoken = getAppToken;
