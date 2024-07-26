import React, { useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
  Button,
} from "@mui/material";
import { RotatingLines } from "react-loader-spinner";
import Form from "./Form";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogin } from "../../state";
import { toast } from "react-toastify";
import AdminForm from "./AdminForm";
import FlexBetween from "../../components/FlexBetween";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isadmin, setIsadmin] = useState(false);

  const responseSuccessGoogle = (response) => {
    setLoading(true);
    const details = jwtDecode(response.credential);
    axios(`${process.env.REACT_APP_Backend_URL}/auth/googlelogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        tokenId: response.credential, // passed the Google ID token
      },
    })
      .then((res) => {
        const { user, token, message } = res.data;
        dispatch(
          setLogin({
            user: user,
            token: token,
          })
        );
        toast.success(message);
        navigate("/home");
      })
      .catch((err) => {
        toast.error("Error logging in");
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const responseErrorGoogle = (response) => {
    console.log(response);
    toast.error("Error in Google Login");
  };

  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <FlexBetween>
          <Typography
            fontWeight="bold"
            fontSize="32px"
            color="primary"
            sx={{ cursor: "pointer" }}
            onClick={() => {
              setIsadmin(false);
              navigate("/");
            }}
          >
            Todo App
          </Typography>

          <FlexBetween>
            <Button
              fontWeight="bold"
              fontSize="32px"
              color="primary"
              onClick={() => {
                setIsadmin(false);
              }}
            >
              User
            </Button>
            <Button
              fontWeight="bold"
              fontSize="32px"
              color="primary"
              onClick={() => {
                setIsadmin(true);
              }}
            >
              Admin
            </Button>
          </FlexBetween>
        </FlexBetween>
      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography
          fontWeight="500"
          variant="h5"
          sx={{ mb: "1.5rem", textAlign: "center" }}
        >
          Welcome Back to Todo App! Let's Get Things Done!
        </Typography>

        {isadmin ? <AdminForm /> : <Form setIsadmin={setIsadmin} />}

        {!isadmin && (
          <>
            <Divider
              sx={{
                my: "1.5rem",
                borderColor: theme.palette.primary.main,
                borderWidth: 1,
              }}
            />

            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              width={isNonMobileScreens ? "50%" : "93%"}
              // p="1rem"
              m="auto"
              borderRadius="1.5rem"
              backgroundColor={theme.palette.background.alt}
            >
              <GoogleOAuthProvider clientId="97747057830-6oqoosdc81g9ag6lu4hvsh9pcd08ajru.apps.googleusercontent.com">
                {loading ? (
                  <Box
                    position="fixed"
                    top="50%"
                    left="50%"
                    sx={{
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <RotatingLines
                      visible={true}
                      height="96"
                      width="96"
                      color="grey"
                      strokeWidth="5"
                      animationDuration="0.75"
                      ariaLabel="rotating-lines-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </Box>
                ) : (
                  <GoogleLogin
                    onSuccess={responseSuccessGoogle}
                    onError={responseErrorGoogle}
                  />
                )}
              </GoogleOAuthProvider>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default LoginPage;
