import React from "react";
import { Paper, Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

const getBgColor = (priority) => {
  switch (priority) {
    case "urgent":
      return "#ffebee";
    case "high":
      return "#fff3e0";
    case "normal":
      return "#e8f5e9";
    case "low":
      return "#e3f2fd";
    default:
      return "#ffffff";
  }
};

export const PriorityCard = ({ priority, count, icon }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        textAlign: "center",
        bgcolor: getBgColor(priority),
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1,
        }}
      >
        {icon}
        <Typography
          variant="subtitle1"
          sx={{
            ml: 1,
            textTransform: "uppercase",
            fontWeight: 600,
            letterSpacing: "0.5px",
          }}
        >
          {priority}
        </Typography>
      </Box>
      <Typography variant="h4">{count}</Typography>
    </Paper>
  );
};

PriorityCard.propTypes = {
  priority: PropTypes.oneOf(["urgent", "high", "normal", "low"]).isRequired,
  count: PropTypes.number.isRequired,
  icon: PropTypes.element.isRequired,
};
