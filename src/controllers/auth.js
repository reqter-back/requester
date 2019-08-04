var jwt = require('jsonwebtoken');
const config = require('../config');
const axios  = require('axios');
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
 exports.gettoken = [
  (req, res, next)=>{
      var apiRoot = process.env.APPS_ACCESSTOKEN_API || "https://app-ipanel.herokuapp.com";
      var config = {
        url : "/auth/token",
        baseURL : apiRoot,
        method : "post",
        data : {
          "username" : "loan@reqter.com",
          "password" : "logrezaee24359"
        },
        headers : {
            'clientid' : req.headers.clientid
        }
      };
      console.log(config);
      axios(config).then(function (response) {
        res.send({"access_token" : response.data.access_token});
        })
        .catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            res.status(error.response.status).send(error.response.data);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
            res.status(204).send("No response from server");
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
            res.status(500).send(error.message);
          }
          console.log(error.config);
          res.status(400).send(error.config);
        });
  }
];
