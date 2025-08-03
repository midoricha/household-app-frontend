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
} from "@mui/material";
import { Edit2, Trash2, ChevronDown, ChevronUp } from "react-feather";
import { ITask } from "../interfaces";

function TodoList() {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [archivedTasks, setArchivedTasks] = useState<ITask[]>([]);
    const [isArchivedVisible, setIsArchivedVisible] = useState(false);
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

    const handleDeleteTask = (id: string) => {
        axios
            .delete(`http://localhost:3001/api/tasks/${id}`)
            .then(() => {
                fetchTasks();
                if (isArchivedVisible) {
                    fetchArchivedTasks();
                }
            })
            .catch((error) => {
                console.error("Error deleting task:", error);
            });
    };

    const handleEditTask = (task: ITask) => {
        navigate("/tasks/edit", {
            state: {
                todo: task,
            },
        });
    };

    return (
        <Container maxWidth="sm" style={{ paddingTop: 24 }}>
            <Typography
                variant="h4"
                gutterBottom
                style={{ fontWeight: 600, textAlign: "center" }}
            >
                To-Do List
            </Typography>
            <Button
                onClick={handleAddTask}
                className="button button-primary"
                style={{ width: "100%", marginBottom: 16 }}
            >
                + Add Task
            </Button>
            <List>
                {tasks.map((task) => (
                    <ListItem
                        key={task._id}
                        style={{
                            borderRadius: 12,
                            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                            marginBottom: 12,
                            background: "var(--neutral-100)",
                        }}
                        secondaryAction={
                            <div style={{ display: "flex", gap: 8 }}>
                                <IconButton
                                    edge="end"
                                    aria-label="edit"
                                    onClick={() => handleEditTask(task)}
                                >
                                    <Edit2 size={18} />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() =>
                                        task._id && handleDeleteTask(task._id)
                                    }
                                >
                                    <Trash2 size={18} />
                                </IconButton>
                            </div>
                        }
                    >
                        <Checkbox
                            checked={task.completed}
                            onChange={() => handleToggleComplete(task)}
                            style={{ marginRight: 8 }}
                        />
                        <ListItemText
                            primary={task.title}
                            secondary={
                                task.dueDate
                                    ? `Due: ${new Date(
                                          task.dueDate
                                      ).toLocaleDateString()}`
                                    : ""
                            }
                        />
                    </ListItem>
                ))}
            </List>

            <Divider style={{ margin: "24px 0" }} />

            <Button
                onClick={() => setIsArchivedVisible(!isArchivedVisible)}
                style={{
                    width: "100%",
                    justifyContent: "space-between",
                    color: "var(--text-secondary)",
                }}
                endIcon={
                    isArchivedVisible ? <ChevronUp /> : <ChevronDown />
                }
            >
                Completed Items
            </Button>
            <Collapse in={isArchivedVisible}>
                <List style={{ marginTop: 16 }}>
                    {archivedTasks.map((task) => (
                        <ListItem
                            key={task._id}
                            style={{
                                borderRadius: 12,
                                marginBottom: 12,
                                background: "var(--neutral-50)",
                                opacity: 0.7,
                            }}
                            secondaryAction={
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() =>
                                        task._id && handleDeleteTask(task._id)
                                    }
                                >
                                    <Trash2 size={18} />
                                </IconButton>
                            }
                        >
                            <ListItemText
                                primary={task.title}
                                style={{
                                    textDecoration: "line-through",
                                    color: "var(--text-secondary)",
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Collapse>
        </Container>
    );
}

export default TodoList;
