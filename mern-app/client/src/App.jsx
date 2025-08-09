import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function loadTodos() {
    try {
      setLoading(true)
      const res = await fetch('/api/todos')
      const data = await res.json()
      setTodos(data)
    } catch (e) {
      setError('Failed to load todos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTodos()
  }, [])

  async function addTodo(e) {
    e.preventDefault()
    if (!newTitle.trim()) return
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle.trim() })
    })
    if (!res.ok) return
    const created = await res.json()
    setTodos([created, ...todos])
    setNewTitle('')
  }

  async function toggleTodo(id, completed) {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    })
    if (!res.ok) return
    const updated = await res.json()
    setTodos(todos.map(t => t._id === id ? updated : t))
  }

  async function deleteTodo(id) {
    const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' })
    if (!res.ok) return
    setTodos(todos.filter(t => t._id !== id))
  }

  return (
    <div className="container">
      <h1>Todos</h1>

      <form onSubmit={addTodo} className="new-todo-form">
        <input
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo._id} className={todo.completed ? 'completed' : ''}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={e => toggleTodo(todo._id, e.target.checked)}
              />
              <span>{todo.title}</span>
            </label>
            <button onClick={() => deleteTodo(todo._id)} className="danger">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
