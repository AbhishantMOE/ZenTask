import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const Survey = ({ startDate, endDate }) => {
  const [csatCount, setCsatCount] = useState(0);
  const [dsatCount, setDsatCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      if (!startDate || !endDate) return;
      
      try {
        const [csatResponse, dsatResponse] = await Promise.all([
          fetch(`http://localhost:5000/getSurveyCount?startDate=${startDate}&endDate=${endDate}&type=csat`),
          fetch(`http://localhost:5000/getSurveyCount?startDate=${startDate}&endDate=${endDate}&type=dsat`)
        ]);

        const csatData = await csatResponse.json();
        const dsatData = await dsatResponse.json();

        setCsatCount(csatData.count);
        setDsatCount(dsatData.count);
      } catch (error) {
        console.error('Error fetching survey data:', error);
      }
    };

    fetchCounts();
  }, [startDate, endDate]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Customer Satisfaction Survey
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Card 
            sx={{ 
              height: '100%',
              background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
              color: 'white',
              boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)'
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6">CSAT Count</Typography>
                  <Typography variant="h3">{csatCount}</Typography>
                  <Typography variant="subtitle2">Satisfied Customers</Typography>
                </Box>
                <ThumbUpIcon sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card 
            sx={{ 
              height: '100%',
              background: 'linear-gradient(45deg, #f44336 30%, #e57373 90%)',
              color: 'white',
              boxShadow: '0 3px 5px 2px rgba(244, 67, 54, .3)'
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6">DSAT Count</Typography>
                  <Typography variant="h3">{dsatCount}</Typography>
                  <Typography variant="subtitle2">Dissatisfied Customers</Typography>
                </Box>
                <ThumbDownIcon sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Survey; 