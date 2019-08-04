var express = require('express');

var router = express.Router();
var usercontoller = require('../controllers/partnerController');
var auth = require('../controllers/auth');


/**
 * @api {post} /user/api/v1/requestcode Request code
 * @apiName Request activation code for a phonenumber
 * @apiGroup User
 *
 * @apiHeader {String} Authorization Users unique access-key.
 * @apiHeaderExample {String} Authorization
 * { 
 *    "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMWQ2YzdiNzk3YThmMTQ4MjUxYzZiZSIsInBob25lTnVtYmVyIjoiMDkxOTc2ODIzODYiLCJpYXQiOjE1NDU2NTAxNjksImV4cCI6MTU0NTczNjU2OX0.32Vaz9Zo_g0wD1klKOTzb1VGMy9JusV3dZgTJTyLJ7I"
 * }
 * @apiParam {String} phonenumber New phone number
 *
 * @apiSuccessExample Success Response 
HTTP/1.1 200 OK
{
    "activation_code" : 1243
}
 *
  * @apiErrorExample UnAuthorized
  HTTP/1.1 401 UnAuthorized access
 {
    "success": false,
    "error" : {
       //error details
    }
 }
* @apiErrorExample Servr Error
HTTP/1.1 500 Internal server error
 {
    "success": false,
    "error" : {
       //error details
    }
 }

 */
router.post("/api/v1/requestcode", usercontoller.requestcode);
/**
 * @api {post} /user/api/v1/verifycode VerifyCode
 * @apiName Verify Code
 * @apiGroup User
 *
 * @apiParam {String} phoneNumber User unique phone number 
 * @apiParam {String} code activation code
 *
 * @apiSuccessExample Success Response 
 HTTP/1.1 200 OK
{
    "roles": [
        "user"
    ],
    "_id": "5c2161acdfa08f285c33c44c",
    "phoneNumber": "09388475257",
    "first_name": "Saeed",
    "last_name": "Padyab olsun",
    "city_code": 1,
    "__v": 0,
    "address": "no.41, Block 23, Bosphorous city, 221 Sokak, Kucukcekmace, Istanbul, Turkey",
    "location": {
        "lat": 34.65,
        "long": 54.56
    },
    "avatar": "/docs/img/uploads/avatar-1546717703454.jpeg",
    "notification": true,
    "language": "en",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMjE2MWFjZGZhMDhmMjg1YzMzYzQ0YyIsInJvbGVzIjpbInNob3BwZXIiXSwiaWF0IjoxNTQ2NzMzMTIxLCJleHAiOjE1NDY4MTk1MjF9.N_hieabS77RTSpUIn3wMVUw6rcW6d6D-Gn63KiTe__A",
    "name": "Saeed",
    "city": {
        "_id": "5c24cee9fb6fc00eee871c09",
        "cityCode": 1,
        "name": {
            "fa": "تهران",
            "en": "Tehran"
        }
    },
    "id": "5c2161acdfa08f285c33c44c"
}
 *
* @apiErrorExample Servr Error
  HTTP/1.1 500 Internal server error
 {
    "success": false,
    "error" : {
       //error details
    }
 }
 * @apiErrorExample Invalid code
  HTTP/1.1 400 Bad Request
 {
    "success": false,
    "error" : "invalid code"
 }

  * @apiErrorExample Invalid phone number
  HTTP/1.1 404 Not Found
  {
    "success": false,
    "error" : "invalid phone number"
 }
 */
