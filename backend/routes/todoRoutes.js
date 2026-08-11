
const express = require("express");
const auth = require("../middleware/authMiddleware");
const Todo = require("../models/Todo");

const router = express.Router();

// Protect all todo routes
router.use(auth);

// GET /api/todos - get all todos of logged-in user
router.get("/", async (req, res) => {
  const todos = await Todo.find({ user: req.user._id }).sort("-createdAt");
  res.json(todos);
});

// POST /api/todos - create a todo
router.post("/", async (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  const todo = await Todo.create({
    user: req.user._id,
    title: title.trim(),
  });

  res.status(201).json(todo);
});

// PATCH /api/todos/:id - UPDATE title
router.patch("/:id", async (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { title: title.trim() },
    { new: true }
  );

  if (!todo) return res.status(404).json({ message: "Todo not found" });

  res.json(todo);
});

// PATCH /api/todos/:id/toggle
router.patch("/:id/toggle", async (req, res) => {
  const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });

  if (!todo) return res.status(404).json({ message: "Todo not found" });

  todo.completed = !todo.completed;
  await todo.save();

  res.json(todo);
});

// DELETE /api/todos/:id
router.delete("/:id", async (req, res) => {
  const todo = await Todo.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!todo) return res.status(404).json({ message: "Todo not found" });

  res.json({ message: "Todo deleted" });
});

router.get("/", async (req, res) => {
  const todos = await Todo.find({ user: req.user._id }).sort("-createdAt");

  console.log("Todos from MongoDB:", todos);

  res.json(todos);
});

module.exports = router;
