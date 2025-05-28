import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Stack,
  Grid,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  AssignmentTurnedIn as AssignmentIcon,
  ErrorOutline as UrgentIcon,
  Warning as HighIcon,
  Info as NormalIcon,
  CheckCircleOutline as LowIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import axios from "axios";
import { PriorityCard } from "./components/PriorityCard";
import { SurveySection } from "./components/SurveySection";
import { StyledContainer, StyledPaper } from "./TicketCounter.styles";

const TicketCounter = () => {
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
    urgent: 0,
  });

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "urgent":
        return <UrgentIcon sx={{ color: "#d32f2f" }} />;
      case "high":
        return <HighIcon sx={{ color: "#ed6c02" }} />;
      case "normal":
        return <NormalIcon sx={{ color: "#2e7d32" }} />;
      case "low":
        return <LowIcon sx={{ color: "#1976d2" }} />;
      default:
        return null;
    }
  };

  const fetchPriorityCount = async (startDate, endDate, priorityType) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/getTicketsWithType",
        {
          params: {
            startDate,
            endDate,
            priorityType,
          },
        }
      );
      return response.data.count;
    } catch (error) {
      console.error(`Error fetching ${priorityType} priority tickets:`, error);
      return 0;
    }
  };

  const fetchSurveyCount = async (startDate, endDate, type) => {
    try {
      console.log(`Fetching ${type} count for ${startDate} to ${endDate}`);
      const response = await axios.get("http://localhost:5000/getSurveyCount", {
        params: {
          startDate,
          endDate,
          type,
        },
      });
      console.log(`${type} response:`, response.data);
      return response.data.count || 0;
    } catch (error) {
      console.error(`Error fetching ${type} count:`, error);
      return 0;
    }
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const formattedStartDate = startDate.format("YYYY-MM-DD");
      const formattedEndDate = endDate.format("YYYY-MM-DD");

      // Get total tickets
      const response = await axios.get(
        "http://localhost:5000/getTotalCreatedTickets",
        {
          params: {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          },
        }
      );

      // Get counts for each priority
      const priorityTypes = ["low", "normal", "high", "urgent"];
      const counts = {};

      for (const type of priorityTypes) {
        counts[type] = await fetchPriorityCount(
          formattedStartDate,
          formattedEndDate,
          type
        );
      }

      // Get CSAT and DSAT counts
      console.log("Fetching survey counts...");
      const [csatCount, dsatCount] = await Promise.all([
        fetchSurveyCount(formattedStartDate, formattedEndDate, "csat"),
        fetchSurveyCount(formattedStartDate, formattedEndDate, "dsat"),
      ]);
      console.log("Survey counts:", { csatCount, dsatCount });

      setPriorityCounts(counts);
      setTicketCount(response.data.count);
      setCsatCount(csatCount);
      setDsatCount(dsatCount);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer maxWidth="md">
      <StyledPaper elevation={3}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            justifyContent: "center",
          }}
        >
          <AssignmentIcon sx={{ mr: 2, color: "primary.main", fontSize: 32 }} />
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
                  sx={{ width: "100%" }}
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      sx: { backgroundColor: "#fff" },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  sx={{ width: "100%" }}
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      sx: { backgroundColor: "#fff" },
                    },
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
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#115293",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Export"
              )}
            </Button>

            {ticketCount !== null && (
              <Box sx={{ mt: 4, width: "100%" }}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    mb: 3,
                    textAlign: "center",
                    background:
                      "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                    color: "white",
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    Total Tickets
                  </Typography>
                  <Typography variant="h3">{ticketCount}</Typography>
                </Paper>

                <Grid container spacing={2}>
                  {Object.entries(priorityCounts).map(([priority, count]) => (
                    <Grid item xs={12} sm={6} key={priority}>
                      <PriorityCard
                        priority={priority}
                        count={count}
                        icon={getPriorityIcon(priority)}
                      />
                    </Grid>
                  ))}
                </Grid>

                <SurveySection csatCount={csatCount} dsatCount={dsatCount} />
              </Box>
            )}
          </Stack>
        </LocalizationProvider>
      </StyledPaper>
    </StyledContainer>
  );
};

export default TicketCounter;