router.post("/api/v1/verifycode", auth.verifyCode, usercontoller.verifycode);
/**
 * @api {post} /user/api/v1/loginbyusername Login By UserName
 * @apiName LoginByUserName
 * @apiGroup User
 *
 * @apiParam {String} username User unique user name
 * @apiParam {String} password User password
 *
 * @apiSuccessExample TwoFactor Authentication
 HTTP/1.1 200 OK
 {
    success : true
 }
 * @apiSuccessExample Successful login 
 HTTP/1.1 200 OK
     "roles": [
        "user"
    ],
    "_id": "5c2161acdfa08f285c33c44c",
    "phoneNumber": "09388475257",
    "first_name": "Saeed",
    "last_name": "Padyab olsun",
    "city_code": 1,
    "__v": 0,
    "address": "no.41, Block 23, Bosphorous city, 221 Sokak, Kucukcekmace, Istanbul, Turkey",
    "location": {
        "lat": 34.65,
        "long": 54.56
    },
    "avatar": "/docs/img/uploads/avatar-1546717703454.jpeg",
    "notification": true,
    "language": "en",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMjE2MWFjZGZhMDhmMjg1YzMzYzQ0YyIsInJvbGVzIjpbInNob3BwZXIiXSwiaWF0IjoxNTQ2NzMzMTIxLCJleHAiOjE1NDY4MTk1MjF9.N_hieabS77RTSpUIn3wMVUw6rcW6d6D-Gn63KiTe__A",
    "name": "Saeed",
    "city": {
        "_id": "5c24cee9fb6fc00eee871c09",
        "cityCode": 1,
        "name": {
            "fa": "تهران",
            "en": "Tehran"
        }
    },
    "id": "5c2161acdfa08f285c33c44c"
}
 *
 *
 * @apiErrorExample Servr Error
  HTTP/1.1 500 Internal server error
 {
    "success": false,
    "error" : {
       //error details
    }
 }
  * @apiErrorExample Bad Request
  HTTP/1.1 400 Bad error
 {
    "success": false,
    "error" : {
       //error details
    }
 }
 */
router.post('/api/v1/login', usercontoller.login);

/**
 * @api {post} /user/api/v1/signupbyusername Signup by username and email
 * @apiName SignupByUserName
 * @apiGroup User
 *
 * @apiParam {String} username User unique username
 * @apiParam {String} email User email
 * @apiParam {String} password User password
 *
 *
 * @apiSuccessExample New user 
 HTTP/1.1 201 Created
 {
   "roles": [
   "user"
    ],
    "_id": "5c2161acdfa08f285c33c44c",
    "phoneNumber": "09388475257",
    "first_name": "Saeed",
    "last_name": "Padyab olsun",
    "city_code": 1,
    "__v": 0,
    "address": "no.41, Block 23, Bosphorous city, 221 Sokak, Kucukcekmace, Istanbul, Turkey",
    "location": {
        "lat": 34.65,
        "long": 54.56
    },
    "avatar": "/docs/img/uploads/avatar-1546717703454.jpeg",
    "notification": true,
    "language": "en",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMjE2MWFjZGZhMDhmMjg1YzMzYzQ0YyIsInJvbGVzIjpbInNob3BwZXIiXSwiaWF0IjoxNTQ2NzMzMTIxLCJleHAiOjE1NDY4MTk1MjF9.N_hieabS77RTSpUIn3wMVUw6rcW6d6D-Gn63KiTe__A",
    "name": "Saeed",
    "city": {
        "_id": "5c24cee9fb6fc00eee871c09",
        "cityCode": 1,
        "name": {
            "fa": "تهران",
            "en": "Tehran"
        }
    },
    "id": "5c2161acdfa08f285c33c44c"
}
 }
 *
 * @apiErrorExample Servr Error
  HTTP/1.1 500 Internal server error
 {
    "success": false,
    "error" : {
       //error details
    }
 }
 */
router.post("/api/v1/register", usercontoller.register);


