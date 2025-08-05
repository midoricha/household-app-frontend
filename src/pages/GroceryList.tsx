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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import { Check, X, ShoppingCart, Trash2 } from "react-feather";
import { GROCERY_CATEGORIES } from "../categories";

const GroceryListPage: React.FC = () => {
    const [items, setItems] = useState<IGroceryListItem[]>([]);
    const [newItemName, setNewItemName] = useState("");
    const [newItemQuantity, setNewItemQuantity] = useState<number | string>("");
    const [newItemUnit, setNewItemUnit] = useState("");
    const [newItemCategory, setNewItemCategory] = useState<string>("Other");
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [editingItemName, setEditingItemName] = useState<string>("");
    const [editingItemCategory, setEditingItemCategory] = useState<string>("");

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
                category: newItemCategory,
            };
            const response = await axios.post(
                `${API_BASE_URL}/grocery-list`,
                newItem
            );
            setItems([...items, response.data]);
            setNewItemName("");
            setNewItemQuantity("");
            setNewItemUnit("");
            setNewItemCategory("Other");
        } catch (error) {
            console.error("Error adding grocery item:", error);
        }
    };

    const handleDeleteItem = async (id: string) => {
        try {
            await axios.delete(`${API_BASE_URL}/grocery-list/${id}`);
            setItems(items.filter((item) => item._id !== id));
        } catch (error) {
            console.error("Error deleting grocery item:", error);
        }
    };

    const handleEditItem = (item: IGroceryListItem) => {
        setEditingItemId(item._id);
        setEditingItemName(item.name);
        setEditingItemCategory(item.category || "Other");
    };

    const handleCancelEdit = () => {
        setEditingItemId(null);
        setEditingItemName("");
        setEditingItemCategory("");
    };

    const handleUpdateItem = async (item: IGroceryListItem) => {
        if (editingItemName.trim() === "") return;
        try {
            const updatedItem = {
                ...item,
                name: editingItemName,
                category: editingItemCategory,
            };
            await axios.put(
                `${API_BASE_URL}/grocery-list/${item._id}`,
                updatedItem
            );
            // After updating, we need to refetch or smartly update the list
            // to reflect potential category changes.
            fetchItems();
            setEditingItemId(null);
        } catch (error) {
            console.error("Error updating grocery item:", error);
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

    const groupedItems = items.reduce((acc, item) => {
        const category = item.category || "Other";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {} as Record<string, IGroceryListItem[]>);

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
                    <FormControl
                        variant="outlined"
                        sx={{ flex: 1, width: "100%" }}
                    >
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={newItemCategory}
                            onChange={(e) =>
                                setNewItemCategory(e.target.value as string)
                            }
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
                        color="primary"
                        sx={{ py: "15px" }}
                    >
                        Add
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
                                        onChange={() => handleToggleItem(item)}
                                        checked={item.isChecked}
                                        sx={{ p: 0, mr: 2 }}
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
                                                          } ${item.unit || ""}`
                                                        : null
                                                }
                                                sx={{
                                                    textDecoration:
                                                        item.isChecked
                                                            ? "line-through"
                                                            : "none",
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
