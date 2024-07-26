import React, { useState } from "react";
import { Box, useMediaQuery, useTheme, Typography } from "@mui/material";
import Navbar from "../navbar";
import TaskForm from "../widgets/TaskForm";
import TaskList from "../widgets/TaskList";
import { ToastContainer } from "react-toastify";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useSelector } from "react-redux";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { palette } = useTheme();
  const [editMode, setEditMode] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Access the auth state
  const user = useSelector((state) => state.auth.user);

  console.log("State:", { user });

  // Ensure user exists before rendering
  if (!user) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
        sx={{
          maxHeight: "100vh",
          overflowY: "auto",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "0.4em",
          },
          "&::-webkit-scrollbar-track": {
            boxShadow: `inset 0 0 6px ${palette.background.default}`,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: palette.primary.main,
            borderRadius: "4px",
          },
        }}
      >
        {/* Left part of the home screen */}
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <WidgetWrapper>
            <Typography variant="h5" gutterBottom>
              Welcome {user.firstName} {user.lastName}
            </Typography>
            <TaskForm task={taskToEdit} setEditMode={setEditMode} setTaskToEdit={setTaskToEdit} />
          </WidgetWrapper>
        </Box>

        {/* Middle part of the home screen */}
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <WidgetWrapper>
            <TaskList setEditMode={setEditMode} setTaskToEdit={setTaskToEdit} />
          </WidgetWrapper>
        </Box>

        {/* Right part of the home screen */}
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}></Box>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default HomePage;
