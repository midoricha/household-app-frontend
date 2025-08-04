import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container,
    Typography,
    Button,
    Paper,
    Grid,
    Box,
    Modal,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { IMealPlanEntry, IRecipe, IIngredient } from "../interfaces";
import { format, startOfWeek, addDays, endOfWeek } from "date-fns";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 400 },
    bgcolor: "background.paper",
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
};

const MealPlanner: React.FC = () => {
    const [mealPlan, setMealPlan] = useState<IMealPlanEntry[]>([]);
    const [week, setWeek] = useState(new Date());
    const [recipes, setRecipes] = useState<IRecipe[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [missingIngredients, setMissingIngredients] = useState<IIngredient[]>(
        []
    );
    const [isMissingIngredientsModalOpen, setMissingIngredientsModalOpen] =
        useState(false);
    const [lastAddedRecipeId, setLastAddedRecipeId] = useState<string | null>(
        null
    );

    const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

    const fetchRecipes = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/recipes`);
            setRecipes(response.data);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        }
    };

    const fetchMealPlan = async () => {
        const startDate = startOfWeek(week);
        const endDate = endOfWeek(week);
        try {
            const response = await axios.get(`${API_BASE_URL}/meal-planner`, {
                params: {
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                },
            });
            setMealPlan(response.data);
        } catch (error) {
            console.error("Error fetching meal plan:", error);
        }
    };

    useEffect(() => {
        fetchMealPlan();
        fetchRecipes();
    }, [week]);

    const handleOpenModal = (date: Date) => {
        setSelectedDate(date);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedDate(null);
    };

    const handleAddRecipeToPlan = async (recipeId: string) => {
        if (!selectedDate) return;
        try {
            const response = await axios.post(`${API_BASE_URL}/meal-planner`, {
                recipeId,
                date: selectedDate.toISOString(),
                mealType: "Dinner", // Or make this selectable
            });
            if (
                response.data.missingIngredients &&
                response.data.missingIngredients.length > 0
            ) {
                setMissingIngredients(response.data.missingIngredients);
                setLastAddedRecipeId(recipeId);
                setMissingIngredientsModalOpen(true);
            }
            fetchMealPlan(); // Refresh the plan
            handleCloseModal();
        } catch (error) {
            console.error("Error adding recipe to meal plan:", error);
        }
    };

    const handleAddMissingIngredientsToGroceryList = async () => {
        if (!lastAddedRecipeId) return;
        try {
            await axios.post(
                `${API_BASE_URL}/recipes/${lastAddedRecipeId}/add-missing-to-grocery-list`
            );
            setMissingIngredientsModalOpen(false);
            setMissingIngredients([]);
            setLastAddedRecipeId(null);
        } catch (error) {
            console.error(
                "Error adding missing ingredients to grocery list:",
                error
            );
        }
    };

    const renderWeekDays = () => {
        const days = [];
        const startDate = startOfWeek(week);

        for (let i = 0; i < 7; i++) {
            const day = addDays(startDate, i);
            const mealsForDay = mealPlan.filter(
                (entry) =>
                    format(new Date(entry.date), "yyyy-MM-dd") ===
                    format(day, "yyyy-MM-dd")
            );

            days.push(
                <Grid size={{ xs: 12 }} key={day.toString()}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            height: "100%",
                            borderRadius: 4,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}
                    >
                        <div>
                            <Typography
                                variant="h6"
                                component="h3"
                                align="center"
                            >
                                {format(day, "EEE")}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                align="center"
                                gutterBottom
                            >
                                {format(day, "MMM d")}
                            </Typography>
                            {mealsForDay.map((meal) => (
                                <Box key={meal._id} sx={{ my: 1 }}>
                                    <Link
                                        to={`/recipes/${meal.recipeId._id}`}
                                        style={{
                                            textDecoration: "none",
                                            color: "inherit",
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                "&:hover": {
                                                    textDecoration: "underline",
                                                },
                                            }}
                                        >
                                            {meal.recipeId.title}
                                        </Typography>
                                    </Link>
                                </Box>
                            ))}
                        </div>
                        <Button
                            size="small"
                            fullWidth
                            variant="outlined"
                            color="primary"
                            onClick={() => handleOpenModal(day)}
                            sx={{ mt: 2 }}
                        >
                            Add Recipe
                        </Button>
                    </Paper>
                </Grid>
            );
        }
        return days;
    };

    return (
        <Container sx={{ pt: 4 }}>
            <Typography variant="h2" component="h1" gutterBottom>
                Meal Planner
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >
                <Button
                    onClick={() => setWeek(addDays(week, -7))}
                    variant="outlined"
                >
                    Previous Week
                </Button>
                <Typography variant="h5">
                    {format(startOfWeek(week), "MMM d")} -{" "}
                    {format(endOfWeek(week), "MMM d, yyyy")}
                </Typography>
                <Button
                    onClick={() => setWeek(addDays(week, 7))}
                    variant="outlined"
                >
                    Next Week
                </Button>
            </Box>
            <Grid container spacing={2} sx={{ flexWrap: "wrap" }}>
                {renderWeekDays()}
            </Grid>

            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="add-recipe-modal-title"
            >
                <Box sx={style}>
                    <Typography
                        id="add-recipe-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Add a Recipe for{" "}
                        {selectedDate && format(selectedDate, "MMM d")}
                    </Typography>
                    <List>
                        {recipes.map((recipe) => (
                            <ListItemButton
                                key={recipe._id}
                                onClick={() =>
                                    handleAddRecipeToPlan(recipe._id)
                                }
                            >
                                <ListItemText primary={recipe.title} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </Modal>

            <Modal
                open={isMissingIngredientsModalOpen}
                onClose={() => setMissingIngredientsModalOpen(false)}
                aria-labelledby="missing-ingredients-modal-title"
            >
                <Box sx={style}>
                    <Typography
                        id="missing-ingredients-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Missing Ingredients
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        The following ingredients are missing from your pantry:
                    </Typography>
                    <List>
                        {missingIngredients.map((ing, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={`${ing.name} (${ing.quantity} ${ing.unit})`}
                                />
                            </ListItem>
                        ))}
                    </List>
                    <Button
                        onClick={handleAddMissingIngredientsToGroceryList}
                        variant="contained"
                    >
                        Add to Grocery List
                    </Button>
                </Box>
            </Modal>
        </Container>
    );
};

export default MealPlanner;
