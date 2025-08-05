import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container,
    Typography,
    Button,
    Paper,
    Box,
    Modal,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ListSubheader,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
    IMealPlanEntry,
    IRecipe,
    IIngredient,
    IPantryItem,
} from "../interfaces";
import { format, addDays } from "date-fns";

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
    const [currentDate, setCurrentDate] = useState(new Date());
    const [recipes, setRecipes] = useState<IRecipe[]>([]);
    const [pantryItems, setPantryItems] = useState<IPantryItem[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [missingIngredients, setMissingIngredients] = useState<IIngredient[]>(
        []
    );
    const [isMissingIngredientsModalOpen, setMissingIngredientsModalOpen] =
        useState(false);
    const [lastAddedRecipeId, setLastAddedRecipeId] = useState<string | null>(
        null
    );

    // New state for Daily Summary
    const [dailySummary, setDailySummary] = useState<{
        available: IPantryItem[];
        missing: IIngredient[];
        needsConfirmation: any[];
    }>({ available: [], missing: [], needsConfirmation: [] });
    const [resolvedMatches, setResolvedMatches] = useState<
        Record<string, string>
    >({});

    const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

    const fetchPantryItems = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/pantry`);
            setPantryItems(response.data);
        } catch (error) {
            console.error("Error fetching pantry items:", error);
        }
    };

    const fetchRecipes = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/recipes`);
            setRecipes(response.data);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        }
    };

    const fetchMealPlan = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/meal-planner`, {
                params: {
                    date: currentDate.toISOString(),
                },
            });
            setMealPlan(response.data);
        } catch (error) {
            console.error("Error fetching meal plan:", error);
        }
    };

    const checkIngredientsForDay = async () => {
        if (mealPlan.length === 0) {
            setDailySummary({
                available: [],
                missing: [],
                needsConfirmation: [],
            });
            return;
        }

        const aggregatedIngredients = mealPlan.flatMap(
            (meal) => meal.recipeId.ingredients
        );

        try {
            const response = await axios.post(
                `${API_BASE_URL}/pantry/check-ingredients`,
                {
                    ingredients: aggregatedIngredients,
                }
            );
            setDailySummary(response.data);
        } catch (error) {
            console.error("Error checking day ingredients:", error);
        }
    };

    useEffect(() => {
        fetchMealPlan();
    }, [currentDate]);

    useEffect(() => {
        checkIngredientsForDay();
    }, [mealPlan]);

    useEffect(() => {
        fetchRecipes();
        fetchPantryItems();
    }, []);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleAddRecipeToPlan = async (recipeId: string) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/meal-planner`, {
                recipeId,
                date: currentDate.toISOString(),
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

    const handleMatchResolved = (
        ingredientName: string,
        pantryItemId: string
    ) => {
        setResolvedMatches((prev) => ({
            ...prev,
            [ingredientName]: pantryItemId,
        }));
    };

    const getFinalMissingIngredients = () => {
        const confirmedMissing = dailySummary.needsConfirmation
            .filter(
                (item) =>
                    resolvedMatches[item.ingredient.name] === "add-to-missing"
            )
            .map((item) => item.ingredient);

        return [...dailySummary.missing, ...confirmedMissing];
    };

    const handleAddAllToGroceryList = async () => {
        const itemsToAdd = getFinalMissingIngredients().map((item) => ({
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            isChecked: false,
        }));

        if (itemsToAdd.length === 0) return;

        try {
            await axios.post(`${API_BASE_URL}/grocery-list/batch-add`, {
                items: itemsToAdd,
            });
            // Maybe show a success message
            setResolvedMatches({});
        } catch (error) {
            console.error("Error adding batch to grocery list:", error);
        }
    };

    const renderDay = () => {
        return (
            <Paper
                elevation={2}
                sx={{
                    p: 2,
                    borderRadius: 4,
                }}
            >
                {mealPlan.map((meal) => (
                    <Box key={meal._id} sx={{ my: 1 }}>
                        <Link
                            to={`/recipes/${meal.recipeId._id}`}
                            style={{
                                textDecoration: "none",
                                color: "inherit",
                            }}
                        >
                            <Typography
                                variant="h6"
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
                <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={handleOpenModal}
                    sx={{ mt: 2 }}
                >
                    Add Recipe
                </Button>
            </Paper>
        );
    };

    const renderIngredientSummary = () => {
        const hasIngredients =
            dailySummary.available.length > 0 ||
            dailySummary.missing.length > 0 ||
            dailySummary.needsConfirmation.length > 0;

        if (!hasIngredients) {
            return (
                <Typography sx={{ mt: 4, textAlign: "center" }}>
                    No meals planned for this day. Add a recipe to get started.
                </Typography>
            );
        }

        return (
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Ingredient Summary
                </Typography>

                {/* Needs Confirmation Section */}
                {dailySummary.needsConfirmation.length > 0 && (
                    <Box mb={3}>
                        <Typography variant="h6" gutterBottom>
                            Link Ingredients to Pantry Items
                        </Typography>
                        <List>
                            {dailySummary.needsConfirmation.map(
                                (item, index) => {
                                    return (
                                        <ListItem key={index} divider>
                                            <ListItemText
                                                primary={item.ingredient.name}
                                                secondary="Recipe Ingredient"
                                            />
                                            <FormControl
                                                sx={{ m: 1, minWidth: 220 }}
                                                size="small"
                                            >
                                                <InputLabel>
                                                    Select Pantry Item
                                                </InputLabel>
                                                <Select
                                                    value={
                                                        resolvedMatches[
                                                            item.ingredient.name
                                                        ] || ""
                                                    }
                                                    label="Select Pantry Item"
                                                    onChange={(e) =>
                                                        handleMatchResolved(
                                                            item.ingredient
                                                                .name,
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <MenuItem value="add-to-missing">
                                                        <em>
                                                            None - Mark as
                                                            Missing
                                                        </em>
                                                    </MenuItem>
                                                    {item.potentialMatches
                                                        .length > 0 && (
                                                        <ListSubheader>
                                                            Potential Matches
                                                        </ListSubheader>
                                                    )}
                                                    {item.potentialMatches.map(
                                                        (
                                                            match: IPantryItem
                                                        ) => (
                                                            <MenuItem
                                                                key={match._id}
                                                                value={
                                                                    match._id
                                                                }
                                                            >
                                                                {match.name}
                                                            </MenuItem>
                                                        )
                                                    )}
                                                    {item.potentialMatches
                                                        .length > 0 && (
                                                        <ListSubheader>
                                                            All Pantry Items
                                                        </ListSubheader>
                                                    )}
                                                    {pantryItems
                                                        .filter(
                                                            (p) =>
                                                                !item.potentialMatches.some(
                                                                    (
                                                                        pm: IPantryItem
                                                                    ) =>
                                                                        pm._id ===
                                                                        p._id
                                                                )
                                                        )
                                                        .map((pantryItem) => (
                                                            <MenuItem
                                                                key={
                                                                    pantryItem._id
                                                                }
                                                                value={
                                                                    pantryItem._id
                                                                }
                                                            >
                                                                {
                                                                    pantryItem.name
                                                                }
                                                            </MenuItem>
                                                        ))}
                                                </Select>
                                            </FormControl>
                                        </ListItem>
                                    );
                                }
                            )}
                        </List>
                    </Box>
                )}

                {/* Available Ingredients Section */}
                {dailySummary.available.length > 0 && (
                    <Box mb={3}>
                        <Typography variant="h6" gutterBottom>
                            Available in Pantry
                        </Typography>
                        <List>
                            {dailySummary.available.map((item, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={item.name} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

                {/* Missing Ingredients Section */}
                {getFinalMissingIngredients().length > 0 && (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Missing Ingredients
                        </Typography>
                        <List>
                            {getFinalMissingIngredients().map((item, index) => (
                                <ListItem key={index}>
                                    <ListItemText
                                        primary={`${item.name} (${item.quantity} ${item.unit})`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        <Button
                            onClick={handleAddAllToGroceryList}
                            variant="contained"
                            color="secondary"
                            fullWidth
                            sx={{ mt: 1 }}
                        >
                            Add All Missing to Grocery List
                        </Button>
                    </Box>
                )}
            </Box>
        );
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
                    onClick={() => setCurrentDate(addDays(currentDate, -1))}
                    variant="outlined"
                >
                    Yesterday
                </Button>
                <Typography variant="h5">
                    {format(currentDate, "MMMM d, yyyy")}
                </Typography>
                <Button
                    onClick={() => setCurrentDate(addDays(currentDate, 1))}
                    variant="outlined"
                >
                    Tomorrow
                </Button>
            </Box>

            {renderDay()}

            {renderIngredientSummary()}

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
                        Add a Recipe for {format(currentDate, "MMM d")}
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
