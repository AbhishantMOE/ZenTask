import React from "react";
import { Box, Paper, Typography, Grid } from "@mui/material";
import PropTypes from "prop-types";

export const SurveySection = ({ csatCount, dsatCount }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper
            sx={{
              p: 1.5,
              background: "linear-gradient(45deg, #4CAF50 30%, #81C784 90%)",
              color: "white",
              boxShadow: "0 2px 4px rgba(76, 175, 80, .3)",
              borderRadius: "8px",
              minWidth: "120px",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              CSAT
            </Typography>
            <Typography variant="h6" sx={{ mt: 0.5 }}>
              {csatCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper
            sx={{
              p: 1.5,
              background: "linear-gradient(45deg, #f44336 30%, #e57373 90%)",
              color: "white",
              boxShadow: "0 2px 4px rgba(244, 67, 54, .3)",
              borderRadius: "8px",
              minWidth: "120px",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              DSAT
            </Typography>
            <Typography variant="h6" sx={{ mt: 0.5 }}>
              {dsatCount}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

SurveySection.propTypes = {
  csatCount: PropTypes.number.isRequired,
  dsatCount: PropTypes.number.isRequired,
};
