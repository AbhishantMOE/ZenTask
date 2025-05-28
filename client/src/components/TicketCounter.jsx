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
  CheckCircleOutline as LowIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import axios from 'axios';

const TicketCounter = ({ onDateRangeChange }) => {
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [ticketCount, setTicketCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [csatCount, setCsatCount] = useState(0);
  const [dsatCount, setDsatCount] = useState(0);
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

  const fetchSurveyCount = async (startDate, endDate, type) => {
    try {
      const response = await axios.get('http://localhost:5000/getSurveyCount', {
        params: {
          startDate,
          endDate,
          type
        }
      });
      return response.data.count;
    } catch (error) {
      console.error(`Error fetching ${type} count:`, error);
      return 0;
    }
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const formattedStartDate = startDate.format('YYYY-MM-DD');
      const formattedEndDate = endDate.format('YYYY-MM-DD');
      
      // Notify parent component about date range change
      onDateRangeChange?.(formattedStartDate, formattedEndDate);
      
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

      // Get CSAT and DSAT counts
      const [csatData, dsatData] = await Promise.all([
        fetchSurveyCount(formattedStartDate, formattedEndDate, 'csat'),
        fetchSurveyCount(formattedStartDate, formattedEndDate, 'dsat')
      ]);
      
      setPriorityCounts(counts);
      setTicketCount(response.data.count);
      setCsatCount(csatData);
      setDsatCount(dsatData);
      
      const result = {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        totalCount: response.data.count,
        priorityCounts: counts
      };
      
      console.log('Ticket Count Data:', result);
    } catch (error) {
      console.error('Error fetching data:', error);
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

                {/* Survey Section */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                    Customer Satisfaction Survey
                  </Typography>
                  <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} sm={6}>
                      <Paper 
                        sx={{ 
                          p: 3,
                          height: '100%',
                          background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
                          color: 'white',
                          boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)'
                        }}
                      >
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box>
                            <Typography variant="h6">CSAT Count</Typography>
                            <Typography variant="h3">{csatCount}</Typography>
                            <Typography variant="subtitle2">Satisfied Customers</Typography>
                          </Box>
                          <ThumbUpIcon sx={{ fontSize: 40 }} />
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper 
                        sx={{ 
                          p: 3,
                          height: '100%',
                          background: 'linear-gradient(45deg, #f44336 30%, #e57373 90%)',
                          color: 'white',
                          boxShadow: '0 3px 5px 2px rgba(244, 67, 54, .3)'
                        }}
                      >
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box>
                            <Typography variant="h6">DSAT Count</Typography>
                            <Typography variant="h3">{dsatCount}</Typography>
                            <Typography variant="subtitle2">Dissatisfied Customers</Typography>
                          </Box>
                          <ThumbDownIcon sx={{ fontSize: 40 }} />
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            )}
          </Stack>
        </LocalizationProvider>
      </Paper>
    </Container>
  );
};

export default TicketCounter; 