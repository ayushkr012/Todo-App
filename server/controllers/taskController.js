import Task from "../models/Task.js";

/* Create a new task */
export const createTask = async (req, res) => {
  try {
    const { title, description, status, userId } = req.body;
    const task = new Task({ title, description, status, userId });
    await task.save();

    // Return all tasks for the user
    const tasks = await Task.find({ userId });
    res.status(201).json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* Retrieve all tasks for all users. */
export const getAllUserTask = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* Retrieve all tasks for particular User */
export const getParticularUsertask = async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await Task.find({ userId });
    res.status(200).json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


/* Update Task */
export const updateTask = async (req, res) => {
  try {
    const { id, userId } = req.params; 

    // Extract and validate fields to be updated
    const { title, description, status } = req.body;

    // Find the task by ID
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Update fields if present
    if (title) {
      task.title = title;
    }
    if (description) {
      task.description = description;
    }
    if (status && ["Pending", "in-Progress", "Completed"].includes(status)) {
      task.status = status;
    }

    // Save the updated task
    await task.save();

    // Return all tasks for the user after updating the task
    const tasks = await Task.find({ userId });

    res.status(200).json({ success: true, task, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


/* Delete Task */
export const deleteTask = async (req, res) => {
  try {
    const { id, userId } = req.params; 

    // Find and delete the task by ID
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Fetch all tasks for the specified user after deletion
    const tasks = await Task.find({ userId });

    res.status(200).json({ success: true, message: "Task deleted successfully", tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// // Get a single task by ID
// export const getTaskById = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Task not found" });
//     }
//     res.status(200).json({ success: true, task });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
