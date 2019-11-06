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
    var contacttype = "5dc272d251b8310017540c51",
      detailtype = "";
    switch (req.spaceId.toString()) {
      case "5d26e793375e9b001745e84d":
        contacttype = "5dc272d251b8310017540c51";
        break;
      case "5cf3883dcce4de00174d48cf":
        contacttype = "";
        break;
    }
    var details = req.body.details;
    var contact = req.body.contact;
    req.body.details = undefined;
    req.body.contact = undefined;
    var space = req.spaceId.toString();
    var output = {};
    var tasks = {
      contact: function(callback) {
        ///First query to get existing contact
        var apiRoot =
          process.env.CONTENT_DELIVERY_API ||
          "https://app-dpanel.herokuapp.com";
        var config = {
          url: "/contents/query",
          baseURL: apiRoot,
          method: "get",
          params: {
            contentType: contacttype,
            "fields.phonenumber": req.body.fields.phoneNumber,
            "sys.spaceId": req.spaceId.toString()
          },
          headers: {
            authorization: req.headers.authorization,
            clientid: req.spaceId.toString()
          }
        };
        console.log(config);
        axios(config)
          .then(function(response) {
            if (response.data && response.data.length > 0) {
              //contact exists
              output.contact = response.data[0];
              callback(undefined, response.data[0]);
            } else {
              //create new contact

              var fields = {
                phonenumber: req.body.fields.phoneNumber,
                name: req.body.fields.fullname,
                email: req.body.fields.email,
                country: req.body.fields.country,
                city: req.body.fields.city,
                location: req.body.fields.location
              };
              var data = {};
              data.fields = fields;
              data["contentType"] = contacttype;
              broker
                .sendRPCMessage(
                  { body: data, userId: req.userId, spaceId: req.spaceId },
                  "addcontent"
                )
                .then(result => {
                  var obj = JSON.parse(result.toString("utf8"));
                  if (!obj.success) {
                    if (obj.error) {
                      output.contact = undefined;
                      callback(obj, undefined);
                    }
                  } else {
                    //do mach making and submit to partners
                    output.contact = obj.data;
                    callback(undefined, obj.data);
                  }
                });
            }
          })
          .catch(function(error) {
            output.contact = undefined;
            callback(error, undefined);
          });
      },
      details: function(callback) {
        var fields = {
          name: req.body.fields.name,
          amount: req.body.fields.amount,
          amortization: req.body.fields.amortization,
          loanType: req.body.fields.loanType,
          guarantee: req.body.fields.guarantee,
          priority: req.body.fields.priority
        };
        var data = {};
        data.fields = fields;
        data["contentType"] = req.body.contentType;
        broker
          .sendRPCMessage(
            { body: data, userId: req.userId, spaceId: req.spaceId },
            "addcontent"
          )
          .then(result => {
            var obj = JSON.parse(result.toString("utf8"));
            if (!obj.success) {
              if (obj.error) {
                output.details = undefined;
                callback(obj);
              }
            } else {
              //do mach making and submit to partners
              output.details = obj.data;
              callback(undefined, obj.data);
            }
          });
      },
      request: function(callback) {
        var data = {};
        if (output.details && output.contact) {
          var fields = {
            name: req.body.fields.name,
            contact: output.contact._id,
            details: output.details._id,
            stage: req.body.fields.stage,
            src: req.body.fields.src
          };
          var ctype = "5dc0429a93259a00177dacd4";
          switch (req.spaceId.toString()) {
            case "5d26e793375e9b001745e84d":
              ctype = "5dc0429a93259a00177dacd4";
              break;
            case "5cf3883dcce4de00174d48cf":
              ctype = "";
              break;
          }
          data.contentType = ctype;
          data.fields = fields;
          broker
            .sendRPCMessage(
              { body: data, userId: req.userId, spaceId: req.spaceId },
              "addcontent"
            )
            .then(result => {
              var obj = JSON.parse(result.toString("utf8"));
              if (!obj.success) {
                if (obj.error) {
                  callback(obj.error);
                }
              } else {
                //do mach making and submit to partners
                output.request = obj.data;
                callback(undefined, obj.data);
              }
            });
        }
      }
    };
    async.series(tasks, (err, results) => {
      if (err) {
        res.status(400).send(err);
      } else res.status(201).send(output.request);
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
        if (response.data && response.data.length > 0) {
          for (i = 0; i <= response.data.length; i++) {
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
