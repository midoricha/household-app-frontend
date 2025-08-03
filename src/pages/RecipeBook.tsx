/// <reference types="vite/client" />
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { IRecipe } from '../interfaces';
import RecipeCard from '../components/RecipeCard';

function RecipeBook() {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
  useEffect(() => {
    axios.get<IRecipe[]>(`${API_BASE_URL}/recipes`)
      .then(response => {
        setRecipes(response.data);
      })
      .catch(error => {
        console.error('Error fetching recipes:', error);
      });
  }, []);

  return (
    <Container sx={{ pt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Recipe Book
      </Typography>
      <Button component={Link} to="/recipes/new" variant="contained" color="primary" size="large" sx={{ mb: 3, borderRadius: 8, fontWeight: 600, fontSize: "1.05rem", px: 3, py: 1.2, letterSpacing: 0.2 }}>
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