const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully')
  })
  .catch((error) => {
    console.log('MongoDB connection error:', error)
  })

// Task Schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
})

// Task Model
const Task = mongoose.model('Task', taskSchema)

// Test route
app.get('/', (req, res) => {
  res.send('Todo API is running')
})

// GET - Fetch all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find()
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' })
  }
})

// POST - Add a new task
app.post('/api/tasks', async (req, res) => {
  try {
    const newTask = new Task({
      title: req.body.title
    })

    const savedTask = await newTask.save()

    res.status(201).json(savedTask)
  } catch (error) {
    res.status(500).json({ message: 'Error adding task' })
  }
})

// Start server
const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

// PUT - Update a task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        completed: req.body.completed
      },
      { new: true }
    )

    res.json(updatedTask)
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' })
  }
})

// DELETE - Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id)

    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' })
  }
})