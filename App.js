import './App.css';
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'Low' });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('todoList'));
    if (savedTasks) setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('todoList', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddOrUpdateTask = () => {
    if (!newTask.title) return;
    if (editingIndex !== null) {
      const updated = [...tasks];
      updated[editingIndex] = newTask;
      setTasks(updated);
      setEditingIndex(null);
    } else {
      setTasks([...tasks, { ...newTask, completed: false }]);
    }
    setNewTask({ title: '', description: '', dueDate: '', priority: 'Low' });
  };

  const handleDelete = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  const handleEdit = (index) => {
    setNewTask(tasks[index]);
    setEditingIndex(index);
  };

  const toggleComplete = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  return (
    <div className="container">
      <h1>📝 To-Do List</h1>
      <input
        placeholder="Title"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
      />
      <br />
      <textarea
        placeholder="Description"
        value={newTask.description}
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
      />
      <br />
      <input
        type="date"
        value={newTask.dueDate}
        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
      />
      <br />
      <select
        value={newTask.priority}
        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <br /><br />
      <button onClick={handleAddOrUpdateTask}>
        {editingIndex !== null ? 'Update Task' : 'Add Task'}
      </button>

      <ul>
        {tasks.map((task, index) => (
          <li key={index} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <h3 style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</h3>
            {task.description && <p>{task.description}</p>}
            <p>Due: {task.dueDate ? format(new Date(task.dueDate), 'dd MMM yyyy') : 'No due date'}</p>
            <p>Priority: {task.priority}</p>
            <p>Status: {task.completed ? '✅ Completed' : '⏳ Active'}</p>
            <button onClick={() => toggleComplete(index)}>
              {task.completed ? 'Mark as Active' : 'Mark as Completed'}
            </button>
            <button onClick={() => handleEdit(index)}>Edit</button>
            <button onClick={() => handleDelete(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
