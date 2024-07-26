import { Box, Typography, useTheme } from "@mui/material";
import UserList from "../../components/UserList";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../../state";
import { Divider } from "@mui/material";

// props data came from the HomePage/index.jsx
const UserListWidget = ({ setUserId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const { users = [], token } = useSelector((state) => state.auth);

  const getUsers = async () => {
    const response = await fetch(`${process.env.REACT_APP_Backend_URL}/users`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setUsers({ users: data.users }));
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Users List
      </Typography>
      <Divider sx={{ mb: "1.5rem" }} />
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {Array.isArray(users) &&
          users.map((user, index) => (
            <UserList
              key={`${user.userId}_${index}`}
              userId={user._id}
              name={`${user.firstName} ${user.lastName}`}
              userPicturePath={user.picturePath}
              setUserId={setUserId}
            />
          ))}
        {users.length === 0 && (
          <Typography color={palette.neutral.medium}>
            It looks like No any users exist.
          </Typography>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default UserListWidget;
