import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Checkbox, IconButton, TextField, Button, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ITask } from '../interfaces';

function TodoList() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [newTask, setNewTask] = useState({ title: '', dueDate: '', recurring: '' });

  useEffect(() => {
    axios.get<ITask[]>('http://localhost:3001/api/tasks')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name as string]: value });
  };

  const handleAddTask = () => {
    axios.post<ITask>('http://localhost:3001/api/tasks', newTask)
      .then(response => {
        setTasks([...tasks, response.data]);
        setNewTask({ title: '', dueDate: '', recurring: '' });
      })
      .catch(error => {
        console.error('Error adding task:', error);
      });
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    axios.put<ITask>(`http://localhost:3001/api/tasks/${id}`, { completed: !completed })
      .then(response => {
        setTasks(tasks.map(task => (task._id === id ? response.data : task)));
      })
      .catch(error => {
        console.error('Error updating task:', error);
      });
  };

  const handleDeleteTask = (id: string) => {
    axios.delete(`http://localhost:3001/api/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task._id !== id));
      })
      .catch(error => {
        console.error('Error deleting task:', error);
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        To-Do List
      </Typography>
      <TextField
        label="New Task"
        name="title"
        value={newTask.title}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Due Date"
        name="dueDate"
        type="date"
        value={newTask.dueDate}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Recurring</InputLabel>
        <Select
          name="recurring"
          value={newTask.recurring}
          onChange={handleInputChange}
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
        </Select>
      </FormControl>
      <Button onClick={handleAddTask} variant="contained" color="primary">
        Add Task
      </Button>
      <List>
        {tasks.map(task => (
          <ListItem
            key={task._id}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTask(task._id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <Checkbox
              checked={task.completed}
              onChange={() => handleToggleComplete(task._id, task.completed)}
            />
            <ListItemText 
              primary={task.title} 
              secondary={`Due: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'} - Recurring: ${task.recurring || 'None'}`}
              style={{ textDecoration: task.completed ? 'line-through' : 'none' }} 
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default TodoList;