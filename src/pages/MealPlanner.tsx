import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Grid, List, ListItem, ListItemText, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { IRecipe, IPantryItem } from '../interfaces';

function MealPlanner() {
  const [suggestions, setSuggestions] = useState<IRecipe[]>([]);
  const [pantryItems, setPantryItems] = useState<IPantryItem[]>([]);

  useEffect(() => {
    axios.get<IPantryItem[]>('http://localhost:3001/api/pantry')
      .then(response => {
        setPantryItems(response.data);
      })
      .catch(error => {
        console.error('Error fetching pantry items:', error);
      });
  }, []);

  const handleGetSuggestions = () => {
    axios.get<IRecipe[]>('http://localhost:3001/api/meal-planner/suggestions')
      .then(response => {
        setSuggestions(response.data);
      })
      .catch(error => {
        console.error('Error fetching meal suggestions:', error);
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Meal Planner
      </Typography>
      <Button onClick={handleGetSuggestions} variant="contained" color="primary" sx={{ mb: 2 }}>
        Get Suggestions
      </Button>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="h6">Suggestions</Typography>
          <List>
            {suggestions.map(suggestion => (
              <ListItem key={suggestion._id} component={Link} to={`/recipes/${suggestion._id}`}>
                <ListItemText primary={suggestion.title} />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Pantry Items</Typography>
            <List>
              {pantryItems.map(item => (
                <ListItem key={item._id}>
                  <ListItemText primary={item.name} secondary={`Quantity: ${item.quantity || ''} ${item.unit || ''}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default MealPlanner;