import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup"; // yup is a JavaScript library for object schema validation.
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin, setAdmin } from "../../state";
import Loading from "../../components/Loading";

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const initialValuesLogin = {
  email: "",
  password: "",
};

const AdminForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async (values, onSubmitProps) => {
    setIsSubmitting(true);
    const loggedInResponse = await fetch(
      `${process.env.REACT_APP_Backend_URL}/auth/adminlogin`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }
    );
    const json = await loggedInResponse.json();

    if (json.success) {
      dispatch(
        setAdmin({
          admin: json.admin,
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
    await login(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValuesLogin}
      validationSchema={loginSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box display="grid" gap="30px">
            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
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
            />
          </Box>

          <Button
            fullWidth
            type="submit"
            sx={{
              mt: "2rem",
              p: "1rem",
              backgroundColor: palette.primary.main,
              color: palette.background.alt,
              "&:hover": { color: palette.primary.main },
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loading /> : "LOGIN"}
          </Button>

          <ToastContainer />
        </form>
      )}
    </Formik>
  );
};

export default AdminForm;
