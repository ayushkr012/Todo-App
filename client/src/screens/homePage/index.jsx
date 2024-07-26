import { Box, useMediaQuery, useTheme } from "@mui/material";
import Navbar from "../navbar";
// import CreatePost from "../widgets/CreatePost";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id } = useSelector((state) => state.user);
  const { palette } = useTheme();
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
          scrollbarWidth: "0px",
          scrollbarColor: `${palette.primary.main} ${palette.background.default}`, // Set scrollbar color
        }}
      >
        {/*  left part of the home screen */}
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>Hii Ayush</Box>

        {/*  middle part of the home screen */}
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {/* <CreatePost userId={_id} picturePath={picturePath} /> */}
        </Box>

        {/*  right part of the home screen */}
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}></Box>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default HomePage;
