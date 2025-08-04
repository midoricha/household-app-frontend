import React, { useState, useEffect } from "react";
import axios from "axios";
import { IGroceryListItem } from "../interfaces";
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Checkbox,
    IconButton,
    Paper,
} from "@mui/material";
import { ShoppingCart } from "react-feather";

const GroceryListPage: React.FC = () => {
    const [items, setItems] = useState<IGroceryListItem[]>([]);
    const [newItemName, setNewItemName] = useState("");
    const [newItemQuantity, setNewItemQuantity] = useState<number | string>("");
    const [newItemUnit, setNewItemUnit] = useState("");

    const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

    const fetchItems = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/grocery-list`);
            if (Array.isArray(response.data)) {
                setItems(response.data);
            } else {
                setItems([]);
            }
        } catch (error) {
            console.error("Error fetching grocery list items:", error);
            setItems([]);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleToggleItem = async (item: IGroceryListItem) => {
        try {
            const updatedItem = { ...item, isChecked: !item.isChecked };
            await axios.put(
                `${API_BASE_URL}/grocery-list/${item._id}`,
                updatedItem
            );
            setItems(items.map((i) => (i._id === item._id ? updatedItem : i)));
        } catch (error) {
            console.error("Error updating grocery item:", error);
        }
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemName.trim()) return;
        try {
            const newItem: Partial<IGroceryListItem> = {
                name: newItemName,
                isChecked: false,
                quantity: newItemQuantity ? Number(newItemQuantity) : undefined,
                unit: newItemUnit || undefined,
            };
            const response = await axios.post(
                `${API_BASE_URL}/grocery-list`,
                newItem
            );
            setItems([...items, response.data]);
            setNewItemName("");
            setNewItemQuantity("");
            setNewItemUnit("");
        } catch (error) {
            console.error("Error adding grocery item:", error);
        }
    };

    const handleMoveToPantry = async () => {
        try {
            await axios.post(`${API_BASE_URL}/grocery-list/move-to-pantry`);
            fetchItems(); // Refresh the list
        } catch (error) {
            console.error("Error moving items to pantry:", error);
        }
    };

    return (
        <Container sx={{ pt: 4 }}>
            <Typography variant="h2" component="h1" gutterBottom>
                Grocery List
            </Typography>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, sm: 3 },
                    mb: 4,
                    borderRadius: 4,
                    bgcolor: "primary.light",
                }}
            >
                <Box
                    component="form"
                    onSubmit={handleAddItem}
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2,
                        alignItems: "center",
                    }}
                >
                    <TextField
                        label="Item Name"
                        variant="outlined"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        required
                        sx={{ flex: 2 }}
                    />
                    <TextField
                        label="Quantity"
                        type="number"
                        variant="outlined"
                        value={newItemQuantity}
                        onChange={(e) => setNewItemQuantity(e.target.value)}
                        sx={{ flex: 1 }}
                    />
                    <TextField
                        label="Unit"
                        variant="outlined"
                        value={newItemUnit}
                        onChange={(e) => setNewItemUnit(e.target.value)}
                        sx={{ flex: 1 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ py: "15px" }}
                    >
                        Add
                    </Button>
                </Box>
            </Paper>

            <List>
                {Array.isArray(items) &&
                    items.map((item) => (
                        <ListItem
                            key={item._id}
                            sx={{
                                mb: 1,
                                borderRadius: 2,
                                boxShadow: "0 1px 4px 0 rgba(60,80,60,0.04)",
                                bgcolor: "background.paper",
                            }}
                            secondaryAction={
                                <Checkbox
                                    edge="end"
                                    onChange={() => handleToggleItem(item)}
                                    checked={item.isChecked}
                                />
                            }
                        >
                            <ListItemText
                                primary={item.name}
                                secondary={
                                    item.quantity
                                        ? `Quantity: ${item.quantity} ${
                                              item.unit || ""
                                          }`
                                        : null
                                }
                                sx={{
                                    textDecoration: item.isChecked
                                        ? "line-through"
                                        : "none",
                                }}
                            />
                        </ListItem>
                    ))}
            </List>

            <Button
                onClick={handleMoveToPantry}
                variant="contained"
                color="secondary"
                startIcon={<ShoppingCart />}
                sx={{ mt: 4, width: "100%" }}
            >
                Move Acquired Items to Pantry
            </Button>
        </Container>
    );
};

export default GroceryListPage;
