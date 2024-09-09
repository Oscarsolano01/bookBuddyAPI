const express = require("express");
const {
  getBooks,
  getBook,
  createBook,
  deleteBook,
  updateBook,
} = require("../db");

const { createReservation } = require("../db/reservations");
const { requireUser } = require("./utils");

//create a router object for the /books routes

const bookRouter = express.Router();

bookRouter.get("/", async (req, res, next) => {
  try {
    const results = await getBooks();
    res.send(results);
  } catch (err) {
    next(err);
  }
});

bookRouter.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    console.log(id);
    if (isNaN(id) || req.params.id === " ") {
      next({
        name: "invalid ID Format",
        message: " The Provided Request parameter is not a valid id",
      });
      return;
    }

    const result = await getBook(id);
    if (!result) {
      next({ name: "not found", message: "No matching book found" });
      return;
    }
    res.send(result);
  } catch (err) {
    next(err);
  }
});

bookRouter.post("/", requireUser, async (req, res) => {
  try {
    const result = await createBook(req.body);
    console.log(result);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

bookRouter.delete("/:id", requireUser, async (req, res) => {
  try {
    const result = await deleteBook(req.params.id);
    res.send({ message: "book deleted successfully", id: result });
  } catch (err) {
    res.send(err);
  }
});

bookRouter.patch("/:id", requireUser, async (req, res, next) => {
  console.log("user", req.user);
  try {
    const id = Number(req.params.id);

    console.log(id);
    if (isNaN(id) || req.params.id === " ") {
      next({
        name: "invalid ID Format",
        message: " The Provided Request parameter is not a valid id",
      });
      return;
    }
    const result = await getBook(id);
    if (!result) {
      next({ name: "not found", message: " no matching book found" });
      return;
    } else {
      const updated = await updateBook(req.params.id, req.body.available);
      if (updated) {
        await createReservation({ userId: req.user.id, booksId: updated.id });
        res.send({
          message: " updated successfully",
          updated,
        });
      } else {
        next({
          name: "UpdateError",
          message: "There was an error updating this book.",
        });
        return;
      }
    }
  } catch (err) {
    next(err);
  }
});

module.exports = bookRouter;
