import { Box } from "@mui/material";
import { styled } from "@mui/system";

//creating a custom styled component to reuse multiple time 
const FlexBetween = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export default FlexBetween;
