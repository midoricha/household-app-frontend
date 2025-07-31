import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import TodoList from './pages/TodoList';
import RecipeBook from './pages/RecipeBook';
import Pantry from './pages/Pantry';
import MealPlanner from './pages/MealPlanner';
import AddRecipe from './pages/AddRecipe';
import RecipeDetails from './pages/RecipeDetails';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<TodoList />} />
          <Route path="/recipes" element={<RecipeBook />} />
          <Route path="/recipes/new" element={<AddRecipe />} />
          <Route path="/recipes/:id" element={<RecipeDetails />} />
          <Route path="/pantry" element={<Pantry />} />
          <Route path="/meal-planner" element={<MealPlanner />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
