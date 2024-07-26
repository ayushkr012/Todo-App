import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "./screens/homePage";
import LoginPage from "./screens/loginPage";

//useMemo is a React Hook that lets you cache the result of a calculation between re-renders.
import { useMemo } from "react";
// useSelector is a hook provided by React Redux that allows functional components to extract and access data from the Redux store
import { useSelector } from "react-redux";
// material-UI provides a ThemeProvider component that you can use to apply the theme to your entire application or specific parts of it.
import { CssBaseline, ThemeProvider } from "@mui/material";
// createTheme is used to create a theme object that can be used to customize the styling of components within a Material-UI application.
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
function App() {
  const mode = useSelector((state) => state.auth.mode); // initial it set to the dark mode
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}
//  the App component and its descendants will have access to the styles defined in the theme.
export default App;
