var axios = require("axios");
const async = require("async");
const broker = require("./serviceBroker");
exports.myRequests = [
  (req, res, next) => {
    var q = req.query || {};
    if (q) {
      q["sys.issuer"] = req.userId;
      q["sys.spaceId"] = req.spaceId.toString();
    }
    console.log(q);
    var apiRoot =
      process.env.CONTENT_DELIVERY_API || "https://app-dpanel.herokuapp.com";
    var config = {
      url: "/contents/query",
      baseURL: apiRoot,
      method: "get",
      params: q,
      headers: {
        authorization: req.headers.authorization,
        clientid: req.spaceId.toString()
      }
    };
    console.log(config);
    axios(config)
      .then(function(response) {
        res.send(response.data);
      })
      .catch(function(error) {
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
          console.log("Error", error.message);
          res.status(500).send(error.message);
        }
        console.log(error.config);
        res.status(400).send(error.config);
      });
  }
];

exports.userRequests = [
  (req, res, next) => {
    var q = req.query || {};
    if (q) {
      q["sys.issuer"] = req.userId;
      q["sys.spaceId"] = req.spaceId.toString();
    }
    console.log(q);
    var apiRoot =
      process.env.CONTENT_DELIVERY_API || "https://app-dpanel.herokuapp.com";
    var config = {
      url: "/contents/query",
      baseURL: apiRoot,
      method: "get",
      params: q,
      headers: {
        authorization: req.headers.authorization,
        clientid: req.spaceId.toString()
      }
    };
    console.log(config);
    axios(config)
      .then(function(response) {
        var arr = [];
        if (response.data && response.data.length > 0) {
          for (i = 0; i < response.data.length; i++) {
            if (response.data[i].fields.product) arr.push(response.data[i]);
          }
        } else arr = response.data;
        res.send(arr);
      })
      .catch(function(error) {
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
          console.log("Error", error.message);
          res.status(500).send(error.message);
        }
        console.log(error.config);
        res.status(400).send(error.config);
      });
  }
];
exports.submit = [
  (req, res, next) => {
    broker
      .sendRPCMessage(
        { body: req.body, userId: req.userId, spaceId: req.spaceId },
        "submitcontent"
      )
      .then(result => {
        var obj = JSON.parse(result.toString("utf8"));
        if (!obj.success) {
          if (obj.error) {
            return res.status(500).json(obj);
          }
        } else {
          //do mach making and submit to partners
          res.status(201).json(obj.data);
        }
      });
  }
];

exports.getRequestsOffers = [
  (req, res, next) => {
    var apiRoot =
      process.env.CONTENT_DELIVERY_API || "https://app-dpanel.herokuapp.com";
    req.query["status"] = "published";
    var config = {
      url: "/contents/search",
      baseURL: apiRoot,
      method: "get",
      params: req.query,
      headers: {
        authorization: req.headers.authorization,
        clientid: req.spaceId.toString()
      }
    };
    console.log(config);
    axios(config)
      .then(function(response) {
        if (response.data && response.data.data && response.data.data.contents)
          res.send(response.data.data.contents);
        else res.send(response.data);
      })
      .catch(function(error) {
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
          console.log("Error", error.message);
          res.status(500).send(error.message);
        }
        console.log(error.config);
        res.status(400).send(error.config);
      });
  }
];

exports.getNewapplications = [
  (req, res, next) => {
    var apiRoot =
      process.env.CONTENT_DELIVERY_API || "https://app-dpanel.herokuapp.com";
    var config = {
      url: "/contents/search",
      baseURL: apiRoot,
      method: "get",
      params: req.query,
      headers: {
        authorization: req.headers.authorization,
        clientid: req.spaceId.toString()
      }
    };
    console.log(config);
    axios(config)
      .then(function(response) {
        var output = [];
        if (response.data && response.data.length > 0) {
          for (i = 0; i <= response.data.length; i++) {
            if (
              (!response.data[i].fields.requestid.phonenumber in
                ["+989197682386"],
              "+989333229291",
              "+989125138218")
            ) {
              output.push(response.data[i]);
              if (response.data[i]) {
                response.data[i].fields.requestid.phonenumber = undefined;
                response.data[i].fields.requestid.fullname = undefined;
                response.data[i].fields.requestid.email = undefined;
                response.data[i].fields.requestid.resume = undefined;
                response.data[i].fields.requestid.avatar = undefined;
                response.data[i].fields.partnerid = undefined;
              }
            }
          }
        }
        res.send(output);
      })
      .catch(function(error) {
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
          console.log("Error", error.message);
          res.status(500).send(error.message);
        }
        console.log(error.config);
        res.status(400).send(error.config);
      });
  }
];

exports.getOpenedApplications = [
  (req, res, next) => {
    var apiRoot =
      process.env.CONTENT_DELIVERY_API || "https://app-dpanel.herokuapp.com";
    var config = {
      url: "/contents/search",
      baseURL: apiRoot,
      method: "get",
      params: req.query,
      headers: {
        authorization: req.headers.authorization,
        clientid: req.spaceId.toString()
      }
    };
    console.log(config);
    axios(config)
      .then(function(response) {
        var output = [];
        if (response.data && response.data.length > 0) {
          for (i = 0; i <= response.data.length; i++) {
            if (
              (!response.data[i].fields.requestid.phonenumber in
                ["+989197682386"],
              "+989333229291",
              "+989125138218")
            ) {
              output.push(response.data[i]);
            }
          }
        }
        res.send(output);
      })
      .catch(function(error) {
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
          console.log("Error", error.message);
          res.status(500).send(error.message);
        }
        console.log(error.config);
        res.status(400).send(error.config);
      });
  }
];

exports.openApplication = [
  (req, res, next) => {
    req.body.id = req.params.id;
    broker
      .sendRPCMessage(
        { spaceId: req.spaceid, userId: req.userId, body: req.body },
        "partialupdatecontent"
      )
      .then(result => {
        var obj = JSON.parse(result.toString("utf8"));
        if (!obj.success) {
          if (obj.error) return res.status(500).json(obj);
          else {
            res.status(404).json(obj);
          }
        } else {
          console.log(req);
          var apiRoot =
            process.env.CONTENT_DELIVERY_API ||
            "https://app-dpanel.herokuapp.com";
          var config = {
            url: "/contents/query",
            baseURL: apiRoot,
            method: "get",
            params: {
              _id: obj.data.fields.request
                ? obj.data.fields.request
                : obj.data.fields.requestid
            },
            headers: {
              authorization: req.headers.authorization,
              clientid: req.spaceId.toString()
            }
          };
          console.log(config);
          axios(config)
            .then(function(response) {
              if (response.data && response.data.length > 0)
                res.send(response.data[0]);
              else res.status(204).send();
            })
            .catch(function(error) {
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
                console.log("Error", error.message);
                res.status(500).send(error.message);
              }
              console.log(error.config);
              res.status(400).send(error.config);
            });
          //res.status(200).json(obj.data);
        }
      });
  }
];

exports.cancelApplication = [
  (req, res, next) => {
    req.body.id = req.params.id;
    broker
      .sendRPCMessage(
        { spaceId: req.spaceid, userId: req.userId, body: req.body },
        "partialupdatecontent"
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
  }
];

exports.rejectApplication = [
  (req, res, next) => {
    req.body.id = req.params.id;
    broker
      .sendRPCMessage(
        { spaceId: req.spaceid, userId: req.userId, body: req.body },
        "partialupdatecontent"
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
  }
];
