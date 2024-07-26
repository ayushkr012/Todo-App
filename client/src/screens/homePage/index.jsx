import React, { useState } from "react";
import { Box, useMediaQuery, useTheme, Typography } from "@mui/material";
import Navbar from "../navbar";
import TaskForm from "../widgets/TaskForm";
import TaskList from "../widgets/TaskList";
import { ToastContainer } from "react-toastify";
import WidgetWrapper from "../../components/WidgetWrapper";
import UserListWidget from "../widgets/UserListWidget";
import { useSelector } from "react-redux";
import FlexBetween from "../../components/FlexBetween";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { palette } = useTheme();
  const [editMode, setEditMode] = useState(false);
  const [userId, setUserId] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState("All");

  // Access the auth state
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const mode = useSelector((state) => state.auth.mode);
  const admin = useSelector((state) => state.auth.admin);

  // Ensure user exists before rendering
  if (!user && !admin) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  // middle up section part filter menu styling
  const BoxStyle = {
    padding: "0.8rem",
    borderRadius: "1rem",
    border: "1px solid",
    transition: "background-color 0.3s ease",
  };

  const BoxHoverStyle = {
    ...BoxStyle,
    "&:hover": {
      backgroundColor:
        mode == "dark" ? palette.primary.dark : palette.primary.light,
      cursor: "pointer",
      color: "black",
    },
  };

  const BoxActiveStyle = {
    ...BoxStyle,
    backgroundColor: "darkgreen",
    color: "white",
  };
  const MenuItem = ({ text, isActive, onClick }) => {
    const boxStyle = isActive ? BoxActiveStyle : BoxHoverStyle;

    return (
      <Box sx={boxStyle} onClick={onClick} ml="1rem">
        <Typography fontWeight="500">{text}</Typography>
      </Box>
    );
  };

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
        {/* -------------------> Left part of the home screen ------------------------< */}
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <WidgetWrapper>
            {admin ? null : (
              <Typography variant="h5" gutterBottom>
                Welcome {user.firstName} {user.lastName}
              </Typography>
            )}
            {admin ? ( // pass the data to the UserListWidget.jsx
              <UserListWidget setUserId={setUserId} />
            ) : (
              <TaskForm // pass the data to the TaskForm.jsx
                task={taskToEdit}
                setEditMode={setEditMode}
                setTaskToEdit={setTaskToEdit}
              />
            )}
          </WidgetWrapper>
        </Box>

        {/*------------------------------> Middle part of the home screen ------------------------<*/}
        <Box
          flexBasis={isNonMobileScreens ? "50%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {isNonMobileScreens ? (
            // when the screen is not mobile
            <WidgetWrapper>
              <FlexBetween>
                <FlexBetween>
                  <MenuItem
                    text="All"
                    isActive={activeMenuItem === "All"}
                    onClick={() => setActiveMenuItem("All")}
                  />
                  <MenuItem
                    text="Pending"
                    isActive={activeMenuItem === "Pending"}
                    onClick={() => setActiveMenuItem("Pending")}
                  />
                  <MenuItem
                    text="in-Progress"
                    isActive={activeMenuItem === "in-Progress"}
                    onClick={() => setActiveMenuItem("in-Progress")}
                  />
                  <MenuItem
                    text="Completed"
                    isActive={activeMenuItem === "Completed"}
                    onClick={() => setActiveMenuItem("Completed")}
                  />
                </FlexBetween>
              </FlexBetween>
            </WidgetWrapper>
          ) : (
            // when the screen is mobile
            <WidgetWrapper>
              <FlexBetween sx={{ flexWrap: "wrap" }}>
                {/* <FlexBetween> */}
                <MenuItem
                  text="All"
                  isActive={activeMenuItem === "All"}
                  onClick={() => setActiveMenuItem("All")}
                />
                <MenuItem
                  text="Pending"
                  isActive={activeMenuItem === "Pending"}
                  onClick={() => setActiveMenuItem("Pending")}
                />
                <MenuItem
                  text="in-Progress"
                  isActive={activeMenuItem === "in-Progress"}
                  onClick={() => setActiveMenuItem("in-Progress")}
                />
                <MenuItem
                  text="Completed"
                  isActive={activeMenuItem === "Completed"}
                  onClick={() => setActiveMenuItem("Completed")}
                />
                {/* </FlexBetween> */}
              </FlexBetween>
            </WidgetWrapper>
          )}

          <WidgetWrapper sx={{ mt: "2%" }}>
            <TaskList
              setEditMode={setEditMode}
              setTaskToEdit={setTaskToEdit}
              activeMenuItem={activeMenuItem}
              userId={userId} // when admin login then we pass the userId to get the task of particular user Each Time
            />
          </WidgetWrapper>
        </Box>

        {/* --------------------------> Right part of the home screen  ---------------------------< */}
        <Box flexBasis={isNonMobileScreens ? "15%" : undefined}></Box>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default HomePage;
