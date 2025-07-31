import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { IRecipe } from '../interfaces';
import RecipeCard from '../components/RecipeCard';

function RecipeBook() {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);

  useEffect(() => {
    axios.get<IRecipe[]>('http://localhost:3001/api/recipes')
      .then(response => {
        setRecipes(response.data);
      })
      .catch(error => {
        console.error('Error fetching recipes:', error);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Recipe Book
      </Typography>
      <Button component={Link} to="/recipes/new" variant="contained" color="primary" sx={{ mb: 2 }}>
        Add Recipe
      </Button>
      <Grid container spacing={3}>
        {recipes.map(recipe => (
          <Grid item xs={12} sm={6} md={4} key={recipe._id}>
            <RecipeCard recipe={recipe} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default RecipeBook;