const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const culture = process.env.CULTURE | "fa-IR";
const broker = require('./serviceBroker');
const Tokens = require('../models/token');
const jwt = require('jsonwebtoken');
const config = require('../config');
var wrapUser = function(user)
{
    if (user)
    {
        user.password = undefined;
        user.avatar = "/docs/img/uploads/" + user.avatar;
    }
    return user;
}

var sendVerifyCode = function(phoneNumber, code, deviceToken, clientId)
{
    if (process.env.NODE_ENV == "production")
    {
        broker.sendRPCMessage({body : {"phoneNumber" : phoneNumber, "code" : code, clientId : clientId}}, 'sendVerifyCode').then((result)=>{
            var obj = JSON.parse(result.toString('utf8'));
            if (!obj.success)
                console.log('Code not sent. Error code : ' + obj.error  + " response : " + obj.data);
            else
                console.log('Code(' + code + ') successfully sent to ' + phoneNumber);
        });
    }
    else
    {
        if (deviceToken)
        {
            broker.sendRPCMessage({body : {"device" : deviceToken, "message" : {
                "body" :"Your verification code is :" + code,
                 "title" : "Verification code"
                },
                "data" : {
                 "type" : "LOGIN_VERIFICATION"
                }
            }}, 'sendPushMessage').then((result)=>{
                var obj = JSON.parse(result.toString('utf8'));
                if (!obj.success)
                    console.log('Push message not sent. Error code : ' + obj.error  + " response : " + obj.data);
                else
                    console.log('Push message successfully sent');
            });
        }
    }
}

var generateToken = function(client, authenticated, expireTime, scope)
{
  var token;
  token = jwt.sign({ clientId : client, scope : scope, authenticated : authenticated }, config.secret, {
    expiresIn: expireTime
  });
  return token;
}

function getNewCode(phoneNumber)
{
    var min = 1000;
    var max = 9999;
    var code = Math.floor(Math.random() * (max - min)) + min;
    //Sent code to the phone
    return code;
}
exports.requestcode = [
    body("phoneNumber", "Phone number is required")
    .not()
    .isEmpty()
    .withMessage("Phone number is required")
    .isNumeric()
    .isLength({ min: 11, max: 14 })
    .withMessage("Phone number is invalid")
    .matches(/^(\+98|0)?9\d{9}$/)
    .withMessage("Phone number is in invalid format"),
    (req, res, next) =>{
        var errors = validationResult(req);
    if (!errors.isEmpty()) {
      //There are errors. send error result
      return res.status(400).json({
        success: false,
        code: "INVALID_REQUEST",
        errors: errors.array()
      });
      return;
    } else 
        {
            console.log(req.body);
            
            var accessToken = new Tokens({
                accessToken: generateToken(req.clientId, false, 5 * 60 * 60, "verify"),
                accessTokenExpiresOn: process.env.TEMP_TOKEN_EXPIRE_TIME || 5 * 60 * 60,
                clientId: req.clientId,
                refreshToken: undefined,
                accessTokenExpiresOn: undefined,
                userId: req.body.phoneNumber,
                deviceToken : req.headers["deviceToken"]
              });
              accessToken.activation_code = getNewCode();
              accessToken.authenticated = false;
              // Can't just chain `lean()` to `save()` as we did with `findOne()` elsewhere. Instead we use `Promise` to resolve the data.
              return new Promise( function(resolve,reject){
                accessToken.save(function(err,data){
                  if( err ) reject( err );
                  else resolve( data );
                }) ;
              }).then(function(saveResult){
                // `saveResult` is mongoose wrapper object, not doc itself. Calling `toJSON()` returns the doc.
                saveResult = saveResult && typeof saveResult == 'object' ? saveResult.toJSON() : saveResult;
                console.log(saveResult)
                //Send activation code to user phone
                sendVerifyCode(req.body.phoneNumber, saveResult.activation_code, saveResult.deviceToken ? saveResult.deviceToken : undefined, req.clientId);
                if (process.env.NODE_ENV == "production")
                    res.status(200).json({"success" : true, "authenticated" : false, "message" : "Code generated and sent to your phone"});
                else
                    res.status(200).json({"success" : true, "authenticated" : false, "access_token" : saveResult.access_token, "activation_code" : saveResult.activation_code, "message" : "Code generated and sent to your phone"});

                return saveResult;
              }); 
        }
    }
]

