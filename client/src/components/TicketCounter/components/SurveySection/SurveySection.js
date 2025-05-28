import React from "react";
import { Box, Paper, Typography, Grid } from "@mui/material";
import PropTypes from "prop-types";

export const SurveySection = ({ csatCount, dsatCount }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Paper
            sx={{
              p: 2,
              background: "linear-gradient(45deg, #4CAF50 30%, #81C784 90%)",
              color: "white",
              boxShadow: "0 3px 5px 2px rgba(76, 175, 80, .3)",
            }}
          >
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                CSAT Count
              </Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>
                {csatCount}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper
            sx={{
              p: 2,
              background: "linear-gradient(45deg, #f44336 30%, #e57373 90%)",
              color: "white",
              boxShadow: "0 3px 5px 2px rgba(244, 67, 54, .3)",
            }}
          >
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                DSAT Count
              </Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>
                {dsatCount}
              </Typography>
            </Box>
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
