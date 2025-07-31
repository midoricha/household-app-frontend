import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import { IRecipe } from '../interfaces';

function RecipeDetails() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<IRecipe | null>(null);

  useEffect(() => {
    axios.get<IRecipe>(`http://localhost:3001/api/recipes/${id}`)
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
    <Container>
      <Typography variant="h3" gutterBottom>{recipe.title}</Typography>
      <Typography variant="h5" color="text.secondary" gutterBottom>{recipe.cuisine}</Typography>
      
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>Ingredients</Typography>
        <List>
          {recipe.ingredients.map((ingredient, index) => (
            <ListItem key={index}>
              <ListItemText primary={ingredient.name} secondary={`${ingredient.quantity || ''} ${ingredient.unit || ''}`} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box mt={4}>
        <Typography variant="h4" gutterBottom>Instructions</Typography>
        <List>
          {recipe.instructions.map((step, index) => (
            <React.Fragment key={index}>
              <ListItem>
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