/**
 * @api {get} /user/api/v1/getuserinfo Get User Info
 * @apiName GetUserInfo
 * @apiGroup User
 *
 * @apiHeader {String} Authorization Users unique access-key.
 * @apiHeaderExample {String} Authorization
 * { 
 *    "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMWQ2YzdiNzk3YThmMTQ4MjUxYzZiZSIsInBob25lTnVtYmVyIjoiMDkxOTc2ODIzODYiLCJpYXQiOjE1NDU2NTAxNjksImV4cCI6MTU0NTczNjU2OX0.32Vaz9Zo_g0wD1klKOTzb1VGMy9JusV3dZgTJTyLJ7I"
 * }
 * @apiParam {String} phoneNumber user
 *
 * @apiSuccessExample Success Response 
HTTP/1.1 200 OK
{
    "roles": [
        "user"
    ],
    "_id": "5c2161acdfa08f285c33c44c",
    "phoneNumber": "09388475257",
    "first_name": "Saeed",
    "last_name": "Padyab olsun",
    "city_code": 1,
    "__v": 0,
    "address": "no.41, Block 23, Bosphorous city, 221 Sokak, Kucukcekmace, Istanbul, Turkey",
    "location": {
        "lat": 34.65,
        "long": 54.56
    },
    "avatar": "/docs/img/uploads/avatar-1546717703454.jpeg",
    "notification": true,
    "language": "en",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMjE2MWFjZGZhMDhmMjg1YzMzYzQ0YyIsInJvbGVzIjpbInNob3BwZXIiXSwiaWF0IjoxNTQ2NzMzMTIxLCJleHAiOjE1NDY4MTk1MjF9.N_hieabS77RTSpUIn3wMVUw6rcW6d6D-Gn63KiTe__A",
    "name": "Saeed",
    "city": {
        "_id": "5c24cee9fb6fc00eee871c09",
        "cityCode": 1,
        "name": {
            "fa": "تهران",
            "en": "Tehran"
        }
    },
    "id": "5c2161acdfa08f285c33c44c"
}
 *
  * @apiErrorExample UnAuthorized
  HTTP/1.1 401 UnAuthorized access
 {
    "success": false,
    "error" : {
       //error details
    }
 }
* @apiErrorExample Servr Error
  HTTP/1.1 500 Internal server error
 {
    "success": false,
    "error" : {
       //error details
    }
 }
 * @apiErrorExample Invalid phoneNumber
  HTTP/1.1 400 Bad Request
 {
    "success": false,
    "error" : "invalid phone number"
 }

  * @apiErrorExample User not found
  HTTP/1.1 404 Not Found
  {
    "success": false,
    "error" : "User not found"
 }
 */
router.get("/api/v1/getuserinfo", auth.verifyToken, usercontoller.getuserinfo);
/**
 * @api {put} /user/api/v1/changecity Change City
 * @apiName ChangeCity
 * @apiGroup User
 *
 * @apiHeader {String} Authorization Users unique access-key.
 * @apiHeaderExample {String} Authorization
 * { 
 *    "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMWQ2YzdiNzk3YThmMTQ4MjUxYzZiZSIsInBob25lTnVtYmVyIjoiMDkxOTc2ODIzODYiLCJpYXQiOjE1NDU2NTAxNjksImV4cCI6MTU0NTczNjU2OX0.32Vaz9Zo_g0wD1klKOTzb1VGMy9JusV3dZgTJTyLJ7I"
 * }
 * @apiParam {String} id user
 * @apiParam {String} citycode Selected city code
 *
 * @apiSuccessExample Success Response 
HTTP/1.1 200 OK
{
    "roles": [
        "user"
    ],
    "_id": "5c2161acdfa08f285c33c44c",
    "phoneNumber": "09388475257",
    "first_name": "Saeed",
    "last_name": "Padyab olsun",
    "city_code": 1,
    "__v": 0,
    "address": "no.41, Block 23, Bosphorous city, 221 Sokak, Kucukcekmace, Istanbul, Turkey",
    "location": {
        "lat": 34.65,
        "long": 54.56
    },
    "avatar": "/docs/img/uploads/avatar-1546717703454.jpeg",
    "notification": true,
    "language": "en",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMjE2MWFjZGZhMDhmMjg1YzMzYzQ0YyIsInJvbGVzIjpbInNob3BwZXIiXSwiaWF0IjoxNTQ2NzMzMTIxLCJleHAiOjE1NDY4MTk1MjF9.N_hieabS77RTSpUIn3wMVUw6rcW6d6D-Gn63KiTe__A",
    "name": "Saeed",
    "city": {
        "_id": "5c24cee9fb6fc00eee871c09",
        "cityCode": 1,
        "name": {
            "fa": "تهران",
            "en": "Tehran"
        }
    },
    "id": "5c2161acdfa08f285c33c44c"
}
 *
* @apiErrorExample Servr Error
  HTTP/1.1 500 Internal server error
 {
    "success": false,
    "error" : {
       //error details
    }
 }
 * @apiErrorExample UnAuthorized
  HTTP/1.1 401 UnAuthorized access
 {
    "success": false,
    "error" : {
       //error details
    }
 }
 * @apiErrorExample Invalid city code
  HTTP/1.1 400 Bad Request
 {
    "success": false,
    "error" : "invalid city code"
 }

  * @apiErrorExample City not found 
  HTTP/1.1 404 Not Found
  {
    "success": false,
    "error" : "City not found"
 }
 */
