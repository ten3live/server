// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Set up the Express app
const app = express();
app.use(bodyParser.json());

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost:27017/todos', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the Todo schema
const TodoSchema = new mongoose.Schema({
  title: {type: String, required: true},
  completed: {type: Boolean, default: false},
});
const TodoModel = mongoose.model('Todo', TodoSchema);

// Define the routes
app.get('/api/todos', async (req, res) => {
  const todos = await TodoModel.find();
  res.json(todos);
});

app.post('/api/todos', async (req, res) => {
  const {title, completed} = req.body;
  const todo = new TodoModel({title, completed});
  await todo.save();
  res.json(todo);
});

app.put('/api/todos/:id', async (req, res) => {
  const {title, completed} = req.body;
  const {id} = req.params;
  const todo = await TodoModel.findByIdAndUpdate(
    id,
    {title, completed},
    {new: true},
  );
  res.json(todo);
});

app.delete('/api/todos/:id', async (req, res) => {
  const {id} = req.params;
  await TodoModel.findByIdAndDelete(id);
  res.json({message: 'Todo deleted successfully'});
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
