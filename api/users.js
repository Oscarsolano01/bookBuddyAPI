const express = require("express");
const userRouter = express.Router();
const {
  getUserById,
  getUsers,
  createUser,
  getUser,
  getUserByEmail,
} = require("../db/users");

const jwt = require("jsonwebtoken");

userRouter.get("/", async (req, res) => {
  try {
    const results = await getUsers();
    res.send(results);
  } catch (err) {
    res.send({ err, message: "something went wrong" });
  }
});

// {baseUrl}/users/id
userRouter.get("/:id", async (req, res) => {

  try {
    const { id } = req.params;
    const result = await getUserById(id);
    res.send(result);
  } catch (err) {
    res.send({ err, message: "something went wrong" });
  }
});

// {baseUrl}/users/me
userRouter.get("/me", (req, res) => {
  res.send("here is your account info");
});

userRouter.post("/register", async (req, res, next) => {
  console.log(req.body);
  const { firstname, lastname, email, password } = req.body;
  if (!email) {
    next({ name: "emailrequirederror", message: "email not provided" });
    return;
  }
  if (!password) {
    next({ name: " passwordRequiredError", message: "password not provided" });
    return;
  }

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      next({
        name: "ExistingUserError",
        message: "user already registerd with that email",
      });
      return;
    }
    const result = await createUser(req.body);

    if (result) {
      const token = jwt.sign({ id: result.id, email }, process.env.JWT_SECRET, {
        expiresIn: "1w",
      });
      console.log(token);
      res.send({
        message: "registration successfull",
        token,
        user: {
          id: result.id,
          firstname: result.firstname,
          lastname: result.lastname,
          email: result.email,
        },
      });
      return;
    } else {
      next({
        name: " RegistrationError",
        message: " error registering, try later",
      });
      return;
    }
    res.send("success");
  } catch (err) {
    next(err);
  }
});

userRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next({
      name: " missing credentials error",
      message: " please supply both an email and password",
    });
  }
  try {
    const result = await getUser(req.body);
    if (result) {
      const token = jwt.sign({ id: result.id, email }, process.env.JWT_SECRET, {
        expiresIn: "1w",
      });
      res.send({ message: "login successfull", token });
    } else {
      next({
        name: "incorrect credentials",
        message: "username or password is incorrect",
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = userRouter;