router.put("/api/v1/changecity", auth.verifyToken, usercontoller.changecity);

/**
 * @api {put} /user/api/v1/changenumber Change Number
 * @apiName ChangeNumber
 * @apiGroup User
 *
 * @apiHeader {String} Authorization Users unique access-key.
 * @apiHeaderExample {String} Authorization
 * { 
 *    "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMWQ2YzdiNzk3YThmMTQ4MjUxYzZiZSIsInBob25lTnVtYmVyIjoiMDkxOTc2ODIzODYiLCJpYXQiOjE1NDU2NTAxNjksImV4cCI6MTU0NTczNjU2OX0.32Vaz9Zo_g0wD1klKOTzb1VGMy9JusV3dZgTJTyLJ7I"
 * }
 * @apiParam {String} id user
 * @apiParam {Number} phoneNumber newPhoneNumber
 * @apiParam {Number} code Activation code to change your number
 *
 * @apiSuccessExample Success Response 
HTTP/1.1 200 OK
{
    "roles": [
        "user"
    ],
    "_id": "5c2161acdfa08f285c33c44c",
    "phoneNumber": "09388475257",
    "first_name": "Saeed",
    "last_name": "Padyab olsun",
    "city_code": 1,
    "__v": 0,
    "address": "no.41, Block 23, Bosphorous city, 221 Sokak, Kucukcekmace, Istanbul, Turkey",
    "location": {
        "lat": 34.65,
        "long": 54.56
    },
    "avatar": "/docs/img/uploads/avatar-1546717703454.jpeg",
    "notification": true,
    "language": "en",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMjE2MWFjZGZhMDhmMjg1YzMzYzQ0YyIsInJvbGVzIjpbInNob3BwZXIiXSwiaWF0IjoxNTQ2NzMzMTIxLCJleHAiOjE1NDY4MTk1MjF9.N_hieabS77RTSpUIn3wMVUw6rcW6d6D-Gn63KiTe__A",
    "name": "Saeed",
    "city": {
        "_id": "5c24cee9fb6fc00eee871c09",
        "cityCode": 1,
        "name": {
            "fa": "تهران",
            "en": "Tehran"
        }
    },
    "id": "5c2161acdfa08f285c33c44c"
}
 *
  * @apiErrorExample UnAuthorized
  HTTP/1.1 401 UnAuthorized access
 {
    "success": false,
    "error" : {
       //error details
    }
 }
* @apiErrorExample Servr Error
HTTP/1.1 500 Internal server error
 {
    "success": false,
    "error" : {
       //error details
    }
 }

 */
router.put("/api/v1/changenumber", auth.verifyToken, usercontoller.changenumber);

