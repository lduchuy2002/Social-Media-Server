const yup = require("yup");
const User = require("../model/user.model");
const errorResponse = require("../errorHandler/errorResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jsonifyError = require("jsonify-error");




const VALIDATE_MESSAGE = require("../constant/validate.messages");

const yupForAccount = yup
  .string()
  .matches(/^[a-zA-Z0-9]{6,18}$/g, "Invalid account format")
  .min(6)
  .max(16)
  .required();

const yupForName = yup.string().min(4).max(24).required();
const yupForEmail = yup.string().email("Invalid email format").required();
const yupForPassword = yup
  .string()
  .matches(/^[a-zA-Z0-9!@#$%^&*]{6,18}$/g, "Invalid password format")
  .min(6)
  .max(16)
  .required();

const userController = {
  login: async (req, res, next) => {
    // Validate account and password
    try {
      const validatedAccount = await yupForAccount.validate(req.body.account);
      const password = await yupForPassword.validate(req.body.password);
      //hashed password
      await User.findOne({ account: validatedAccount })
        .then(async user => {
          //Check if req.body.password equals to user password
      
          const isEqualPassword = await bcrypt.compare(password , user.password);
          if (!isEqualPassword) {
            return errorResponse(res, VALIDATE_MESSAGE.PASSWORD_INCORRECT, 401);
          } else {
            //Save token
            const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET);
            user.token.push(token);
            user
              .save()
              .then(user => {
                user = user.toObject();
                delete user.password;
                return res.send(user);
              })
              .catch(() => errorResponse(res, "BAD REQUEST", 404));
          }
        })
        //If user does'nt exist
        .catch(() => errorResponse(res, VALIDATE_MESSAGE.USER_NOT_FOUND, 401));
    } catch (error) {
      //If validate failed
      return res.status(400).send(error);
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
      const hashedPassword = await bcrypt.hash(password, Number(13));
      const user = new User({
        account,
        name,
        email,
        password: hashedPassword,
        avatar: req.file.path,
      });
      user
        .save()
        .then(() => res.status(201).send({ message: "Register successfully!" }))
        .catch(error => res.status(400).send(error));
    } catch (error) {
      return errorResponse(res, jsonifyError(error), 404);
    }
  },
  about: async (req, res, next) => {
    const user = await User.findOne({ account: req.params.account });
    if (user === null) {
      return errorResponse(res, "User not found!", 400);
    }
    if (user._id === req.encoded._id) {
      user = user.toObject();
      delete user.password;
      return res.json(user);
    }
    return res.status(403).send({ message: "Access denied!" });
  },
  logout: async (req,res,next)=>{
    req.user.token = req.user.token.filter(token => token !== req.token);
    await req.user.save()
    .then(()=>res.send({message: "Logout successfully!"}))
    .catch(()=>res.status(500).send({message: "Server error!"}))
  }
};

module.exports = userController;