exports.verifycode = [
    body("phoneNumber", "Phone number is required")
    .not()
    .isEmpty()
    .withMessage("Phone number is required")
    .isNumeric()
    .isLength({ min: 11, max: 14 })
    .withMessage("Phone number is invalid")
    .matches(/^(\+98|0)?9\d{9}$/)
    .withMessage("Phone number is in invalid format"),
    body("code", "Code is required")
    .not()
    .isEmpty()
    .withMessage("Code is required")
    .isNumeric()
    .isLength({ min: 4, max: 4 })
    .withMessage("Code is invalid"),
    //Sanitize fields
    sanitizeBody('code').trim().escape(),
    sanitizeBody('phoneNumber').trim().escape(),
    (req, res, next) =>{
        var errors = validationResult(req);
    if (!errors.isEmpty()) {
      //There are errors. send error result
      return res.status(422).json({
        success: false,
        code: "INVALID_REQUEST",
        errors: errors.array()
      });
      return;
    } 
    else {
            console.log({clientId : req.clientId, 'userId' : req.body.phoneNumber, activation_code : req.body.code, authenticated : false});
            Tokens.findOne({clientId : req.clientId, 'userId' : req.body.phoneNumber, activation_code : req.body.code, authenticated : false}).exec(function(err, tkn){
                var result = {success : false, message : undefined, error : "Invalid code" };
                if (err)
                {
                    res.status(400).send(result);
                    return;
                }
                if (tkn)
                {
                    var token = generateToken(req.clientId, true, 30 * 24 * 60 * 60, "read/write");
                    var accessToken = new Tokens({
                        accessToken: token,
                        accessTokenExpiresOn: process.env.TEMP_TOKEN_EXPIRE_TIME || 30 * 24 * 60 * 60,
                        clientId: req.clientId,
                        refreshToken: tkn.accessToken,
                        accessTokenExpiresOn: undefined,
                        userId: req.body.phoneNumber,
                        deviceToken : tkn.deviceToken,
                        authenticated : true
                      });
                      accessToken.save((err, data)=>{
                        if (err)
                        {
                            res.status(500).send({"success" : false,  error : "Unable to generate token"});
                            return;
                        }
                        res.send({"success" : true, "access_token" : token, expiresIn : 30 * 24 * 60 * 60});
                    });
                }
                else
                {
                    res.status(403).send({"success" : false,  error : "Invalid code"});
                }
            });
        }
    }
]

exports.login = [
 (req, res, next) =>{
 console.log(req.body);
 var errors = validationResult(req);
     if (!errors.isEmpty())
     {  
         //There are errors. send error result
         res.status(400).json({"success" : false, "error" : errors.message});
         return;
     }
     else
     {
         //#region Rabbit Implementation
         console.log('start connecting');
         
         broker.sendRPCMessage({body : req.body, headers : req.headers, method : "POST", query : {}}, 'token').then((result)=>{
             var obj = JSON.parse(result.toString('utf8'));
             if (!obj.success)
             {
                 if (obj.error)
                     return res.status(404).json(obj);
                else
                    return res.status(401).json(obj);
             }
             else
             {
                 if (obj.data)
                 {
                     if (!obj.data.authenticated)
                     {
                        //Send activation code to user phone
                        sendVerifyCode(req.body.phoneNumber, obj.data.activation_code, req.body.deviceToken);
                        if (process.env.NODE_ENV == "production")
                            res.status(200).json({success : true});
                        else
                            res.status(200).json({access_token : obj.data.access_token, authenticated : obj.data.authenticated, token_type : obj.data.token_type, activation_code : obj.data.activation_code});
                     }
                     else
                     {
                        res.status(200).json({access_token : obj.data.access_token, authenticated : true, token_type : obj.data.token_type, refresh_token : obj.data.refresh_token});
                     }
                 }
                 else
                 {
                     res.status(400).json({});
                 }
             }
         });
     }
}
];

exports.register = [
    (req, res, next) =>{
        var errors = validationResult(req);
        if (!errors.isEmpty())
        {  
            //There are errors. send error result
            res.status(400).json({"success" : false, "error" : errors});
            return;
        }
        else
        {
            console.log('add user started.')
            broker.sendRPCMessage({body : req.body, clientId : req.clientId}, 'register').then((result)=>{
                var obj = JSON.parse(result.toString('utf8'));
                if (!obj.success)
                {
                    if (obj.error)
                    {
                        return res.status(500).json(obj);
                    }
                }
                else
                {
                    res.status(201).json(wrapUser(obj.data));
                }
            });
        };
    }
];

