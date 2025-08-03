/// <reference types="vite/client" />
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import { IRecipe } from '../interfaces';

function RecipeDetails() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<IRecipe | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
  useEffect(() => {
    axios.get<IRecipe>(`${API_BASE_URL}/recipes/${id}`)
      .then(response => {
        setRecipe(response.data);
      })
      .catch(error => {
        console.error('Error fetching recipe details:', error);
      });
  }, [id]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <Container sx={{ pt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        {recipe.title}
      </Typography>
      <Typography variant="h5" color="text.secondary" gutterBottom sx={{ fontStyle: 'italic', mb: 2 }}>
        {recipe.cuisine}
      </Typography>

      <Box mt={4}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Ingredients
        </Typography>
        <List>
          {recipe.ingredients.map((ingredient, index) => (
            <ListItem key={index} sx={{ borderRadius: 2, mb: 1, boxShadow: "0 1px 4px 0 rgba(60,80,60,0.04)", transition: "background 0.2s", '&:hover': { backgroundColor: 'primary.light' } }}>
              <ListItemText primary={ingredient.name} secondary={`${ingredient.quantity || ''} ${ingredient.unit || ''}`} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box mt={4}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Instructions
        </Typography>
        <List>
          {recipe.instructions.map((step, index) => (
            <React.Fragment key={index}>
              <ListItem sx={{ borderRadius: 2, mb: 1 }}>
                <ListItemText primary={`Step ${index + 1}`} secondary={step} />
              </ListItem>
              {index < recipe.instructions.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Container>
  );
}

export default RecipeDetails;
