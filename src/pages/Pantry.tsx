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
    Paper,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
} from "@mui/material";
import { Check, X, Trash2 } from "react-feather";
import { IPantryItem } from "../interfaces";
import { GROCERY_CATEGORIES } from "../categories";

function Pantry() {
    const [items, setItems] = useState<IPantryItem[]>([]);
    const [newItem, setNewItem] = useState({
        name: "",
        quantity: "",
        unit: "",
        category: "Other",
    });
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [editingItemName, setEditingItemName] = useState<string>("");
    const [editingItemCategory, setEditingItemCategory] = useState<string>("");

    const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

    const fetchItems = async () => {
        try {
            const response = await axios.get<IPantryItem[]>(
                `${API_BASE_URL}/pantry`
            );
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching pantry items:", error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setNewItem({ ...newItem, [name]: value });
    };

    const handleCategorySelectChange = (e: any) => {
        setNewItem({ ...newItem, category: e.target.value });
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.name.trim()) return;

        const itemToPost: {
            name: string;
            unit?: string;
            quantity?: number;
            category: string;
        } = {
            name: newItem.name,
            category: newItem.category,
        };

        if (newItem.unit) {
            itemToPost.unit = newItem.unit;
        }

        if (newItem.quantity) {
            itemToPost.quantity = Number(newItem.quantity);
        }

        try {
            const response = await axios.post<IPantryItem>(
                `${API_BASE_URL}/pantry`,
                itemToPost
            );
            setItems([...items, response.data]);
            setNewItem({
                name: "",
                quantity: "",
                unit: "",
                category: "Other",
            });
        } catch (error) {
            console.error("Error adding pantry item:", error);
        }
    };

    const handleDeleteItem = async (id: string) => {
        try {
            await axios.delete(`${API_BASE_URL}/pantry/${id}`);
            setItems(items.filter((item) => item._id !== id));
        } catch (error) {
            console.error("Error deleting pantry item:", error);
        }
    };

    const handleEditItem = (item: IPantryItem) => {
        setEditingItemId(item._id);
        setEditingItemName(item.name);
        setEditingItemCategory(item.category || "Other");
    };

    const handleCancelEdit = () => {
        setEditingItemId(null);
        setEditingItemName("");
        setEditingItemCategory("");
    };

    const handleUpdateItem = async (item: IPantryItem) => {
        if (editingItemName.trim() === "") return;
        try {
            const updatedItem = {
                ...item,
                name: editingItemName,
                category: editingItemCategory,
            };
            await axios.put(`${API_BASE_URL}/pantry/${item._id}`, updatedItem);
            fetchItems();
            setEditingItemId(null);
        } catch (error) {
            console.error("Error updating pantry item:", error);
        }
    };

    const groupedItems = items.reduce((acc, item) => {
        const category = item.category || "Other";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {} as Record<string, IPantryItem[]>);

    return (
        <Container sx={{ pt: 4 }}>
            <Typography variant="h2" component="h1" gutterBottom>
                Pantry
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
                        name="name"
                        value={newItem.name}
                        onChange={handleInputChange}
                        required
                        sx={{ flex: 2, width: "100%" }}
                    />
                    <TextField
                        label="Quantity"
                        name="quantity"
                        type="number"
                        value={newItem.quantity}
                        onChange={handleInputChange}
                        sx={{ flex: 1, width: "100%" }}
                    />
                    <TextField
                        label="Unit"
                        name="unit"
                        value={newItem.unit}
                        onChange={handleInputChange}
                        sx={{ flex: 1, width: "100%" }}
                    />
                    <FormControl sx={{ flex: 1, width: "100%" }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            name="category"
                            value={newItem.category}
                            onChange={handleCategorySelectChange}
                            label="Category"
                        >
                            {GROCERY_CATEGORIES.map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    {cat}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        sx={{ py: "15px", width: { xs: "100%", sm: "auto" } }}
                    >
                        Add Item
                    </Button>
                </Box>
            </Paper>

            {Object.entries(groupedItems).map(([category, itemsInCategory]) => (
                <Box key={category} sx={{ mb: 4 }}>
                    <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                        {category}
                    </Typography>
                    <List>
                        {itemsInCategory.map((item) => (
                            <ListItem
                                key={item._id}
                                sx={{
                                    mb: 1,
                                    borderRadius: 2,
                                    boxShadow:
                                        "0 1px 4px 0 rgba(60,80,60,0.04)",
                                    bgcolor: "background.paper",
                                    p: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        width: "100%",
                                    }}
                                >
                                    <Checkbox
                                        edge="start"
                                        checked={false}
                                        tabIndex={-1}
                                        disableRipple
                                        sx={{
                                            p: 0,
                                            mr: 2,
                                            opacity: 0,
                                            cursor: "default",
                                        }}
                                    />
                                    {editingItemId === item._id ? (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: {
                                                    xs: "column",
                                                    sm: "row",
                                                },
                                                alignItems: {
                                                    xs: "flex-start",
                                                    sm: "center",
                                                },
                                                width: "100%",
                                                gap: 1,
                                            }}
                                        >
                                            <TextField
                                                value={editingItemName}
                                                onChange={(e) =>
                                                    setEditingItemName(
                                                        e.target.value
                                                    )
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        handleUpdateItem(item);
                                                    }
                                                }}
                                                autoFocus
                                                variant="standard"
                                                sx={{
                                                    flex: 1,
                                                    width: "100%",
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 0.5,
                                                }}
                                            >
                                                <FormControl
                                                    sx={{ minWidth: 120 }}
                                                >
                                                    <Select
                                                        value={
                                                            editingItemCategory
                                                        }
                                                        onChange={(e) =>
                                                            setEditingItemCategory(
                                                                e.target
                                                                    .value as string
                                                            )
                                                        }
                                                        variant="standard"
                                                        sx={{
                                                            fontSize:
                                                                "0.875rem",
                                                        }}
                                                    >
                                                        {GROCERY_CATEGORIES.map(
                                                            (cat) => (
                                                                <MenuItem
                                                                    key={cat}
                                                                    value={cat}
                                                                >
                                                                    {cat}
                                                                </MenuItem>
                                                            )
                                                        )}
                                                    </Select>
                                                </FormControl>
                                                <IconButton
                                                    onClick={() =>
                                                        handleUpdateItem(item)
                                                    }
                                                >
                                                    <Check size={20} />
                                                </IconButton>
                                                <IconButton
                                                    onClick={handleCancelEdit}
                                                >
                                                    <X size={20} />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    ) : (
                                        <>
                                            <ListItemText
                                                primary={item.name}
                                                secondary={
                                                    item.quantity
                                                        ? `Quantity: ${
                                                              item.quantity
                                                          }${
                                                              item.unit
                                                                  ? " " +
                                                                    item.unit
                                                                  : ""
                                                          }`
                                                        : item.unit || ""
                                                }
                                                sx={{
                                                    flex: 1,
                                                    mr: 2,
                                                    cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                    handleEditItem(item)
                                                }
                                            />
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() =>
                                                    handleDeleteItem(item._id)
                                                }
                                            >
                                                <Trash2 size={20} />
                                            </IconButton>
                                        </>
                                    )}
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            ))}
        </Container>
    );
}

export default Pantry;
