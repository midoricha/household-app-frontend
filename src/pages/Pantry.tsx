/// <reference types="vite/client" />
import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    TextField,
    Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { IPantryItem } from "../interfaces";

function Pantry() {
    const [items, setItems] = useState<IPantryItem[]>([]);
    const [newItem, setNewItem] = useState({
        name: "",
        quantity: "",
        unit: "",
    });

    const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
    useEffect(() => {
        axios
            .get<IPantryItem[]>(`${API_BASE_URL}/pantry`)
            .then((response) => {
                setItems(response.data);
            })
            .catch((error) => {
                console.error("Error fetching pantry items:", error);
            });
    }, []);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setNewItem({ ...newItem, [name]: value });
    };

    const handleAddItem = () => {
        const itemToPost: { name: string; unit?: string; quantity?: number } = {
            name: newItem.name,
        };

        if (newItem.unit) {
            itemToPost.unit = newItem.unit;
        }

        if (newItem.quantity) {
            itemToPost.quantity = Number(newItem.quantity);
        }

        axios
            .post<IPantryItem>(`${API_BASE_URL}/pantry`, itemToPost)
            .then((response) => {
                setItems([...items, response.data]);
                setNewItem({ name: "", quantity: "", unit: "" });
            })
            .catch((error) => {
                console.error("Error adding pantry item:", error);
            });
    };

    const handleDeleteItem = (id: string) => {
        axios
            .delete(`${API_BASE_URL}/pantry/${id}`)
            .then(() => {
                setItems(items.filter((item) => item._id !== id));
            })
            .catch((error) => {
                console.error("Error deleting pantry item:", error);
            });
    };

    return (
        <Container sx={{ pt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Pantry
            </Typography>
            <TextField
                label="Item Name"
                name="name"
                value={newItem.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                sx={{ mb: 1.5, borderRadius: 2 }}
            />
            <TextField
                label="Quantity"
                name="quantity"
                type="number"
                value={newItem.quantity}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                sx={{ mb: 1.5, borderRadius: 2 }}
            />
            <TextField
                label="Unit"
                name="unit"
                value={newItem.unit}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                sx={{ mb: 2, borderRadius: 2 }}
            />
            <Button
                onClick={handleAddItem}
                variant="contained"
                color="primary"
                size="large"
                sx={{
                    mb: 3,
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: "1.05rem",
                    px: 3,
                    py: 1.2,
                    letterSpacing: 0.2,
                }}
            >
                Add Item
            </Button>
            <List>
                {items.map((item) => (
                    <ListItem
                        key={item._id}
                        secondaryAction={
                            <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => handleDeleteItem(item._id)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        }
                        sx={{
                            borderRadius: 2,
                            mb: 1,
                            boxShadow: "0 1px 4px 0 rgba(60,80,60,0.04)",
                            transition: "background 0.2s",
                            "&:hover": { backgroundColor: "primary.light" },
                        }}
                    >
                        <ListItemText
                            primary={item.name}
                            secondary={
                                item.quantity
                                    ? `Quantity: ${item.quantity}${
                                          item.unit ? " " + item.unit : ""
                                      }`
                                    : item.unit || ""
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
}

export default Pantry;
