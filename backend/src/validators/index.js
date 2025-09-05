import { body } from "express-validator";

const userRegisterValidator = () => {
   return [
      body("email")
         .trim()
         .notEmpty()
         .withMessage("Email is required")
         .isEmail()
         .withMessage("Email is invalid"),
      body("username")
         .trim()
         .notEmpty()
         .withMessage("Username is required")
         .isLowercase()
         .withMessage("Username must be in lower case")
         .isLength({ min: 3 })
         .withMessage("Username must be at least 3 characters long"),
      body("password")
         .trim()
         .notEmpty()
         .withMessage("Password is required")
         .isLength({ min: 6 })
         .withMessage("Password must be at least 6 characters")
         .isStrongPassword({
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            returnScore: false,
         })
         .withMessage("Password must include uppercase, lowercase, number, and special character"),,
      body("fullname").trim().notEmpty().withMessage("Name is required")
   ];
};

export { userRegisterValidator };
