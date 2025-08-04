import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import {
    Container,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    SelectChangeEvent,
    Box,
    IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { IRecipe } from "../interfaces";

const cuisineTypes = [
    "American",
    "Italian",
    "Mexican",
    "Chinese",
    "Indian",
    "Japanese",
    "Thai",
    "French",
    "Greek",
    "Spanish",
    "Other",
];

interface IIngredient {
    name: string;
    quantity?: number | string;
    unit?: string;
}

function AddRecipe() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [ingredients, setIngredients] = useState<IIngredient[]>([
        { name: "", quantity: "", unit: "" },
    ]);
    const [instructions, setInstructions] = useState<string[]>([""]);
    const [cuisine, setCuisine] = useState("");

    const handleIngredientChange = (
        index: number,
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const values = [...ingredients];
        values[index][event.target.name as keyof IIngredient] =
            event.target.value;
        setIngredients(values);
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
    };

    const handleRemoveIngredient = (index: number) => {
        const values = [...ingredients];
        values.splice(index, 1);
        setIngredients(values);
    };

    const handleInstructionChange = (
        index: number,
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const values = [...instructions];
        values[index] = event.target.value;
        setInstructions(values);
    };

    const handleAddInstruction = () => {
        setInstructions([...instructions, ""]);
    };

    const handleRemoveInstruction = (index: number) => {
        const values = [...instructions];
        values.splice(index, 1);
        setInstructions(values);
    };

    const handleAddRecipe = () => {
        const recipeToPost = {
            title,
            ingredients: ingredients.map((ing) => ({
                ...ing,
                quantity: ing.quantity ? Number(ing.quantity) : undefined,
            })),
            instructions,
            cuisine,
        };

        axios
            .post<IRecipe>("http://localhost:3001/api/recipes", recipeToPost)
            .then(() => {
                navigate("/recipes");
            })
            .catch((error) => {
                console.error("Error adding recipe:", error);
            });
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Add a New Recipe
            </Typography>

            <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                margin="normal"
            />

            <Typography variant="h6">Ingredients</Typography>
            {ingredients.map((ingredient, index) => (
                <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                >
                    <TextField
                        name="name"
                        label="Ingredient"
                        value={ingredient.name}
                        onChange={(e) => handleIngredientChange(index, e)}
                        sx={{ mr: 1 }}
                    />
                    <TextField
                        name="quantity"
                        label="Quantity"
                        type="number"
                        value={ingredient.quantity}
                        onChange={(e) => handleIngredientChange(index, e)}
                        sx={{ mr: 1, width: "100px" }}
                    />
                    <TextField
                        name="unit"
                        label="Unit"
                        value={ingredient.unit}
                        onChange={(e) => handleIngredientChange(index, e)}
                        sx={{ mr: 1, width: "100px" }}
                    />
                    <IconButton onClick={() => handleRemoveIngredient(index)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ))}
            <Button onClick={handleAddIngredient} startIcon={<AddIcon />}>
                Add Ingredient
            </Button>

            <Typography variant="h6" sx={{ mt: 2 }}>
                Instructions
            </Typography>
            {instructions.map((step, index) => (
                <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                >
                    <TextField
                        label={`Step ${index + 1}`}
                        value={step}
                        onChange={(e) => handleInstructionChange(index, e)}
                        fullWidth
                    />
                    <IconButton onClick={() => handleRemoveInstruction(index)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ))}
            <Button onClick={handleAddInstruction} startIcon={<AddIcon />}>
                Add Step
            </Button>

            <FormControl fullWidth margin="normal" sx={{ mt: 2 }}>
                <InputLabel>Cuisine</InputLabel>
                <Select
                    value={cuisine}
                    onChange={(e: SelectChangeEvent) =>
                        setCuisine(e.target.value)
                    }
                >
                    {cuisineTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                <Button
                    onClick={handleAddRecipe}
                    variant="contained"
                    color="primary"
                >
                    Add Recipe
                </Button>
                <Button variant="outlined" onClick={() => navigate("/recipes")}>
                    Cancel
                </Button>
            </Box>
        </Container>
    );
}

export default AddRecipe;
