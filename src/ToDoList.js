import React, { useState, useEffect } from 'react';
import './ToDoList.css';

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (taskInput.trim() === '') return alert('Task cannot be empty');
    const newTask = {
      id: Date.now(),
      text: taskInput,
      completed: false,
      date: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
    setTaskInput('');
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const filtered = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'name') return a.text.localeCompare(b.text);
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div className="todo-container">
      <h2>To-Do List</h2>
      <div className="input-section">
        <input
          type="text"
          value={taskInput}
          onChange={e => setTaskInput(e.target.value)}
          placeholder="Enter a task..."
        />
        <button onClick={handleAddTask}>Add</button>
      </div>

      <div className="controls">
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      <ul className="task-list">
        {sorted.map(task => (
          <li
            key={task.id}
            className={`task-item ${task.completed ? 'completed' : ''}`}
          >
            <span onClick={() => toggleComplete(task.id)}>{task.text}</span>
            <button onClick={() => handleDelete(task.id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;
