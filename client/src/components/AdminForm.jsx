import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Navbar from "../screens/navbar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const addAdminSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const removeAdminSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const initialValuesAddAdmin = {
  email: "",
  password: "",
};

const initialValuesRemoveAdmin = {
  email: "",
};

const AdminForm = () => {
  const [formType, setFormType] = useState("add"); // "add" or "remove"
  const { palette } = useTheme();
  const theme = useTheme();
  const token = useSelector((state) => state.auth.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

const addAdmin = async (values, onSubmitProps) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_Backend_URL}/admin/addAdmin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      }
    );

    // Check if the response status is OK (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();

    if (json.success) {
      onSubmitProps.resetForm();
      toast.success(json.message);
    } else {
      toast.error(json.message);
    }
  } catch (err) {
    console.error("Error details:", err); // Log error details for debugging
    toast.error("An error occurred: " + err.message);
  }
};

const removeAdmin = async (values, onSubmitProps) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_Backend_URL}/admin/removeAdmin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      }
    );

    // Check if the response status is OK (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();

    if (json.success) {
      onSubmitProps.resetForm();
      toast.success(json.message);
    } else {
      toast.error(json.message);
    }
  } catch (err) {
    console.error("Error details:", err); // Log error details for debugging
    toast.error("An error occurred: " + err.message);
  }
};

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (formType === "add") await addAdmin(values, onSubmitProps);
    if (formType === "remove") await removeAdmin(values, onSubmitProps);
  };

  return (
    <Box>
      <Navbar />
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        {formType === "add" && (
          <Typography
            fontWeight="500"
            variant="h5"
            sx={{ mb: "1.5rem", textAlign: "center" }}
          >
            Add Admin
          </Typography>
        )}
        {formType === "remove" && (
          <Typography
            fontWeight="500"
            variant="h5"
            sx={{ mb: "1.5rem", textAlign: "center" }}
          >
            Remove Admin
          </Typography>
        )}

        <Formik
          onSubmit={handleFormSubmit}
          initialValues={
            formType === "add"
              ? initialValuesAddAdmin
              : initialValuesRemoveAdmin
          }
          validationSchema={
            formType === "add" ? addAdminSchema : removeAdminSchema
          }
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            resetForm,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="20px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{ "& > div": { gridColumn: "span 4" } }}
              >
                {formType === "add" && (
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
                      error={
                        Boolean(touched.password) && Boolean(errors.password)
                      }
                      helperText={touched.password && errors.password}
                      sx={{ gridColumn: "span 4" }}
                    />
                  </>
                )}

                {formType === "remove" && (
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
                )}
              </Box>

              {/* BUTTONS */}
              <Box>
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
                  {formType === "add" ? "Add Admin" : "Remove Admin"}
                </Button>

                <Typography
                  component={Link}
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setFormType(formType === "add" ? "remove" : "add");
                    resetForm();
                  }}
                  sx={{
                    display: "block",
                    textAlign: "center",
                    textDecoration: "underline",
                    color: palette.primary.main,
                    marginTop: "1rem",
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                >
                  Switch to {formType === "add" ? "Remove Admin" : "Add Admin"}
                </Typography>
              </Box>

              <ToastContainer />
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default AdminForm;
