var jwt = require("jsonwebtoken");
const config = require("../config");
const axios = require("axios");
const Apps = require("../models/client");
const Tokens = require("../models/token");
const AdminUsers = require("../models/adminuser");

var generateToken = function(client, authenticated, expireTime, scope) {
  var token;
  token = jwt.sign(
    { clientId: client, scope: scope, authenticated: authenticated },
    config.secret,
    {
      expiresIn: expireTime
    }
  );
  return token;
};

function loadHeaders(req, res, next) {
  if (req.headers.clientid) req.clientId = req.headers.clientid;
  else
    return res.status(400).send({ auth: false, message: "Invalid client id." });
  next();
}
function verifyToken(req, res, next) {
  console.log("started");
  var token = req.headers["authorization"];
  if (token === null || token == undefined) {
    token = req.headers["x-access-token"];
    if (!token || token == null)
      return res
        .status(403)
        .send({ auth: false, message: "No token provided." });
    console.log(token);
  }
  if (!token || token == null)
    return res.status(403).send({ auth: false, message: "No token provided." });
  token = token.replace("Bearer ", "");
  Tokens.findOne({ accessToken: token }).exec(function(err, tkn) {
    var result = {
      success: false,
      message: undefined,
      error: "Failed to authenticate token.Invalid token"
    };
    if (err) {
      res.status(403).send(result);
      return;
    }
    if (tkn) {
      console.log(tkn);
      jwt.verify(token, config.secret, function(err, decoded) {
        if (err)
          return res
            .status(401)
            .send({ auth: false, message: "Failed to authenticate token." });
        // if everything good, save to request for use in other routes
        console.log("auth : " + JSON.stringify(decoded));
        req.userId = tkn.userId;
        Apps.findOne({ clientId: decoded.clientId }).exec((err, app) => {
          var result = {
            success: false,
            message: undefined,
            error: "Invalid code"
          };
          if (err) {
            result.error = err;
            res.status(400).send(result);
            return;
          }
          if (app) {
            console.log("spaceId is : " + app.spaceId);
            req.app = app;
            req.userId = tkn.userId;
            req.spaceId = app.spaceId;
            req.clientId = app.clientId;
            next();
          } else {
            result.error = "Invalid client";
            res.status(500).send(result);
          }
        });
      });
    } else {
      res.status(403).send(result);
      return;
    }
  });
}

function logout(req, res, next) {}
exports.loadHeaders = loadHeaders;
exports.verifyToken = verifyToken;
exports.gettoken = [
  (req, res, next) => {
    Apps.findOne({ clientId: req.clientId }).exec((err, app) => {
      var result = {
        success: false,
        message: undefined,
        error: "Invalid code"
      };
      if (err) {
        res.status(400).send(result);
        return;
      }
      if (app) {
        var accessToken = new Tokens({
          accessToken: generateToken(
            app.clientId,
            false,
            365 * 24 * 60 * 60,
            "verify"
          ),
          accessTokenExpiresOn:
            process.env.TEMP_TOKEN_EXPIRE_TIME || 365 * 24 * 60 * 60,
          clientId: app.clientId,
          deviceToken: req.headers["deviceToken"]
        });
        accessToken.save(function(err, data) {
          if (err) {
            result.error = err;
            res.status(500).send(result);
            return;
          } else {
            res.status(200).json({
              success: true,
              access_token: data.accessToken,
              expiresIn: 365 * 24 * 60 * 60
            });
          }
        });
      } else {
        result.error = "Invalid client";
        res.status(500).send(result);
      }
    });
  }
];

exports.logout = logout;
