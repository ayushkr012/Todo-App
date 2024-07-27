import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";
import { Search, DarkMode, LightMode, Menu, Close } from "@mui/icons-material";

// useDispatch is a hook provided by the React Redux library that allows you to dispatch actions to the Redux store.
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "../../state";
import { Link, useNavigate } from "react-router-dom";
import FlexBetween from "../../components/FlexBetween";

export default function Navbar() {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, admin, mode } = useSelector((state) => state.auth);

  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const alt = theme.palette.background.alt;

  let fullName;
  if (user) {
    fullName = `${user.firstName} ${user.lastName}`;
  } else if (admin) {
    fullName = `${admin.firstName} ${admin.lastName}`;
  }
  // const fullName = "Ayush Kumar";

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              color: theme.palette.primary.dark,
              cursor: "pointer",
            },
          }}
        >
          Todo App
        </Typography>
        {/* <Link
          to="/watchedMovie"
          style={{
            textDecoration: "none",
            color: mode == "dark" ? "white" : "black",
          }}
          sx={{
            "&:hover": {
              color: theme.palette.primary.dark,
              cursor: "pointer",
            },
          }}
        >
          Watched
        </Link>
        <Link
          to="/unwatchedMovie"
          style={{
            textDecoration: "none",
            color: mode == "dark" ? "white" : "black",
          }}
          sx={{
            "&:hover": {
              color: theme.palette.primary.dark,
              cursor: "pointer",
            },
          }}
        >
          Unwatched
        </Link> */}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          {admin && admin.superAdmin && (
            <Link
              to="/manageAdmin"
              style={{
                textDecoration: "none",
                color: mode == "dark" ? "white" : "black",
              }}
              sx={{
                "&:hover": {
                  color: theme.palette.primary.dark,
                  cursor: "pointer",
                },
              }}
            >
              Managed Admin
            </Link>
          )}

          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>

          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  dispatch(setLogout());
                  navigate("/");
                }}
              >
                Log Out
              </MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            
            {admin && admin.superAdmin && (
              <Link
                to="/manageAdmin"
                style={{
                  textDecoration: "none",
                  color: mode == "dark" ? "white" : "black",
                }}
                sx={{
                  "&:hover": {
                    color: theme.palette.primary.dark,
                    cursor: "pointer",
                  },
                }}
              >
                Managed Admin
              </Link>
            )}

            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    dispatch(setLogout());
                    navigate("/");
                  }}
                >
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
}
