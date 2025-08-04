/// <reference types="vite/client" />
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Container,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button,
    Snackbar,
    IconButton,
} from "@mui/material";
import { IRecipe } from "../interfaces";
import { ArrowLeft } from "react-feather";

function RecipeDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState<IRecipe | null>(null);
    const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

    const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
    useEffect(() => {
        axios
            .get<IRecipe>(`${API_BASE_URL}/recipes/${id}`)
            .then((response) => {
                setRecipe(response.data);
            })
            .catch((error) => {
                console.error("Error fetching recipe details:", error);
            });
    }, [id]);

    const handleAddMissingToGroceryList = async () => {
        try {
            await axios.post(
                `${API_BASE_URL}/recipes/${id}/add-missing-to-grocery-list`
            );
            setSnackbarMessage("Missing ingredients added to grocery list!");
        } catch (error) {
            console.error("Error adding missing ingredients:", error);
            setSnackbarMessage("Failed to add ingredients.");
        }
    };

    const handleNavigateToMealPlanner = () => {
        navigate("/meal-planner");
    };

    if (!recipe) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <IconButton
                onClick={() => navigate("/recipes")}
                sx={{ order: { xs: 2, sm: 1 } }}
            >
                <ArrowLeft />
            </IconButton>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    flexDirection: { xs: "column", sm: "row" },
                    mb: 2,
                    gap: 2,
                }}
            >
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{ fontWeight: 700, mb: 0, order: { xs: 1, sm: 2 } }}
                >
                    {recipe.title}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, order: { xs: 3, sm: 3 } }}>
                    <Button
                        onClick={handleNavigateToMealPlanner}
                        variant="outlined"
                        size="medium"
                    >
                        Add to Meal Plan
                    </Button>
                    <Button
                        onClick={handleAddMissingToGroceryList}
                        variant="contained"
                        size="medium"
                    >
                        Add Missing to Grocery List
                    </Button>
                </Box>
            </Box>
            <Typography
                variant="h5"
                color="text.secondary"
                gutterBottom
                sx={{ fontStyle: "italic", mb: 2 }}
            >
                {recipe.cuisine}
            </Typography>

            <Box mt={4}>
                <Typography
                    variant="h4"
                    component="h2"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                >
                    Ingredients
                </Typography>
                <List>
                    {recipe.ingredients.map((ingredient, index) => (
                        <ListItem
                            key={index}
                            sx={{
                                borderRadius: 2,
                                mb: 1,
                                boxShadow: "0 1px 4px 0 rgba(60,80,60,0.04)",
                                transition: "background 0.2s",
                                "&:hover": { backgroundColor: "primary.light" },
                            }}
                        >
                            <ListItemText
                                primary={ingredient.name}
                                secondary={`${ingredient.quantity || ""} ${
                                    ingredient.unit || ""
                                }`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Box mt={4}>
                <Typography
                    variant="h4"
                    component="h2"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                >
                    Instructions
                </Typography>
                <List>
                    {recipe.instructions.map((step, index) => (
                        <React.Fragment key={index}>
                            <ListItem sx={{ borderRadius: 2, mb: 1 }}>
                                <ListItemText
                                    primary={`Step ${index + 1}`}
                                    secondary={step}
                                />
                            </ListItem>
                            {index < recipe.instructions.length - 1 && (
                                <Divider />
                            )}
                        </React.Fragment>
                    ))}
                </List>
            </Box>
            <Snackbar
                open={!!snackbarMessage}
                autoHideDuration={6000}
                onClose={() => setSnackbarMessage(null)}
                message={snackbarMessage}
            />
        </Container>
    );
}

export default RecipeDetails;
