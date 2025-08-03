/// <reference types="vite/client" />
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, List, ListItem, ListItemText, Paper } from '@mui/material';
import { Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { IRecipe, IPantryItem } from '../interfaces';

function MealPlanner() {
  const [suggestions, setSuggestions] = useState<IRecipe[]>([]);
  const [pantryItems, setPantryItems] = useState<IPantryItem[]>([]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
  useEffect(() => {
    axios.get<IPantryItem[]>(`${API_BASE_URL}/pantry`)
      .then(response => {
        setPantryItems(response.data);
      })
      .catch(error => {
        console.error('Error fetching pantry items:', error);
      });
  }, []);

  const handleGetSuggestions = () => {
    axios.get<IRecipe[]>(`${API_BASE_URL}/meal-planner/suggestions`)
      .then(response => {
        setSuggestions(response.data);
      })
      .catch(error => {
        console.error('Error fetching meal suggestions:', error);
      });
  };

  return (
    <Container sx={{ pt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Meal Planner
      </Typography>
      <Button onClick={handleGetSuggestions} variant="contained" color="primary" size="large" sx={{ mb: 2, borderRadius: 8, fontWeight: 600, fontSize: "1.05rem", px: 3, py: 1.2, letterSpacing: 0.2 }}>
        Get Suggestions
      </Button>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" component="h2" gutterBottom>Suggestions</Typography>
          <List>
            {suggestions.map(suggestion => (
              <ListItem key={suggestion._id} component={Link} to={`/recipes/${suggestion._id}`} sx={{ borderRadius: 2, mb: 1, boxShadow: "0 1px 4px 0 rgba(60,80,60,0.04)", transition: "background 0.2s", '&:hover': { backgroundColor: 'primary.light' } }}>
                <ListItemText primary={suggestion.title} />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 4 }}>
            <Typography variant="h6" component="h2" gutterBottom>Pantry Items</Typography>
            <List>
              {pantryItems.map(item => (
                <ListItem key={item._id} sx={{ borderRadius: 2, mb: 1 }}>
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