const yup = require("yup");
const User = require("../model/user.model");
const errorResponse = require("../errorHandler/errorResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const VALIDATE_MESSAGE = require("../constant/validate.messages");

const userYupSchema = yup.object().shape({
  userName: yup.string().min(6).max(16).required(),
  password: yup.string().min(6).max(16).required(),
});

const userController = {
  login: async (req, res, next) => {
    // Validate userName and password
    try {
      const validatedUser = await userYupSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      console.log(bcrypt);
      //hashed password
      const hashedPassword = await bcrypt.hash(req.body.password, 13);

      User.findOne({ userName: validatedUser.userName })
        .then(user => {
          //Check if req.body.password equals to user password
          const checkPassword = bcrypt.compare(hashedPassword, user.password);

          if (!checkPassword) {
            errorResponse(res, VALIDATE_MESSAGE.PASSWORD_INCORRECT, 401);
          } else {
            const token = jwt.sign({ id: user._id.toString() }, process.env.ACCESS_TOKEN_SECRET);
            user.token = token;
            //Save token
            user.save().then(user => {
              user = user.toObject();
              delete user.password;
              res.send(user);
            });
          }
        })
        //If user does'nt exist
        .catch(err => errorResponse(res, VALIDATE_MESSAGE.USER_NOT_FOUND, 401));
    } catch (error) {
      //If validate failed
      errorResponse(res, error.message, 401);
    }
  },
};

module.exports = userController;
