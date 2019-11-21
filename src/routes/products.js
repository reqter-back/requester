var express = require("express");
var router = express.Router();
var auth = require("../controllers/auth");
var productController = require("../controllers/productsController");
/**
 * @api {get} /products/api/v1/categories Get categories
 * @apiName GetCategories
 * @apiGroup Categories
 *
 *
 * @apiSuccessExample Success Response 
HTTP/1.1 200 OK
{
[
    {
        "_id": "5c24cee9fb6fc00eee871c09",
        "cityCode": "1",
        "name": {
            "fa": "تهران",
            "en": "Tehran"
        }
    },
    {
        "_id": "5c24cf3dfb6fc00eee871d07",
        "cityCode": "2",
        "name": {
            "fa": "اصفهان",
            "en": "Isfahan"
        }
    }
]
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
router.get("/all", auth.verifyToken, productController.getproductslist);
router.post("/add", auth.verifyToken, productController.add);
router.delete("/remove", auth.verifyToken, productController.remove);
router.put("/edit", auth.verifyToken, productController.update);
module.exports = router;
