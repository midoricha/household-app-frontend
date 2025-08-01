import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import TodoList from "./pages/TodoList";
import RecipeBook from "./pages/RecipeBook";
import Pantry from "./pages/Pantry";
import MealPlanner from "./pages/MealPlanner";
import AddRecipe from "./pages/AddRecipe";
import RecipeDetails from "./pages/RecipeDetails";
import "@fontsource/inter";
import "@fontsource/dm-sans";
import "./styles/variables.css";
import "./styles/components.css";
import "./styles/layout.css";
import "./App.css";
import { createTheme } from "@mui/material";
import EditTodo from "./pages/EditTodo";

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/tasks" element={<TodoList />} />
                    <Route path="/recipes" element={<RecipeBook />} />
                    <Route path="/recipes/new" element={<AddRecipe />} />
                    <Route path="/recipes/:id" element={<RecipeDetails />} />
                    <Route path="/pantry" element={<Pantry />} />
                    <Route path="/meal-planner" element={<MealPlanner />} />
                    <Route path="/tasks/edit" element={<EditTodo />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
