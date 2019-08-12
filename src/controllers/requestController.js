var axios = require("axios");
const async = require("async");
const broker = require("./serviceBroker");
exports.myRequests = [
  (req, res, next) => {
    var apiRoot =
      process.env.CONTENT_DELIVERY_API || "https://app-dpanel.herokuapp.com";
    var config = {
      url: "/graphql",
      baseURL: apiRoot,
      method: "get",
      params: {
        query:
          '{contents(contentType : "' +
          req.params.contentType +
          '"){ fields, _id, sys{issuer issueDate} }  }'
      },
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

exports.submit = [
  (req, res, next) => {
    broker
      .sendRPCMessage({ body: req.body, spaceId: req.spaceId }, "addcontent")
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

exports.getRequestsOffers = [
  (req, res, next) => {
    var apiRoot =
      process.env.CONTENT_DELIVERY_API || "https://app-dpanel.herokuapp.com";
    var query = "";
    if (req.query) {
      query += "fields:{";
      var start = true;
      for (var attr in req.query) {
        if (!start) query += "," + attr + ':"' + req.query[attr] + '"';
        else query += attr + ':"' + req.query[attr] + '"';
      }
      query += "}";
      console.log(query);
    }
    var config = {
      url: "/graphql",
      baseURL: apiRoot,
      method: "get",
      params: {
        query:
          "{contents(" + query + "){ fields, _id, sys{issuer issueDate} }  }"
      },
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
      url: "/graphql",
      baseURL: apiRoot,
      method: "get",
      params: {
        query:
          '{contents(contentType : "' +
          req.params.contentType +
          '"){ fields, _id, sys{issuer issueDate} }  }'
      },
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

exports.getOpenedApplications = [
  (req, res, next) => {
    var apiRoot =
      process.env.CONTENT_DELIVERY_API || "https://app-dpanel.herokuapp.com";
    var config = {
      url: "/graphql",
      baseURL: apiRoot,
      method: "get",
      params: {
        query:
          '{contents(contentType : "' +
          req.params.contentType +
          '"){ fields, _id, sys{issuer issueDate} }  }'
      },
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

exports.openApplication = [
  (req, res, next) => {
    var apiRoot =
      process.env.CONTENT_DELIVERY_API || "https://app-dpanel.herokuapp.com";
    var config = {
      url: "/graphql",
      baseURL: apiRoot,
      method: "get",
      params: {
        query:
          '{contents(contentType : "' +
          req.params.contentType +
          '"){ fields, _id, sys{issuer issueDate} }  }'
      },
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

exports.rejectApplication = [
  (req, res, next) => {
    var apiRoot =
      process.env.CONTENT_DELIVERY_API || "https://app-dpanel.herokuapp.com";
    var config = {
      url: "/graphql",
      baseURL: apiRoot,
      method: "get",
      params: {
        query:
          '{contents(contentType : "' +
          req.params.contentType +
          '"){ fields, _id, sys{issuer issueDate} }  }'
      },
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
