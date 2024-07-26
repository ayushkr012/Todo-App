import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Paper, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import { setTasks } from "../../state";

const TaskList = ({ setTaskToEdit, setEditMode }) => {
  const dispatch = useDispatch();
  const { tasks = [], user, token } = useSelector((state) => state.auth);

  // fetch all tasks for the particular user
  const getTasks = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_Backend_URL}/task/${user._id}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setTasks({ tasks: data.tasks }));
  };

  useEffect(() => {
    getTasks();
  }, []);

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_Backend_URL}/task/${taskId}/${user._id}`,
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
      {tasks.map((task) => (
        <Paper
          key={task._id}
          sx={{
            padding: "1rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h6">{task.title}</Typography>
            <Typography variant="body2">{task.description}</Typography>
            <Typography variant="body2">Status: {task.status}</Typography>
          </Box>
          <Box>
            <IconButton onClick={() => handleEdit(task)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDelete(task._id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default TaskList;
