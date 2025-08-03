import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    Checkbox,
    IconButton,
    Button,
    Collapse,
    Divider,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { Edit2, Trash2, ChevronDown, ChevronUp } from "react-feather";
import { ITask } from "../interfaces";

function TodoList() {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [archivedTasks, setArchivedTasks] = useState<ITask[]>([]);
    const [isArchivedVisible, setIsArchivedVisible] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchTasks = () => {
        axios
            .get<ITask[]>("http://localhost:3001/api/tasks")
            .then((response) => {
                setTasks(response.data);
            })
            .catch((error) => {
                console.error("Error fetching tasks:", error);
            });
    };

    const fetchArchivedTasks = () => {
        axios
            .get<ITask[]>("http://localhost:3001/api/tasks/archived")
            .then((response) => {
                setArchivedTasks(response.data);
            })
            .catch((error) => {
                console.error("Error fetching archived tasks:", error);
            });
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        if (isArchivedVisible) {
            fetchArchivedTasks();
        }
    }, [isArchivedVisible]);

    const handleAddTask = () => {
        navigate("/tasks/edit");
    };

    const handleToggleComplete = (task: ITask) => {
        axios
            .put<ITask>(`http://localhost:3001/api/tasks/${task._id}`, {
                completed: !task.completed,
            })
            .then(() => {
                fetchTasks(); // Refetch to get the latest state
            })
            .catch((error) => {
                console.error("Error updating task:", error);
            });
    };

    const openDeleteDialog = (id: string) => {
        setTaskToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setTaskToDelete(null);
        setIsDeleteDialogOpen(false);
    };

    const confirmDeleteTask = () => {
        if (taskToDelete) {
            axios
                .delete(`http://localhost:3001/api/tasks/${taskToDelete}`)
                .then(() => {
                    fetchTasks();
                    if (isArchivedVisible) {
                        fetchArchivedTasks();
                    }
                    closeDeleteDialog();
                })
                .catch((error) => {
                    console.error("Error deleting task:", error);
                    closeDeleteDialog();
                });
        }
    };

    const handleEditTask = (task: ITask) => {
        navigate("/tasks/edit", {
            state: {
                todo: task,
            },
        });
    };

    const getPriorityIndicator = (
        priority: "low" | "medium" | "high" | "none"
    ) => {
        switch (priority) {
            case "high":
                return "!!!";
            case "medium":
                return "!!";
            case "low":
                return "!";
            default:
                return "";
        }
    };

    const getPriorityColor = (priority: "low" | "medium" | "high" | "none") => {
        switch (priority) {
            case "high":
                return "error.main";
            case "medium":
                return "warning.main";
            case "low":
                return "info.main";
            default:
                return "inherit";
        }
    };

    return (
        <Container maxWidth="md" sx={{ pt: 4 }}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={4}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    To-Do List
                </Typography>
                <Button
                    onClick={handleAddTask}
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: "1.05rem",
                        px: 3,
                        py: 1.2,
                        boxShadow: "0 2px 8px 0 rgba(247, 197, 159, 0.10)",
                        letterSpacing: 0.2,
                        minWidth: 0,
                        backgroundColor: "secondary.main",
                        color: "secondary.contrastText",
                        "&:hover": {
                            backgroundColor: "secondary.light",
                            color: "secondary.contrastText",
                            boxShadow: "0 4px 16px 0 rgba(247, 197, 159, 0.18)",
                        },
                    }}
                >
                    + Add Task
                </Button>
            </Box>
            <List
                sx={{
                    bgcolor: "background.paper",
                    borderRadius: 4,
                    boxShadow: "0 1px 8px 0 rgba(60,80,60,0.07)",
                }}
            >
                {tasks.map((task, index) => (
                    <React.Fragment key={task._id}>
                        <ListItem
                            sx={{
                                alignItems: "flex-start",
                                py: 1.5,
                                px: 2,
                            }}
                            secondaryAction={
                                <Box sx={{ display: "flex", gap: 1, pt: 1 }}>
                                    <IconButton
                                        edge="end"
                                        aria-label="edit"
                                        onClick={() => handleEditTask(task)}
                                    >
                                        <Edit2 size={20} />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() =>
                                            task._id &&
                                            openDeleteDialog(task._id)
                                        }
                                    >
                                        <Trash2 size={20} />
                                    </IconButton>
                                </Box>
                            }
                        >
                            <Checkbox
                                checked={task.completed}
                                onChange={() => handleToggleComplete(task)}
                                sx={{ mr: 1, pt: 1.25 }}
                                color="primary"
                            />
                            <ListItemText
                                primary={
                                    <Box display="flex" alignItems="center">
                                        <Typography
                                            component="span"
                                            variant="body1"
                                            fontWeight={600}
                                            fontSize="1.08rem"
                                        >
                                            {task.title}
                                        </Typography>
                                        {task.priority &&
                                            task.priority !== "none" && (
                                                <Typography
                                                    component="span"
                                                    fontWeight={700}
                                                    fontSize="1rem"
                                                    ml={1}
                                                    color={getPriorityColor(
                                                        task.priority
                                                    )}
                                                >
                                                    {getPriorityIndicator(
                                                        task.priority
                                                    )}
                                                </Typography>
                                            )}
                                    </Box>
                                }
                                secondary={
                                    <>
                                        {task.notes && (
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                mt={0.5}
                                            >
                                                {task.notes}
                                            </Typography>
                                        )}
                                        {task.dueDate && (
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                display="block"
                                                mt={0.5}
                                            >
                                                Due:{" "}
                                                {new Date(
                                                    task.dueDate
                                                ).toLocaleDateString()}
                                            </Typography>
                                        )}
                                    </>
                                }
                            />
                        </ListItem>
                        {index < tasks.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>

            <Box mt={4}>
                <Divider sx={{ my: 3 }} />
                <Button
                    onClick={() => setIsArchivedVisible(!isArchivedVisible)}
                    fullWidth
                    color="inherit"
                    sx={{
                        justifyContent: "space-between",
                        fontWeight: 500,
                        fontSize: "1rem",
                        borderRadius: 8,
                        py: 1.2,
                        px: 2,
                        textTransform: "none",
                    }}
                    endIcon={
                        isArchivedVisible ? <ChevronUp /> : <ChevronDown />
                    }
                >
                    Completed Items
                </Button>
                <Collapse in={isArchivedVisible}>
                    <List sx={{ mt: 2 }}>
                        {archivedTasks.map((task) => (
                            <ListItem
                                key={task._id}
                                sx={{
                                    bgcolor: "background.paper",
                                    borderRadius: 2,
                                    mb: 1,
                                    opacity: 0.7,
                                    boxShadow:
                                        "0 1px 4px 0 rgba(60,80,60,0.04)",
                                }}
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() =>
                                            task._id &&
                                            openDeleteDialog(task._id)
                                        }
                                        color="error"
                                    >
                                        <Trash2 size={18} />
                                    </IconButton>
                                }
                            >
                                <ListItemText
                                    primary={task.title}
                                    sx={{
                                        textDecoration: "line-through",
                                        color: "text.secondary",
                                        fontWeight: 500,
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
            </Box>

            <Dialog
                open={isDeleteDialogOpen}
                onClose={closeDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" variant="h5">
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        id="alert-dialog-description"
                        variant="body2"
                    >
                        Are you sure you want to permanently delete this task?
                        This action cannot be undone.
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
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default TodoList;