/**
 * @api {put} /user/api/v1/changeavatar Change Avatar
 * @apiName ChangeAvatar
 * @apiGroup User
 *
 * @apiHeader {String} Authorization Users unique access-key
 * @apiHeader {String} Content-Type Content type
 * @apiHeaderExample {String} Authorization Example
 * { 
 *    "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMWQ2YzdiNzk3YThmMTQ4MjUxYzZiZSIsInBob25lTnVtYmVyIjoiMDkxOTc2ODIzODYiLCJpYXQiOjE1NDU2NTAxNjksImV4cCI6MTU0NTczNjU2OX0.32Vaz9Zo_g0wD1klKOTzb1VGMy9JusV3dZgTJTyLJ7I",
 *    "Content-Type"  : "multipart/form-data"
 * }
 * @apiParam {String} id user
 * @apiParam {file} avatar User avatar file
 *
 * @apiSuccessExample Success Response 
HTTP/1.1 200 OK
{
    "roles": [
        "user"
    ],
    "_id": "5c2161acdfa08f285c33c44c",
    "phoneNumber": "09388475257",
    "first_name": "Saeed",
    "last_name": "Padyab olsun",
    "city_code": 1,
    "__v": 0,
    "address": "no.41, Block 23, Bosphorous city, 221 Sokak, Kucukcekmace, Istanbul, Turkey",
    "location": {
        "lat": 34.65,
        "long": 54.56
    },
    "avatar": "/docs/img/uploads/avatar-1546717703454.jpeg",
    "notification": true,
    "language": "en",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMjE2MWFjZGZhMDhmMjg1YzMzYzQ0YyIsInJvbGVzIjpbInNob3BwZXIiXSwiaWF0IjoxNTQ2NzMzMTIxLCJleHAiOjE1NDY4MTk1MjF9.N_hieabS77RTSpUIn3wMVUw6rcW6d6D-Gn63KiTe__A",
    "name": "Saeed",
    "city": {
        "_id": "5c24cee9fb6fc00eee871c09",
        "cityCode": 1,
        "name": {
            "fa": "تهران",
            "en": "Tehran"
        }
    },
    "id": "5c2161acdfa08f285c33c44c"
}
 *
  * @apiErrorExample UnAuthorized
  HTTP/1.1 401 UnAuthorized access
 {
    "success": false,
    "error" : {
       //error details
    }
 }
* @apiErrorExample Servr Error
HTTP/1.1 500 Internal server error
 {
    "success": false,
    "error" : {
       //error details
    }
 }

 * @apiErrorExample User Not Found
 HTTP/1.1 404 User Not Found
 {
    "success": false,
    "error" : {
       "error" : "invalid id"
    }
 }

  * @apiErrorExample No File
 HTTP/1.1 400 Bad Request
 {
    "success": false,
    "error" : {
       "error" : "Avatar must be a valid file name"
    }
 }
 */
router.put("/api/v1/changeavatar", auth.verifyToken, usercontoller.changeavatar);

/**
 * @api {put} /user/api/v1/updateprofile Update Profile
 * @apiName UpdateProfile
 * @apiGroup User
 *
 * @apiHeader {String} Authorization Users unique access-key
 * @apiHeaderExample {String} Authorization Example
 * { 
 *    "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMWQ2YzdiNzk3YThmMTQ4MjUxYzZiZSIsInBob25lTnVtYmVyIjoiMDkxOTc2ODIzODYiLCJpYXQiOjE1NDU2NTAxNjksImV4cCI6MTU0NTczNjU2OX0.32Vaz9Zo_g0wD1klKOTzb1VGMy9JusV3dZgTJTyLJ7I"
 * }
 * @apiParam {String} id user
 * @apiParam {String} first_name User first name
 * @apiParam {String} last_name User last name
 * @apiParam {String} address User address
 * @apiSuccessExample Success Response 
HTTP/1.1 200 OK
{
    "roles": [
        "user"
    ],
    "_id": "5c2161acdfa08f285c33c44c",
    "phoneNumber": "09388475257",
    "first_name": "Saeed",
    "last_name": "Padyab olsun",
    "city_code": 1,
    "__v": 0,
    "address": "no.41, Block 23, Bosphorous city, 221 Sokak, Kucukcekmace, Istanbul, Turkey",
    "location": {
        "lat": 34.65,
        "long": 54.56
    },
    "avatar": "/docs/img/uploads/avatar-1546717703454.jpeg",
    "notification": true,
    "language": "en",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMjE2MWFjZGZhMDhmMjg1YzMzYzQ0YyIsInJvbGVzIjpbInNob3BwZXIiXSwiaWF0IjoxNTQ2NzMzMTIxLCJleHAiOjE1NDY4MTk1MjF9.N_hieabS77RTSpUIn3wMVUw6rcW6d6D-Gn63KiTe__A",
    "name": "Saeed",
    "city": {
        "_id": "5c24cee9fb6fc00eee871c09",
        "cityCode": 1,
        "name": {
            "fa": "تهران",
            "en": "Tehran"
        }
    },
    "id": "5c2161acdfa08f285c33c44c"
}
 *
  * @apiErrorExample UnAuthorized
  HTTP/1.1 401 UnAuthorized access
 {
    "success": false,
    "error" : {
       //error details
    }
 }
* @apiErrorExample Servr Error
HTTP/1.1 500 Internal server error
 {
    "success": false,
    "error" : {
       //error details
    }
 }

 * @apiErrorExample User Not Found
 HTTP/1.1 404 User Not Found
 {
    "success": false,
    "error" : {
       "error" : "invalid id"
    }
 }
 */
