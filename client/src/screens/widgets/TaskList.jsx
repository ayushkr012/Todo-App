import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Paper, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { setTasks } from "../../state";

const TaskList = ({ setTaskToEdit, setEditMode, activeMenuItem, userId }) => {
  const dispatch = useDispatch();
  const { tasks = [], user, admin, token } = useSelector((state) => state.auth);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const tempId = userId || (user && user._id);

  // Fetch all tasks for the particular user
  const getTasks = async (tempId) => {
    const response = await fetch(
      `${process.env.REACT_APP_Backend_URL}/task/${tempId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    if (data.success) {
      dispatch(setTasks({ tasks: data.tasks }));
    } else {
      toast.error("Failed to fetch tasks", { autoClose: 500 });
    }
  };

  useEffect(() => {
    if (tempId) {
      getTasks(tempId);
    }
  }, [tempId]);

  useEffect(() => {
    // Filter tasks based on activeMenuItem
    let filtered = tasks;
    if (activeMenuItem === "Pending") {
      filtered = tasks.filter((task) => task.status === "Pending");
    } else if (activeMenuItem === "in-Progress") {
      filtered = tasks.filter((task) => task.status === "in-Progress");
    } else if (activeMenuItem === "Completed") {
      filtered = tasks.filter((task) => task.status === "Completed");
    }
    setFilteredTasks(filtered);
  }, [activeMenuItem, tasks]);

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_Backend_URL}/task/${taskId}/${
          user ? user._id : userId
        }`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        dispatch(setTasks({ tasks: data.tasks }));
        toast.success("Task deleted successfully", { autoClose: 500 });
      } else {
        toast.error("Failed to delete task", { autoClose: 500 });
        console.error("Error:", data.message);
      }
    } catch (error) {
      toast.error("Failed to delete task", { autoClose: 500 });
      console.error("Error:", error);
    }
  };

  const handleEdit = (task) => {
    setTaskToEdit(task);
    setEditMode(true);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {filteredTasks.length > 0 ? (
        filteredTasks.map((task) => (
          <Paper
            key={task._id}
            sx={{
              padding: "1rem",
              display: "flex",
              justifyContent: "space-between",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <Box>
              <Typography variant="h6">{task.title}</Typography>
              <Typography variant="body2">{task.description}</Typography>
              <Typography variant="body2">Status: {task.status}</Typography>
            </Box>
            <Box>
              {!admin && (
                <IconButton onClick={() => handleEdit(task)}>
                  <EditIcon />
                </IconButton>
              )}
              <IconButton onClick={() => handleDelete(task._id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Paper>
        ))
      ) : (
        <Typography
          variant="body2"
          textAlign="center"
          sx={{
            color: "text.secondary",
            fontSize: "1rem",
            margin: "2rem 0",
            fontWeight: "bold",
          }}
        >
          No tasks available
        </Typography>
      )}
    </Box>
  );
};

export default TaskList;
