import React from 'react';
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { IRecipe } from '../interfaces';

interface RecipeCardProps {
  recipe: IRecipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {recipe.title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {recipe.cuisine}
        </Typography>
        <Typography variant="body2">
          {recipe.instructions.join(' ').substring(0, 100)}...
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={`/recipes/${recipe._id}`}>
          View Recipe
        </Button>
      </CardActions>
    </Card>
  );
};

export default RecipeCard;
