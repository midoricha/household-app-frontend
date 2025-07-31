import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Household App
        </Typography>
        <Button color="inherit" component={Link} to="/">
          To-Do List
        </Button>
        <Button color="inherit" component={Link} to="/recipes">
          Recipe Book
        </Button>
        <Button color="inherit" component={Link} to="/pantry">
          Pantry
        </Button>
        <Button color="inherit" component={Link} to="/meal-planner">
          Meal Planner
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
