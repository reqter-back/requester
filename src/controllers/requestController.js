var axios = require('axios');
exports.myrequests = [
    (req, res, next)=>{
        var apiRoot = process.env.CONTENT_DELIVERY_API || "https://app-dpanel.herokuapp.com";
        var config = {
          url : "/graphql",
          baseURL : apiRoot,
          method : "get",
          params : {
            "query" : "{contents(contentType : \"" + req.params.contentType + "\"){ fields }  }"
          },
          headers : {
              'Authorization' : req.headers.authorization,
              'clientid' : req.headers.clientid
          }
        };
        console.log(config);
        axios(config).then(function (response) {
          if (response.data && response.data.data && response.data.data.contents)
            res.send(response.data.data.contents.map(a => a.fields));
          else
          es.send(response.data);
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
]