router.put("/api/v1/updateprofile", auth.verifyToken, usercontoller.updateprofile);


/**
 * @api {put} /user/api/v1/changelanguage Change Language
 * @apiName ChangeLanguage
 * @apiGroup User
 *
 * @apiHeader {String} Authorization Users unique access-key
 * @apiHeaderExample {String} Authorization Example
 * { 
 *    "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMWQ2YzdiNzk3YThmMTQ4MjUxYzZiZSIsInBob25lTnVtYmVyIjoiMDkxOTc2ODIzODYiLCJpYXQiOjE1NDU2NTAxNjksImV4cCI6MTU0NTczNjU2OX0.32Vaz9Zo_g0wD1klKOTzb1VGMy9JusV3dZgTJTyLJ7I"
 * }
 * @apiParam {String} id user
 * @apiParam {String} language User selected language
 * @apiSuccessExample Success Response 
HTTP/1.1 200 OK
{
    "roles": [
        "user"
    ],
    "_id": "5c2161acdfa08f285c33c44c",
    "phoneNumber": "09388475257",
    "first_name": "Saeed",
    "last_name": "Padyab olsun",
    "city_code": 1,
    "__v": 0,
    "address": "no.41, Block 23, Bosphorous city, 221 Sokak, Kucukcekmace, Istanbul, Turkey",
    "location": {
        "lat": 34.65,
        "long": 54.56
    },
    "avatar": "/docs/img/uploads/avatar-1546717703454.jpeg",
    "notification": true,
    "language": "en",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMjE2MWFjZGZhMDhmMjg1YzMzYzQ0YyIsInJvbGVzIjpbInNob3BwZXIiXSwiaWF0IjoxNTQ2NzMzMTIxLCJleHAiOjE1NDY4MTk1MjF9.N_hieabS77RTSpUIn3wMVUw6rcW6d6D-Gn63KiTe__A",
    "name": "Saeed",
    "city": {
        "_id": "5c24cee9fb6fc00eee871c09",
        "cityCode": 1,
        "name": {
            "fa": "تهران",
            "en": "Tehran"
        }
    },
    "id": "5c2161acdfa08f285c33c44c"
}
 *
  * @apiErrorExample UnAuthorized
  HTTP/1.1 401 UnAuthorized access
 {
    "success": false,
    "error" : {
       //error details
    }
 }
* @apiErrorExample Servr Error
HTTP/1.1 500 Internal server error
 {
    "success": false,
    "error" : {
       //error details
    }
 }

 * @apiErrorExample User Not Found
 HTTP/1.1 404 User Not Found
 {
    "success": false,
    "error" : {
       "error" : "invalid id"
    }
 }
 */
router.put("/api/v1/changelanguage", auth.verifyToken, usercontoller.changelanguage);


/**
 * @api {put} /user/api/v1/changenotification Change Notification
 * @apiName ChangeNotification
 * @apiGroup User
 *
 * @apiHeader {String} Authorization Users unique access-key
 * @apiHeaderExample {String} Authorization Example
 * { 
 *    "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMWQ2YzdiNzk3YThmMTQ4MjUxYzZiZSIsInBob25lTnVtYmVyIjoiMDkxOTc2ODIzODYiLCJpYXQiOjE1NDU2NTAxNjksImV4cCI6MTU0NTczNjU2OX0.32Vaz9Zo_g0wD1klKOTzb1VGMy9JusV3dZgTJTyLJ7I"
 * }
 * @apiParam {String} id user
 * @apiParam {Boolean} notification status for the user
 * @apiSuccessExample Success Response 
HTTP/1.1 200 OK
{
    "roles": [
        "user"
    ],
    "_id": "5c2161acdfa08f285c33c44c",
    "phoneNumber": "09388475257",
    "first_name": "Saeed",
    "last_name": "Padyab olsun",
    "city_code": 1,
    "__v": 0,
    "address": "no.41, Block 23, Bosphorous city, 221 Sokak, Kucukcekmace, Istanbul, Turkey",
    "location": {
        "lat": 34.65,
        "long": 54.56
    },
    "avatar": "/docs/img/uploads/avatar-1546717703454.jpeg",
    "notification": true,
    "language": "en",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMjE2MWFjZGZhMDhmMjg1YzMzYzQ0YyIsInJvbGVzIjpbInNob3BwZXIiXSwiaWF0IjoxNTQ2NzMzMTIxLCJleHAiOjE1NDY4MTk1MjF9.N_hieabS77RTSpUIn3wMVUw6rcW6d6D-Gn63KiTe__A",
    "name": "Saeed",
    "city": {
        "_id": "5c24cee9fb6fc00eee871c09",
        "cityCode": 1,
        "name": {
            "fa": "تهران",
            "en": "Tehran"
        }
    },
    "id": "5c2161acdfa08f285c33c44c"
}
 *
  * @apiErrorExample UnAuthorized
  HTTP/1.1 401 UnAuthorized access
 {
    "success": false,
    "error" : {
       //error details
    }
 }
* @apiErrorExample Servr Error
HTTP/1.1 500 Internal server error
 {
    "success": false,
    "error" : {
       //error details
    }
 }

 * @apiErrorExample User Not Found
 HTTP/1.1 404 User Not Found
 {
    "success": false,
    "error" : {
       "error" : "invalid id"
    }
 }
 */
