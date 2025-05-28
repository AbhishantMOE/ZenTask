import React, { useState } from 'react';
import { 
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Stack,
  Grid,
  CircularProgress
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { 
  AssignmentTurnedIn as AssignmentIcon,
  ErrorOutline as UrgentIcon,
  Warning as HighIcon,
  Info as NormalIcon,
  CheckCircleOutline as LowIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import axios from 'axios';

const TicketCounter = () => {
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [ticketCount, setTicketCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [priorityCounts, setPriorityCounts] = useState({
    low: 0,
    normal: 0,
    high: 0,
    urgent: 0
  });

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'urgent': return <UrgentIcon sx={{ color: '#d32f2f' }}/>;
      case 'high': return <HighIcon sx={{ color: '#ed6c02' }}/>;
      case 'normal': return <NormalIcon sx={{ color: '#2e7d32' }}/>;
      case 'low': return <LowIcon sx={{ color: '#1976d2' }}/>;
      default: return null;
    }
  };

  const fetchPriorityCount = async (startDate, endDate, priorityType) => {
    try {
      const response = await axios.get('http://localhost:5000/getTicketsWithType', {
        params: {
          startDate,
          endDate,
          priorityType
        }
      });
      return response.data.count;
    } catch (error) {
      console.error(`Error fetching ${priorityType} priority tickets:`, error);
      return 0;
    }
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const formattedStartDate = startDate.format('YYYY-MM-DD');
      const formattedEndDate = endDate.format('YYYY-MM-DD');
      
      // Get total tickets
      const response = await axios.get('http://localhost:5000/getTotalCreatedTickets', {
        params: {
          startDate: formattedStartDate,
          endDate: formattedEndDate
        }
      });
      
      // Get counts for each priority
      const priorityTypes = ['low', 'normal', 'high', 'urgent'];
      const counts = {};
      
      for (const type of priorityTypes) {
        counts[type] = await fetchPriorityCount(formattedStartDate, formattedEndDate, type);
      }
      
      setPriorityCounts(counts);
      setTicketCount(response.data.count);
      
      const result = {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        totalCount: response.data.count,
        priorityCounts: counts
      };
      
      console.log('Ticket Count Data:', result);
    } catch (error) {
      console.error('Error fetching ticket count:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'center' }}>
          <AssignmentIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h4" color="primary">
            Ticket Analytics
          </Typography>
        </Box>
        
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3} alignItems="center">
            <Grid container spacing={3} justifyContent="center" maxWidth="md">
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  sx={{ width: '100%' }}
                  slotProps={{
                    textField: {
                      variant: 'outlined',
                      sx: { backgroundColor: '#fff' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  sx={{ width: '100%' }}
                  slotProps={{
                    textField: {
                      variant: 'outlined',
                      sx: { backgroundColor: '#fff' }
                    }
                  }}
                />
              </Grid>
            </Grid>

            <Button 
              variant="contained" 
              onClick={handleExport}
              size="large"
              disabled={loading}
              sx={{ 
                mt: 2,
                py: 1.5,
                px: 4,
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#115293'
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Export'
              )}
            </Button>

            {ticketCount !== null && (
              <Box sx={{ mt: 4 }}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 3, 
                    mb: 3, 
                    textAlign: 'center',
                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    color: 'white'
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    Total Tickets
                  </Typography>
                  <Typography variant="h3">
                    {ticketCount}
                  </Typography>
                </Paper>
                
                <Grid container spacing={2}>
                  {Object.entries(priorityCounts).map(([priority, count]) => (
                    <Grid item xs={12} sm={6} key={priority}>
                      <Paper 
                        elevation={2} 
                        sx={{ 
                          p: 3, 
                          textAlign: 'center',
                          bgcolor: priority === 'urgent' ? '#ffebee' :
                                  priority === 'high' ? '#fff3e0' :
                                  priority === 'normal' ? '#e8f5e9' :
                                  '#e3f2fd',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                          {getPriorityIcon(priority)}
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              ml: 1,
                              textTransform: 'uppercase',
                              fontWeight: 600,
                              letterSpacing: '0.5px'
                            }}
                          >
                            {priority}
                          </Typography>
                        </Box>
                        <Typography variant="h4">
                          {count}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Stack>
        </LocalizationProvider>
      </Paper>
    </Container>
  );
};

export default TicketCounter; 