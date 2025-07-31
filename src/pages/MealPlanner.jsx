import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Button } from '@mui/material';

function MealPlanner() {
  const [suggestions, setSuggestions] = useState([]);

  const handleGetSuggestions = () => {
    axios.get('http://localhost:3001/api/meal-planner/suggestions')
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
      <Button onClick={handleGetSuggestions} variant="contained" color="primary">
        Get Suggestions
      </Button>
      <List>
        {suggestions.map(suggestion => (
          <ListItem key={suggestion._id}>
            <ListItemText primary={suggestion.title} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default MealPlanner;