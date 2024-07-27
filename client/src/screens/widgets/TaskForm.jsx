import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextField, Button, Box, MenuItem } from "@mui/material";
import { setTasks } from "../../state";
import { toast } from "react-toastify";

const TaskForm = ({ task, setEditMode, setTaskToEdit }) => {
  const [title, setTitle] = useState(task ? task.title : "");
  const [description, setDescription] = useState(task ? task.description : "");
  const [status, setStatus] = useState(task ? task.status : "Pending");
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (task) {
      // If task is provided, pre-fill the form
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
    } else {
      // Clear form if no task is provided
      setTitle("");
      setDescription("");
      setStatus("Pending");
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      const taskData = { title, description, status, userId: user._id };

      if (task) {
        // Update existing task
        response = await fetch(
          `${process.env.REACT_APP_Backend_URL}/task/${task._id}/${user._id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
          }
        );
      } else {
        // Create new task
        response = await fetch(
          `${process.env.REACT_APP_Backend_URL}/task/createTask`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
          }
        );
      }

      const data = await response.json();
      if (data.success) {
        dispatch(setTasks({ tasks: data.tasks }));
        setTitle("");
        setDescription("");
        setStatus("Pending");
        toast.success(
          task ? "Task updated successfully" : "Task created successfully",
          { autoClose: 500 }
        );
        if (task) {
          setTaskToEdit(null);
          setEditMode(false);
        } // Exit edit mode after updating
      } else {
        toast.error("Failed to save task", { autoClose: 500 });
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to save task", { autoClose: 500 });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={4} // You can adjust the number of rows as needed
      />

      <TextField
        select
        label="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <MenuItem value="Pending">Pending</MenuItem>
        <MenuItem value="in-Progress">In Progress</MenuItem>
        <MenuItem value="Completed">Completed</MenuItem>
      </TextField>
      <Button type="submit" variant="contained" color="primary">
        {task ? "Update Task" : "Create Task"}
      </Button>
    </Box>
  );
};

export default TaskForm;
