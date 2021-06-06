const yup = require("yup");
const User = require("../model/user.model");
const errorResponse = require("../errorHandler/errorResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const VALIDATE_MESSAGE = require("../constant/validate.messages");

const yupForAccount = yup
  .string()
  .matches(/^[a-zA-Z0-9]{6,18}$/g, "Invalid account format")
  .min(6)
  .max(16)
  .required();

const yupForName = yup.string().min(6).max(24).required();
const yupForEmail = yup.string().email("Invalid email format").required();
const yupForPassword = yup
  .string()
  .matches(/^[a-zA-Z0-9!@#$%^&*]{6,18}$/g, "Invalid password format")
  .min(6)
  .max(16)
  .required();

const userController = {
  login: async (req, res, next) => {
    // Validate userName and password
    try {
      const validatedAccount = await yupForAccount.validate(req.body.account);

      //hashed password
      const hashedPassword = await bcrypt.hash(req.body.password, 13);

      User.findOne({ account: validatedAccount.account })
        .then(user => {
          //Check if req.body.password equals to user password
          const checkPassword = bcrypt.compare(hashedPassword, user.password);

          if (!checkPassword) {
            errorResponse(res, VALIDATE_MESSAGE.PASSWORD_INCORRECT, 401);
          } else {
            const token = jwt.sign({ id: user._id.toString() }, process.env.ACCESS_TOKEN_SECRET);
            user.token = token;
            //Save token
            user
              .save()
              .then(user => {
                user = user.toObject();
                delete user.password;
                res.send(user);
              })
              .catch(() => errorResponse(res, "BAD REQUEST", 404));
          }
        })
        //If user does'nt exist
        .catch(err => errorResponse(res, VALIDATE_MESSAGE.USER_NOT_FOUND, 401));
    } catch (error) {
      //If validate failed
      errorResponse(res, error.message, 401);
    }
  },
  register: async (req, res, next) => {
    const { account, name, email, password } = req.body;
    if (!req.file) {
      return errorResponse(res, VALIDATE_MESSAGE.MISSING_AVATAR, 401);
    }
    //if user is aleady exist in the database
    const existUser = await User.findOne({ account: account });
    if (existUser !== null) {
      return errorResponse(res, VALIDATE_MESSAGE.USER_ALREADY_EXIST, 401);
    }
    try {
      await yupForAccount.validate(account);
      await yupForName.validate(name);
      await yupForEmail.validate(email);
      await yupForPassword.validate(password);
      const hashedPassword = await bcrypt.hash(password, 13);
      const user = new User({
        account,
        name,
        email,
        password: hashedPassword,
        avatar: req.file.path,
      });
      user
        .save()
        .then(() => res.send({ message: "Register success!" }))
        .catch(res.send);
    } catch (error) {
      return errorResponse(res, error.message, 404);
    }
  },
};

module.exports = userController;
