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

    useEffect(() => {
        if (!dueDate) {
            setRecurring("never");
        }
    }, [dueDate]);

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
            const baseUrl = "http://localhost:3001/api/tasks";
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
            navigate(-1);
        } catch (err) {
            alert("Error saving task. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (!todo._id) return;
        try {
            const baseUrl = "http://localhost:3001/api/tasks";
            await fetch(`${baseUrl}/${todo._id}`, {
                method: "DELETE",
            });
            navigate(-1);
        } catch (err) {
            alert("Error deleting task. Please try again.");
        }
    };

    return (
        <div
            className="edit-todo-page card"
            style={{ maxWidth: 480, margin: "0 auto", marginTop: "2rem" }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1.5rem",
                }}
            >
                <Button
                    onClick={handleDelete}
                    aria-label="Delete"
                    style={{ background: "none", color: "var(--error)" }}
                >
                    <Trash2 size={20} />
                </Button>
                <Typography variant="h6" style={{ margin: 0, fontWeight: 600 }}>
                    {todo._id ? "Edit Reminder" : "Add Reminder"}
                </Typography>
                <Button
                    onClick={() => navigate(-1)}
                    aria-label="Cancel"
                    style={{ background: "none", color: "var(--primary-sage)" }}
                >
                    <X size={20} />
                </Button>
            </div>
            <form
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
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="recurring-label">Recurring</InputLabel>
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
                                        | "weekdays"
                                        | "weekends"
                                        | "biweekly"
                                        | "yearly"
                                )
                            }
                        >
                            <MenuItem value="never">Never</MenuItem>
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                            <MenuItem value="weekdays">Weekdays</MenuItem>
                            <MenuItem value="weekends">Weekends</MenuItem>
                            <MenuItem value="biweekly">Biweekly</MenuItem>
                            <MenuItem value="yearly">Yearly</MenuItem>
                        </Select>
                    </FormControl>
                )}
                <FormControl fullWidth margin="normal">
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
                <TextField
                    label="Completed By"
                    value={completedBy}
                    onChange={(e) => setCompletedBy(e.target.value)}
                    fullWidth
                    margin="normal"
                    placeholder={todo.completedBy || "Who completed this?"}
                />
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "1.25rem",
                    }}
                >
                    <Checkbox
                        checked={completed}
                        onChange={(e) => setCompleted(e.target.checked)}
                        color="primary"
                        style={{ marginRight: 8 }}
                    />
                    <Typography style={{ fontWeight: 500 }}>
                        Completed
                    </Typography>
                </div>
                <Button
                    type="submit"
                    className="button button-primary"
                    style={{ width: "100%", marginTop: "1rem" }}
                >
                    <Check
                        size={18}
                        style={{ marginRight: 8, verticalAlign: "middle" }}
                    />{" "}
                    Save
                </Button>
            </form>
        </div>
    );
};

export default EditTodo;
