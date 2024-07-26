import { DeleteOutline, ArrowForward } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setUsers, setTasks } from "../state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const UserList = ({ name, userPicturePath, setUserId, userId }) => {
  const dispatch = useDispatch();
  const { token, users = [] } = useSelector((state) => state.auth);
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const mode = useSelector((state) => state.auth.mode);

  const handleClick = async () => {
    setUserId(userId);
  };

  /* delete user */
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_Backend_URL}/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        dispatch(setUsers({ users: data.users }));
        dispatch(setTasks({ tasks: [] })); // we set the tasks array to empty array after deleting the user
        toast.success("User deleted successfully", { autoClose: 500 });
      } else {
        toast.error("Failed to delete user", { autoClose: 500 });
        console.error("Error:", data.message);
      }
    } catch (error) {
      toast.error("Failed to delete user", { autoClose: 500 });
      console.error("Error:", error);
    }
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box onClick={handleClick}>
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color:
                  mode === "dark" ? palette.text.primary : palette.text.primary,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
        </Box>
      </FlexBetween>
      <FlexBetween gap="1rem">
        <IconButton onClick={handleClick} sx={{ color: "green" }}>
          <ArrowForward />
        </IconButton>
        <IconButton onClick={handleDelete} sx={{ color: palette.error.main }}>
          <DeleteOutline />
        </IconButton>
      </FlexBetween>
    </FlexBetween>
  );
};

export default UserList;
