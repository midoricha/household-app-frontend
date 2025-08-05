import React from "react";
import {
    Card,
    CardContent,
    Typography,
    CardActionArea,
    CardMedia,
} from "@mui/material";
import { Link } from "react-router-dom";
import { IRecipe } from "../interfaces";

interface RecipeCardProps {
    recipe: IRecipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    return (
        <Card
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 4,
                transition: "box-shadow 0.3s",
                "&:hover": { boxShadow: 6 },
            }}
        >
            <CardActionArea
                component={Link}
                to={`/recipes/${recipe._id}`}
                sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
                <CardMedia
                    component="img"
                    height="140"
                    image={`https://source.unsplash.com/random/400x300/?food,${
                        recipe.cuisine || ""
                    }`}
                    alt={recipe.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" gutterBottom>
                        {recipe.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {recipe.cuisine}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default RecipeCard;
