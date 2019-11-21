const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");
var axios = require("axios");
var express = require("express");
var router = express.Router();
var controller = require("../controllers/requestController");
var broker = require("../controllers/serviceBroker");

exports.getcategorieslist = [
  body("id", "Id must not be empty"),
  //Sanitize fields
  sanitizeBody("id")
    .trim()
    .escape(),
  (req, res, next) => {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      //There are errors. send error result
      res.status(400).json({ success: false, error: errors });
      return;
    } else {
    }
  }
];

exports.getproductslist = [
  body("id", "Id must not be empty"),
  //Sanitize fields
  sanitizeBody("id")
    .trim()
    .escape(),
  (req, res, next) => {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      //There are errors. send error result
      res.status(400).json({ success: false, error: errors });
      return;
    } else {
    }
  }
];

exports.getproductdetail = [
  body("id", "Id must not be empty"),
  //Sanitize fields
  sanitizeBody("id")
    .trim()
    .escape(),
  (req, res, next) => {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      //There are errors. send error result
      res.status(400).json({ success: false, error: errors });
      return;
    } else {
    }
  }
];

exports.add = [
  (req, res, next) => {
    broker
      .sendRPCMessage(
        { body: req.body, userId: req.userId, spaceId: req.spaceId },
        "addcontent"
      )
      .then(result => {
        var obj = JSON.parse(result.toString("utf8"));
        if (!obj.success) {
          if (obj.error) {
            return res.status(500).json(obj);
          }
        } else {
          res.status(201).json(obj.data);
        }
      });
  }
];

exports.update = function(req, res, next) {
  broker
    .sendRPCMessage(
      { spaceId: req.spaceid, userId: req.userId, body: req.body },
      "updatecontent"
    )
    .then(result => {
      var obj = JSON.parse(result.toString("utf8"));
      if (!obj.success) {
        if (obj.error) return res.status(500).json(obj);
        else {
          res.status(404).json(obj);
        }
      } else {
        res.status(200).json(obj.data);
      }
    });
};

exports.remove = function(req, res, next) {
  broker
    .sendRPCMessage(
      { spaceId: req.spaceid, userId: req.userId, body: req.body },
      "removecontent"
    )
    .then(result => {
      var obj = JSON.parse(result.toString("utf8"));
      if (!obj.success) {
        if (obj.error) return res.status(500).json(obj);
        else {
          res.status(404).json(obj);
        }
      } else {
        res.status(200).json(obj.data);
      }
    });
};
