import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trash2, Check, X } from "react-feather";
import {
    TextField,
    Checkbox,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Box,
    Paper,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "../styles/components.css";
import { ITask } from "../interfaces";

const EditTodo: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const todo: ITask = location.state?.todo || {
        title: "",
        completed: false,
        completedBy: "",
        dueDate: null,
        recurring: "never",
        notes: "",
        priority: "none",
    };

    const [title, setTitle] = useState(todo.title || "");
    const [notes, setNotes] = useState(todo.notes || "");
    const [dueDate, setDueDate] = useState<Date | null>(
        todo.dueDate ? new Date(todo.dueDate) : null
    );
    const [recurring, setRecurring] = useState(todo.recurring || "never");
    const [completed, setCompleted] = useState(todo.completed || false);
    const [completedBy, setCompletedBy] = useState(todo.completedBy || "");
    const [priority, setPriority] = useState<
        "none" | "low" | "medium" | "high"
    >(todo.priority || "none");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        if (!dueDate) {
            setRecurring("never");
        }
    }, [dueDate]);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
    const handleSave = async () => {
        const payload = {
            title,
            notes,
            dueDate,
            recurring,
            completed,
            completedBy,
            priority,
        };
        try {
            const baseUrl = `${API_BASE_URL}/tasks`;
            if (todo._id) {
                // Update existing task
                await fetch(`${baseUrl}/${todo._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            } else {
                // Create new task
                await fetch(baseUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            }
            navigate("/tasks");
        } catch (err) {
            alert("Error saving task. Please try again.");
        }
    };

    const openDeleteDialog = () => {
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
    };

    const confirmDeleteTask = async () => {
        if (!todo._id) return;
        try {
            const baseUrl = `${API_BASE_URL}/tasks`;
            await fetch(`${baseUrl}/${todo._id}`, {
                method: "DELETE",
            });
            navigate("/tasks");
        } catch (err) {
            alert("Error deleting task. Please try again.");
        }
    };

    return (
        <Box sx={{ maxWidth: 480, mx: "auto", mt: 4, px: 2 }}>
            <Paper
                elevation={6}
                sx={{
                    borderRadius: 4,
                    p: { xs: 2, sm: 3 },
                    background: "background.paper",
                    boxShadow: "0 2px 16px 0 rgba(60, 80, 60, 0.10)",
                    border: "1px solid",
                    borderColor: "primary.light",
                }}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                >
                    <Button
                        onClick={openDeleteDialog}
                        color="error"
                        variant="outlined"
                        sx={{ minWidth: 0, p: 1, borderRadius: 2 }}
                    >
                        <Trash2 size={20} />
                    </Button>
                    <Typography variant="h5" color="primary" fontWeight={700}>
                        {todo._id ? "Edit Reminder" : "Add Reminder"}
                    </Typography>
                    <Button
                        onClick={() => navigate(-1)}
                        color="secondary"
                        variant="outlined"
                        sx={{ minWidth: 0, p: 1, borderRadius: 2 }}
                    >
                        <X size={20} />
                    </Button>
                </Box>
                <Box
                    component="form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}
                >
                    <TextField
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                        color="primary"
                        placeholder={todo.title || "Reminder title"}
                    />
                    <TextField
                        label="Notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        fullWidth
                        margin="normal"
                        multiline
                        minRows={2}
                        color="primary"
                        placeholder={todo.notes || "Add notes (optional)"}
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Due Date"
                            value={dueDate}
                            onChange={(newValue) => setDueDate(newValue)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    margin: "normal",
                                    color: "primary",
                                    placeholder: todo.dueDate
                                        ? new Date(
                                              todo.dueDate
                                          ).toLocaleDateString()
                                        : "",
                                },
                            }}
                        />
                    </LocalizationProvider>
                    {dueDate && (
                        <FormControl
                            fullWidth
                            margin="normal"
                            color="secondary"
                            sx={{ mt: 1 }}
                        >
                            <InputLabel id="recurring-label">
                                Recurring
                            </InputLabel>
                            <Select
                                labelId="recurring-label"
                                value={recurring}
                                label="Recurring"
                                onChange={(e) =>
                                    setRecurring(
                                        e.target.value as
                                            | "never"
                                            | "daily"
                                            | "weekly"
                                            | "monthly"
                                            | "yearly"
                                            | "weekdays"
                                            | "weekends"
                                            | "biweekly"
                                    )
                                }
                            >
                                <MenuItem value="never">None</MenuItem>
                                <MenuItem value="daily">Daily</MenuItem>
                                <MenuItem value="weekly">Weekly</MenuItem>
                                <MenuItem value="monthly">Monthly</MenuItem>
                                <MenuItem value="yearly">Yearly</MenuItem>
                                <MenuItem value="weekdays">Weekdays</MenuItem>
                                <MenuItem value="weekends">Weekends</MenuItem>
                                <MenuItem value="biweekly">Biweekly</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                    <TextField
                        label="Completed By"
                        value={completedBy}
                        onChange={(e) => setCompletedBy(e.target.value)}
                        fullWidth
                        margin="normal"
                        color="primary"
                        placeholder={todo.completedBy || "Who completed this?"}
                    />
                    <FormControl
                        fullWidth
                        margin="normal"
                        color="secondary"
                        sx={{ mt: 1 }}
                    >
                        <InputLabel id="priority-label">Priority</InputLabel>
                        <Select
                            labelId="priority-label"
                            value={priority}
                            label="Priority"
                            onChange={(e) =>
                                setPriority(
                                    e.target.value as
                                        | "none"
                                        | "low"
                                        | "medium"
                                        | "high"
                                )
                            }
                        >
                            <MenuItem value="none">None</MenuItem>
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                        </Select>
                    </FormControl>
                    <Box display="flex" alignItems="center" mt={2} mb={2}>
                        <Checkbox
                            checked={completed}
                            onChange={(e) => setCompleted(e.target.checked)}
                            color="primary"
                        />
                        <Typography fontWeight={500} fontSize="1rem">
                            Completed
                        </Typography>
                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        fullWidth
                        sx={{ mt: 2 }}
                        startIcon={<Check size={18} />}
                    >
                        Save
                    </Button>
                </Box>
            </Paper>
            <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
                <DialogTitle variant="h6">Delete Reminder?</DialogTitle>
                <DialogContent>
                    <DialogContentText variant="body2">
                        Are you sure you want to delete this reminder? This
                        action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={closeDeleteDialog}
                        color="primary"
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmDeleteTask}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EditTodo;
