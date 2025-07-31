import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, IconButton, TextField, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function Pantry() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '' });

  useEffect(() => {
    axios.get('http://localhost:3001/api/pantry')
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.error('Error fetching pantry items:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleAddItem = () => {
    axios.post('http://localhost:3001/api/pantry', newItem)
      .then(response => {
        setItems([...items, response.data]);
        setNewItem({ name: '', quantity: '', unit: '' });
      })
      .catch(error => {
        console.error('Error adding pantry item:', error);
      });
  };

  const handleDeleteItem = (id) => {
    axios.delete(`http://localhost:3001/api/pantry/${id}`)
      .then(() => {
        setItems(items.filter(item => item._id !== id));
      })
      .catch(error => {
        console.error('Error deleting pantry item:', error);
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Pantry
      </Typography>
      <TextField
        label="Item Name"
        name="name"
        value={newItem.name}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Quantity"
        name="quantity"
        type="number"
        value={newItem.quantity}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Unit"
        name="unit"
        value={newItem.unit}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <Button onClick={handleAddItem} variant="contained" color="primary">
        Add Item
      </Button>
      <List>
        {items.map(item => (
          <ListItem
            key={item._id}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteItem(item._id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={item.name} secondary={`Quantity: ${item.quantity} ${item.unit || ''}`} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default Pantry;