exports.changecity = [
    body('id', "Id must not be empty"),
    body('citycode', "City code must not be empty").isNumeric().withMessage('Invalid city code.'),
    //Sanitize fields
    sanitizeBody('id').trim().escape(),
    sanitizeBody('citycode').trim().escape(),
    (req, res, next) =>{
        var errors = validationResult(req);
        if (!errors.isEmpty())
        {  
            //There are errors. send error result
            res.status(400).json({"success" : false, "error" : errors});
            return;
        }
        else
        {
            broker.sendRPCMessage({body : req.body}, 'changecity').then((result)=>{
                var obj = JSON.parse(result.toString('utf8'));
                if (!obj.success)
                {
                    if (obj.error)
                        return res.status(500).json(obj);
                    else
                    {
                        obj.error = "invalid id";
                        res.status(404).json(obj);
                    }
                }
                else
                {
                    res.status(200).json(wrapUser(obj.data));
                }
            }); 
        }
    }
]

exports.changenumber = [
    body('id', "Id must not be empty"),
    body('phoneNumber', "Phone number must not be empty"),
    body('code', "code must not be empty"),
    //Sanitize fields
    sanitizeBody('id').trim().escape(),
    sanitizeBody('phoneNumber').trim().escape(),
    sanitizeBody('code').trim().escape(),
    (req, res, next) =>{
        var errors = validationResult(req);
        if (!errors.isEmpty())
        {  
            //There are errors. send error result
            res.status(400).json({"success" : false, "error" : errors});
            return;
        }
        else
        {
            broker.sendRPCMessage({body : req.body}, 'changenumber').then((result)=>{
                var obj = JSON.parse(result.toString('utf8'));
                if (!obj.success)
                {
                    if (obj.error)
                        return res.status(500).json(obj);
                    else
                    {
                        obj.error = "invalid id";
                        res.status(404).json(obj);
                    }
                }
                else
                {
                    res.status(200).json(wrapUser(obj.data));
                }
            });
        }
    }
]

exports.changeavatar = [
    body('id', "Id must not be empty"),
    //Sanitize fields
    sanitizeBody('id').trim().escape(),
    (req, res, next) =>{
        console.log(JSON.stringify(req.file));
        if (req.file === undefined || req.file == null)
        {
            //There is no avatar in the request
            res.status(400).json({"success" : false, "error" : "Avatar must not be null"});
            return;
        }
        var errors = validationResult(req);
        if (!errors.isEmpty())
        {  
            //There are errors. send error result
            res.status(400).json({"success" : false, "error" : errors});
            return;
        }
        else
        {
            broker.sendRPCMessage({body : {id : req.body.id, avatar : req.file}}, 'changeavatar').then((result)=>{
                var obj = JSON.parse(result.toString('utf8'));
                if (!obj.success)
                {
                    if (obj.error)
                        return res.status(500).json(obj);
                    else
                    {
                        obj.error = "invalid id";
                        res.status(404).json(obj);
                    }
                }
                else
                {
                    res.status(200).json(wrapUser(obj.data));
                }
            });
        }
    }
]

exports.updateprofile = [
    body('id', "Id must not be empty"),
    body('first_name', "First name must not be empty"),
    body('last_name', "Last name must not be empty"),
    body('address', "Address must not be empty"),
    //Sanitize fields
    sanitizeBody('id').trim().escape(),
    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('last_name').trim().escape(),
    sanitizeBody('address').trim().escape(),
    (req, res, next) =>{
        var errors = validationResult(req);
        if (!errors.isEmpty())
        {  
            //There are errors. send error result
            res.status(400).json({"success" : false, "error" : errors});
            return;
        }
        else
        {
            broker.sendRPCMessage({body : req.body}, 'updateprofile').then((result)=>{
                var obj = JSON.parse(result.toString('utf8'));
                if (!obj.success)
                {
                    if (obj.error)
                        return res.status(500).json(obj);
                    else
                    {
                        obj.error = "invalid id";
                        res.status(404).json(obj);
                    }
                }
                else
                {
                    res.status(200).json(wrapUser(obj.data));
                }
            });
        }
    }
]