router.put("/api/v1/changenotification", auth.verifyToken, usercontoller.changenotification);

/**
 * @api {delete} /user/api/v1/deleteaccount Delete Account
 * @apiName DeleteAccount
 * @apiGroup User
 *
 * @apiHeader {String} Authorization Users unique access-key
 * @apiHeaderExample {String} Authorization Example
 * { 
 *    "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMWQ2YzdiNzk3YThmMTQ4MjUxYzZiZSIsInBob25lTnVtYmVyIjoiMDkxOTc2ODIzODYiLCJpYXQiOjE1NDU2NTAxNjksImV4cCI6MTU0NTczNjU2OX0.32Vaz9Zo_g0wD1klKOTzb1VGMy9JusV3dZgTJTyLJ7I"
 * }
 * @apiParam {String} id user
 * @apiSuccessExample Success Response 
HTTP/1.1 200 OK
{
    "success": true,
    "message": "You successfully deleted your account. You will no longer have access to your account"
}
 *
  * @apiErrorExample UnAuthorized
  HTTP/1.1 401 UnAuthorized access
 {
    "success": false,
    "error" : {
       //error details
    }
 }
* @apiErrorExample Servr Error
HTTP/1.1 500 Internal server error
 {
    "success": false,
    "error" : {
       //error details
    }
 }

 * @apiErrorExample User Not Found
 HTTP/1.1 404 User Not Found
 {
    "success": false,
    "error" : {
       "error" : "invalid id"
    }
 }
 */
router.delete("/api/v1/deleteaccount", auth.verifyToken, usercontoller.deleteaccount);


/**
 * @api {put} /user/api/v1/locationchanged Location Changed
 * @apiName LocationChnaged
 * @apiGroup User
 *
 * @apiHeader {String} Authorization Users unique access-key
 * @apiHeaderExample {String} Authorization Example
 * { 
 *    "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMWQ2YzdiNzk3YThmMTQ4MjUxYzZiZSIsInBob25lTnVtYmVyIjoiMDkxOTc2ODIzODYiLCJpYXQiOjE1NDU2NTAxNjksImV4cCI6MTU0NTczNjU2OX0.32Vaz9Zo_g0wD1klKOTzb1VGMy9JusV3dZgTJTyLJ7I"
 * }
 * @apiParam {String} id user
 * @apiParam {Object} location user new location
 * @apiSuccessExample Success Response 
HTTP/1.1 200 OK
{
    "success": true,
    "message": "You location updated"
}
*
 * @apiErrorExample UnAuthorized
  HTTP/1.1 401 UnAuthorized access
 {
    "success": false,
    "error" : {
       //error details
    }
 }
* @apiErrorExample Servr Error
HTTP/1.1 500 Internal server error
 {
    "success": false,
    "error" : {
       //error details
    }
 }

 * @apiErrorExample User Not Found
 HTTP/1.1 404 User Not Found
 {
    "success": false,
    "error" : {
       "error" : "invalid id"
    }
 }
 */
router.put("/api/v1/locationchanged", auth.verifyToken, usercontoller.locationchanged);
module.exports = router;