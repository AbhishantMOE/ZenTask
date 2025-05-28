import { styled } from "@mui/material/styles";
import { Container, Paper } from "@mui/material";

export const StyledContainer = styled(Container)({
  "& .MuiPaper-root": {
    borderRadius: "12px",
  },
});

export const StyledPaper = styled(Paper)({
  padding: "2rem",
  background: "linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)",
});
