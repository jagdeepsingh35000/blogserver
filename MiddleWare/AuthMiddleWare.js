
const {body}= require("express-validator");

let AuthMiddleWare = [

    body("name")
    .notEmpty().withMessage(" name should not be empty")
    .isLength({min:3,max:12})
    .withMessage("name charcter should be between 3 to 12"),

    body("email")
    .notEmpty().withMessage(" email should not be empty")
    .isEmail()
    .withMessage("check email format"),

    body("password")
    .notEmpty().withMessage(" password should not be empty")
    .isStrongPassword()
    .withMessage("password is not strong"),
]

let BlogAuthMiddleWare = [
    body("title")
    .notEmpty().withMessage(" title should not be empty"),   

    body("content")
    .notEmpty().withMessage(" content should not be empty"),

    body("image")
    .notEmpty().withMessage(" image should not be empty")

]
module.exports = {AuthMiddleWare,BlogAuthMiddleWare}