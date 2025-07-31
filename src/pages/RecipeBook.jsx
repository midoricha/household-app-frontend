import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, IconButton, TextField, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function RecipeBook() {
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({ title: '', ingredients: '', instructions: '', cuisine: '' });

  useEffect(() => {
    axios.get('http://localhost:3001/api/recipes')
      .then(response => {
        setRecipes(response.data);
      })
      .catch(error => {
        console.error('Error fetching recipes:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe({ ...newRecipe, [name]: value });
  };

  const handleAddRecipe = () => {
    const ingredientsArray = newRecipe.ingredients.split(',').map(item => item.trim());
    const recipeToPost = { ...newRecipe, ingredients: ingredientsArray };

    axios.post('http://localhost:3001/api/recipes', recipeToPost)
      .then(response => {
        setRecipes([...recipes, response.data]);
        setNewRecipe({ title: '', ingredients: '', instructions: '', cuisine: '' });
      })
      .catch(error => {
        console.error('Error adding recipe:', error);
      });
  };

  const handleDeleteRecipe = (id) => {
    axios.delete(`http://localhost:3001/api/recipes/${id}`)
      .then(() => {
        setRecipes(recipes.filter(recipe => recipe._id !== id));
      })
      .catch(error => {
        console.error('Error deleting recipe:', error);
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Recipe Book
      </Typography>
      <TextField
        label="Title"
        name="title"
        value={newRecipe.title}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Ingredients (comma-separated)"
        name="ingredients"
        value={newRecipe.ingredients}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Instructions"
        name="instructions"
        value={newRecipe.instructions}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Cuisine"
        name="cuisine"
        value={newRecipe.cuisine}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <Button onClick={handleAddRecipe} variant="contained" color="primary">
        Add Recipe
      </Button>
      <List>
        {recipes.map(recipe => (
          <ListItem
            key={recipe._id}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteRecipe(recipe._id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText 
              primary={recipe.title} 
              secondary={`Cuisine: ${recipe.cuisine || 'None'} | Ingredients: ${recipe.ingredients.join(', ')}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default RecipeBook;