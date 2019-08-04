const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.getcategorieslist = [
    body('id', "Id must not be empty"),
    //Sanitize fields
    sanitizeBody('id').trim().escape(),
    (req, res, next)=>{
        var errors = validationResult(req);
        if (!errors.isEmpty())
        {  
            //There are errors. send error result
            res.status(400).json({"success" : false, "error" : errors});
            return;
        }
        else{

        }
    }
]

exports.getproductslist = [
    body('id', "Id must not be empty"),
    //Sanitize fields
    sanitizeBody('id').trim().escape(),
    (req, res, next)=>{
        var errors = validationResult(req);
        if (!errors.isEmpty())
        {  
            //There are errors. send error result
            res.status(400).json({"success" : false, "error" : errors});
            return;
        }
        else{
            
        }
    }
]

exports.getproductdetail = [
    body('id', "Id must not be empty"),
    //Sanitize fields
    sanitizeBody('id').trim().escape(),
    (req, res, next)=>{
        var errors = validationResult(req);
        if (!errors.isEmpty())
        {  
            //There are errors. send error result
            res.status(400).json({"success" : false, "error" : errors});
            return;
        }
        else{
            
        }
    }
]