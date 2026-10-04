import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = 'http://localhost:5000/api/tasks'

function App() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])

  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  // Fetch tasks from MongoDB
  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    try {
      const response = await axios.get(API_URL)
      setTasks(response.data)
    } catch (error) {
      console.log('Error fetching tasks:', error)
    }
  }

  // Add a new task
  async function addTask() {
    if (task.trim() === '') {
      return
    }

    try {
      const response = await axios.post(API_URL, {
        title: task
      })

      setTasks([...tasks, response.data])
      setTask('')
    } catch (error) {
      console.log('Error adding task:', error)
    }
  }

  // Mark task as completed or incomplete
  async function toggleTask(id, currentTitle, currentStatus) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, {
        title: currentTitle,
        completed: !currentStatus
      })

      const updatedTasks = tasks.map((item) => {
        if (item._id === id) {
          return response.data
        }

        return item
      })

      setTasks(updatedTasks)
    } catch (error) {
      console.log('Error updating task:', error)
    }
  }

  // Delete a task
  async function deleteTask(id) {
    try {
      await axios.delete(`${API_URL}/${id}`)

      const updatedTasks = tasks.filter((item) => item._id !== id)

      setTasks(updatedTasks)
    } catch (error) {
      console.log('Error deleting task:', error)
    }
  }

  // Start editing a task
  function startEdit(item) {
    setEditingId(item._id)
    setEditText(item.title)
  }

  // Save edited task
  async function saveEdit(id, completed) {
    if (editText.trim() === '') {
      return
    }

    try {
      const response = await axios.put(`${API_URL}/${id}`, {
        title: editText,
        completed: completed
      })

      const updatedTasks = tasks.map((item) => {
        if (item._id === id) {
          return response.data
        }

        return item
      })

      setTasks(updatedTasks)
      setEditingId(null)
      setEditText('')
    } catch (error) {
      console.log('Error editing task:', error)
    }
  }

  return (
    <div className="app">
      <div className="todo-container">

        <h1>Todo App</h1>

        <p className="subtitle">
          Manage your daily tasks
        </p>

        {/* Add Task */}
        <div className="todo-form">

          <input
            type="text"
            placeholder="Enter a new task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />

          <button onClick={addTask}>
            Add Task
          </button>

        </div>

        {/* Task List */}
        <div className="todo-list">

          {tasks.length === 0 ? (

            <p className="empty-message">
              No tasks yet. Add your first task!
            </p>

          ) : (

            tasks.map((item) => (

              <div className="todo-item" key={item._id}>

                <div className="task-content">

                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() =>
                      toggleTask(
                        item._id,
                        item.title,
                        item.completed
                      )
                    }
                  />

                  {editingId === item._id ? (

                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />

                  ) : (

                    <span
                      className={item.completed ? 'completed' : ''}
                    >
                      {item.title}
                    </span>

                  )}

                </div>

                <div className="task-buttons">

                  {editingId === item._id ? (

                    <button
                      className="save-button"
                      onClick={() =>
                        saveEdit(item._id, item.completed)
                      }
                    >
                      Save
                    </button>

                  ) : (

                    <button
                      className="edit-button"
                      onClick={() => startEdit(item)}
                    >
                      Edit
                    </button>

                  )}

                  <button
                    className="delete-button"
                    onClick={() => deleteTask(item._id)}
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </div>
    </div>
  )
}

export default App