exports.changelanguage = [
    body('id', "Id must not be empty"),
    body('language', "Language must not be empty"),
    //Sanitize fields
    sanitizeBody('id').trim().escape(),
    sanitizeBody('language').trim().escape(),
    (req, res, next) =>{
        var errors = validationResult(req);
        if (!errors.isEmpty())
        {  
            //There are errors. send error result
            res.status(400).json({"success" : false, "error" : errors});
            return;
        }
        else
        {
            broker.sendRPCMessage({body : req.body}, 'changelanguage').then((result)=>{
                var obj = JSON.parse(result.toString('utf8'));
                if (!obj.success)
                {
                    if (obj.error)
                        return res.status(500).json(obj);
                    else
                    {
                        obj.error = "invalid id";
                        res.status(404).json(obj);
                    }
                }
                else
                {
                    res.status(200).json(wrapUser(obj.data));
                }
            });
        }
    }
]

exports.changenotification = [
    body('id', "Id must not be empty"),
    body('notification', "notify must not be empty"),
    //Sanitize fields
    sanitizeBody('id').trim().escape(),
    (req, res, next) =>{
        var errors = validationResult(req);
        if (!errors.isEmpty())
        {  
            //There are errors. send error result
            res.status(400).json({"success" : false, "error" : errors});
            return;
        }
        else
        {
            broker.sendRPCMessage({body : req.body}, 'changenotification').then((result)=>{
                var obj = JSON.parse(result.toString('utf8'));
                if (!obj.success)
                {
                    if (obj.error)
                        return res.status(500).json(obj);
                    else
                    {
                        obj.error = "invalid id";
                        res.status(404).json(obj);
                    }
                }
                else
                {
                    res.status(200).json(wrapUser(obj.data));
                }
            });
        }
    }
]

exports.deleteaccount = [
    body('id', "Id must not be empty"),
    //Sanitize fields
    sanitizeBody('id').trim().escape(),
    (req, res, next) =>{
        var errors = validationResult(req);
        if (!errors.isEmpty())
        {  
            //There are errors. send error result
            res.status(400).json({"success" : false, "error" : errors});
            return;
        }
        else
        {
            broker.sendRPCMessage({body : req.body}, 'deleteaccount').then((result)=>{
                var obj = JSON.parse(result.toString('utf8'));
                if (!obj.success)
                {
                    if (obj.error)
                        return res.status(500).json(obj);
                    else
                    {
                        obj.error = "invalid id";
                        res.status(404).json(obj);
                    }
                }
                else
                {
                    res.status(200).json({"success" : true, "message" : "You successfully deleted your account. You will no longer have access to your account"});
                }
            });
        }
    }
]

exports.locationchanged = [
    body('id', "Id must not be empty"),
    body('location', "Location must not be empty"),
    //Sanitize fields
    sanitizeBody('id').trim().escape(),
    sanitizeBody('location').trim().escape(),
    (req, res, next) =>{
        var errors = validationResult(req);
        if (!errors.isEmpty())
        {  
            //There are errors. send error result
            res.status(400).json({"success" : false, "error" : errors});
            return;
        }
        else
        {
            broker.sendRPCMessage({body : req.body}, 'locationchanged').then((result)=>{
                var obj = JSON.parse(result.toString('utf8'));
                if (!obj.success)
                {
                    if (obj.error)
                        return res.status(500).json(obj);
                    else
                    {
                        obj.error = "invalid id";
                        res.status(404).json(obj);
                    }
                }
                else
                {
                    res.status(200).json(wrapUser(obj.data));
                }
            });
        }
    }
]

exports.getuserinfo = [
    (req, res, next) =>{
        var errors = validationResult(req);
        if (!errors.isEmpty())
        {  
            //There are errors. send error result
            res.status(400).json({"success" : false, "error" : errors});
            return;
        }
        else
        {
            broker.sendRPCMessage({body : req.query}, 'findbyphone').then((result)=>{
                var obj = JSON.parse(result.toString('utf8'));
                if (!obj.success)
                {
                    if (obj.error)
                        return res.status(500).json(obj);
                    else
                    {
                        obj.error = "Invalid phone number";
                        res.status(404).json(obj);
                    }
                }
                else
                {
                    res.status(200).json(wrapUser(obj.data));
                }
            });
        }
    }
]
