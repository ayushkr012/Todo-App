import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup"; // yup is a JavaScript library for object schema validation.
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "../../state";
import Dropzone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";
import Loading from "../../components/Loading";
import WidgetWrapper from "../../components/WidgetWrapper";

import CloudinaryUploader from "../../components/CloudinaryUploader";

// yup It allows you to define a schema for an object and then validate that object against the specified schema.
const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const otpLoginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const enterOtpSchema = yup.object().shape({
  otp: yup.string().required("OTP is required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const initialValuesOtpLogin = {
  email: "",
};

const initialValuesEnterOtp = {
  otp: "",
};

const Form = () => {
  const [userEmail, setUserEmail] = useState("");
  const [pageType, setPageType] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const isOtpLogin = pageType === "otp";
  const isEnterOtp = pageType == "enterOtp";

  // Initialize CloudinaryUploader
  const cloudinaryUploader = CloudinaryUploader();

  const handleOtpLogin = () => {
    // when user clink on login with otp set pageType to otp
    setPageType("otp");
  };

  const SendOtp = async (values, onSubmitProps) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(
        `${process.env.REACT_APP_Backend_URL}/auth/sendotp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
          }),
        }
      );

      const json = await response.json();
      if (json.success) {
        toast.success(json.message);
        setUserEmail(values.email);
        setIsSubmitting(false);
        setPageType("enterOtp");
        // setTimeout(()=>setPageType("enterOtp"),1000)
      } else {
        toast.error(json.message);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.log(err);
      toast.error(err);
      setIsSubmitting(false);
    }
  };

  const enterOtp = async (values, onSubmitProps) => {
    setIsSubmitting(true);
    const response = await fetch(
      `${process.env.REACT_APP_Backend_URL}/auth/verifyotp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          otp: values.otp,
        }),
      }
    );
    const json = await response.json();
    if (json.success) {
      dispatch(
        setLogin({
          // when we have to pass as a payload we use an object and pass the data as a key value pair
          user: json.user,
          token: json.token,
        })
      );
      toast.success(json.message);
      setIsSubmitting(false);
      navigate("/home");
      // setTimeout(() => navigate("/home"), 1000); // navigate to home after 1 seconds
    } else {
      toast.error(json.message);
      setIsSubmitting(false);
    }
  };

  const register = async (values, onSubmitProps) => {
    setIsSubmitting(true);

    let imgUrl = null;

    // Upload image if available
    if (values.picture != null) {
      // Get signature for Image upload
      const { timestamp: imgTimestamp, signature: imgSignature } =
        await cloudinaryUploader.getSignatureForUpload("images");
      console.log("imgTimestamp", imgTimestamp, "imgSignature", imgSignature);
      // Upload image file
      imgUrl = await cloudinaryUploader.uploadFile(
        values.picture,
        "image",
        imgTimestamp,
        imgSignature
      );
    }

    const savedUserResponse = await fetch(
      `${process.env.REACT_APP_Backend_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          imgUrl: imgUrl,
        }),
      }
    );
    const json = await savedUserResponse.json();

    if (json.success) {
      toast.success(json.message);
      setIsSubmitting(false);
      // setTimeout(() => setPageType("login"), 1000);
      setPageType("login");
    } else {
      toast.error(json.message);
      setIsSubmitting(false);
    }
  };

  const login = async (values, onSubmitProps) => {
    setIsSubmitting(true);
    const loggedInResponse = await fetch(
      `${process.env.REACT_APP_Backend_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }
    );
    const json = await loggedInResponse.json();

    if (json.success) {
      dispatch(
        setLogin({
          // when we have to pass as a payload we use an object and pass the data as a key value pair
          user: json.user,
          token: json.token,
        })
      );
      toast.success(json.message);
      setIsSubmitting(false);
      navigate("/home");
    } else {
      toast.error(json.message);
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
    if (isOtpLogin) await SendOtp(values, onSubmitProps);
    if (isEnterOtp) await enterOtp(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={
        isLogin
          ? initialValuesLogin
          : isOtpLogin
          ? initialValuesOtpLogin
          : isEnterOtp
          ? initialValuesEnterOtp
          : isRegister
          ? initialValuesRegister
          : ""
      }
      validationSchema={
        isLogin
          ? loginSchema
          : isOtpLogin
          ? otpLoginSchema
          : isEnterOtp
          ? enterOtpSchema
          : isRegister
          ? registerSchema
          : ""
      }
    >
      {/*   {()=>()}   */}
      {/*   {(  { here inside we pass the props }  )=>()} */}
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" }, // for smaller screens it will take 4 columns
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }} // for larger screens it will take 2 columns
                  required
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                  required
                />
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  required
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Password"
                  type="password"
                  required
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />

                {/* user profile image upload */}
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone // for image upload we use Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={
                      (acceptedFiles) =>
                        setFieldValue("picture", acceptedFiles[0]) // set the value of picture to the first file
                    }
                  >
                    {/* {({props1,props2})=>()}  call back function */}

                    {(
                      { getRootProps, getInputProps } // getRootProps and getInputProps are the props that we get from Dropzone
                    ) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Upload your Profile Picture</p>
                        ) : (
                          <Box
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "0.9rem", // Add some gap between image and icon
                              // Add any other styles you want for the Box container
                            }}
                          >
                            <img
                              width="100px" // Increase width
                              height="100px" // Increase height
                              alt="post"
                              style={{
                                objectFit: "cover",
                                borderRadius: "50%",
                              }}
                              src={URL.createObjectURL(values.picture)}
                            />
                            <EditOutlinedIcon />{" "}
                            {/* No need for extra styling */}
                          </Box>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
                
              </>
            )}

            {isLogin && (
              <>
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
              </>
            )}

            {isOtpLogin && (
              <>
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4", mb: "0vh", mt: "10vh" }}
                />
              </>
            )}

            {isEnterOtp && (
              <>
                <TextField
                  label="OTP"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.otp}
                  name="otp"
                  error={Boolean(touched.otp) && Boolean(errors.otp)}
                  helperText={touched.otp && errors.otp}
                  sx={{ gridColumn: "span 4", mb: "0vh", mt: "10vh" }}
                />
              </>
            )}
          </Box>

          {/* BUTTONS */}
          <Box>
            {isSubmitting ? (
              <WidgetWrapper>
                <Loading />
              </WidgetWrapper>
            ) : (
              <Button
                fullWidth
                type="submit"
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { color: palette.primary.main },
                }}
              >
                {isLogin
                  ? "LOGIN"
                  : isOtpLogin || isEnterOtp
                  ? "Submit"
                  : "REGISTER"}
              </Button>
            )}

            {isLogin ? (
              <FlexBetween>
                <FlexBetween>
                  <Typography>Don't have an account?</Typography>
                  <Typography
                    onClick={() => {
                      setPageType("register");
                      resetForm();
                    }}
                    sx={{
                      textDecoration: "underline",
                      color: palette.primary.main,
                      marginLeft: "1rem",
                      "&:hover": {
                        cursor: "pointer",
                        // color: palette.primary.main,
                      },
                    }}
                  >
                    Sign Up here.
                  </Typography>
                </FlexBetween>
                {isLogin && (
                  <Button onClick={handleOtpLogin}>Login with OTP</Button>
                )}
              </FlexBetween>
            ) : isOtpLogin || isEnterOtp ? (
              <FlexBetween>
                <FlexBetween>
                  <Typography>Don't have an account?</Typography>
                  <Typography
                    onClick={() => {
                      setPageType("register");
                      resetForm();
                    }}
                    sx={{
                      textDecoration: "underline",
                      color: palette.primary.main,
                      marginLeft: "1rem",
                      "&:hover": {
                        cursor: "pointer",
                        // color: palette.primary.light,
                      },
                    }}
                  >
                    Sign Up here.
                  </Typography>
                </FlexBetween>
              </FlexBetween>
            ) : (
              <FlexBetween>
                <FlexBetween>
                  <Typography>Already have an account?</Typography>
                  <Typography
                    onClick={() => {
                      setPageType("login");
                      resetForm();
                    }}
                    sx={{
                      textDecoration: "underline",
                      color: palette.primary.main,
                      marginLeft: "1rem",
                      "&:hover": {
                        cursor: "pointer",
                        // color: palette.primary.light,
                      },
                    }}
                  >
                    Login here.
                  </Typography>
                </FlexBetween>
              </FlexBetween>
            )}
          </Box>

          <ToastContainer />
        </form>
      )}
    </Formik>
  );
};

export default Form;
