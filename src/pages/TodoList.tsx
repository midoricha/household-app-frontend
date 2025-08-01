import React, { useState, useEffect, ChangeEvent } from "react";
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
} from "@mui/material";
import { Edit2, Trash2 } from "react-feather";
import { ITask } from "../interfaces";

function TodoList() {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get<ITask[]>("http://localhost:3001/api/tasks")
            .then((response) => {
                setTasks(response.data);
            })
            .catch((error) => {
                console.error("Error fetching tasks:", error);
            });
    }, []);

    const handleAddTask = () => {
        navigate("/tasks/edit");
    };

    const handleToggleComplete = (id: string, completed: boolean) => {
        axios
            .put<ITask>(`http://localhost:3001/api/tasks/${id}`, {
                completed: !completed,
            })
            .then((response) => {
                setTasks(
                    tasks.map((task) =>
                        task._id === id ? response.data : task
                    )
                );
            })
            .catch((error) => {
                console.error("Error updating task:", error);
            });
    };

    const handleDeleteTask = (id: string) => {
        axios
            .delete(`http://localhost:3001/api/tasks/${id}`)
            .then(() => {
                setTasks(tasks.filter((task) => task._id !== id));
            })
            .catch((error) => {
                console.error("Error deleting task:", error);
            });
    };

    const handleEditTask = (task: ITask) => {
        navigate("/tasks/edit", {
            state: {
                todo: {
                    id: task._id,
                    title: task.title,
                    notes: task.notes,
                    dueDate: task.dueDate,
                    completed: task.completed,
                },
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
                                    onClick={() => handleDeleteTask(task._id)}
                                >
                                    <Trash2 size={18} />
                                </IconButton>
                            </div>
                        }
                    >
                        <Checkbox
                            checked={task.completed}
                            onChange={() =>
                                handleToggleComplete(task._id, task.completed)
                            }
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
                            style={{
                                textDecoration: task.completed
                                    ? "line-through"
                                    : "none",
                            }}
                        />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
}

export default TodoList;
