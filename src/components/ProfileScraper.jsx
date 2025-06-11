import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  LinearProgress,
  Paper,
  Switch,
  Typography,
  Alert,
  AlertTitle,
  Chip,
} from "@mui/material";
import { io } from "socket.io-client";

/**
 * ProfileScraper Component
 *
 * A React component for scraping coding profiles from multiple platforms.
 * Can be integrated into any React application.
 *
 * @param {Object} props
 * @param {string} props.apiEndpoint - API endpoint for the scraper service
 * @param {string} props.socketEndpoint - WebSocket endpoint for real-time updates
 * @param {Function} props.onComplete - Callback when processing is complete
 */
const ProfileScraper = ({
  apiEndpoint = "http://localhost:5000/api/profile-scraper",
  socketEndpoint = "http://localhost:5000/profile-scraper",
  onComplete = () => {},
}) => {
  // State
  const [file, setFile] = useState(null);
  const [useCache, setUseCache] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [jobId, setJobId] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    processed: 0,
    cached: 0,
    errors: 0,
  });
  const [platforms, setPlatforms] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(null);

  // Refs
  const socketRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Connect to WebSocket when component mounts
  useEffect(() => {
    return () => {
      // Clean up socket connection and timer
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Start timer
  const startTimer = () => {
    startTimeRef.current = Date.now();
    setElapsedTime(0);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsedTime(elapsed);

      // Update estimated time if we have processed some students
      if (stats.processed > 0 && stats.total > 0) {
        const avgTimePerStudent = elapsed / stats.processed;
        const remainingStudents = stats.total - stats.processed;
        const estimatedRemainingSeconds = Math.round(
          avgTimePerStudent * remainingStudents
        );
        setEstimatedTime(estimatedRemainingSeconds);
      }
    }, 1000);
  };

  // Stop timer
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle file change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError("");
    setSuccess("");
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Please select an Excel file");
      return;
    }

    try {
      setIsProcessing(true);
      setError("");
      setSuccess("");
      setProgress(0);
      setStatus("Starting processing...");
      setStats({
        total: 0,
        processed: 0,
        cached: 0,
        errors: 0,
      });
      setPlatforms([]);

      // Create form data
      const formData = new FormData();
      formData.append("excelFile", file);
      formData.append("useCache", useCache);

      // Start timer
      startTimer();

      // Send request
      const response = await fetch(`${apiEndpoint}/process`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unknown error occurred");
      }

      // Store job ID
      setJobId(data.jobId);

      // Connect to socket for updates
      connectToSocket(data.jobId);
    } catch (error) {
      setError(error.message);
      setIsProcessing(false);
      stopTimer();
    }
  };

  // Connect to WebSocket for updates
  const connectToSocket = (jobId) => {
    // Clean up existing connection
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // Create new connection
    const socket = io(socketEndpoint);
    socketRef.current = socket;

    // Listen for updates
    socket.on(`job-update-${jobId}`, handleJobUpdate);

    // Handle connection
    socket.on("connect", () => {
      console.log("Connected to WebSocket");
      socket.emit("job-status", jobId);
    });

    // Handle errors
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setError(`WebSocket connection error: ${error.message}`);
    });
  };

  // Handle job updates from WebSocket
  const handleJobUpdate = (data) => {
    console.log("Job update:", data);

    switch (data.type) {
      case "progress":
        // Update progress
        if (data.total > 0) {
          setStats((prev) => ({
            ...prev,
            total: data.total,
            processed: data.processed,
          }));
          setProgress(Math.round((data.processed / data.total) * 100));
        }

        // Update status message
        if (data.message) {
          setStatus(data.message);
        }
        break;

      case "cache":
        // Update cache count
        setStats((prev) => ({
          ...prev,
          cached: prev.cached + 1,
        }));
        break;

      case "platform":
        // Add platform if not already in list
        if (data.platform && !platforms.includes(data.platform)) {
          setPlatforms((prev) => [...prev, data.platform]);
        }
        break;

      case "error":
        // Update error count
        setStats((prev) => ({
          ...prev,
          errors: prev.errors + 1,
        }));

        // Update status message
        if (data.message) {
          setStatus(`Error: ${data.message}`);
        }
        break;

      case "complete":
        // Processing complete
        setIsProcessing(false);
        setSuccess(data.message || "Processing complete");
        stopTimer();

        // Call onComplete callback
        onComplete({
          jobId,
          resultFile: data.resultFile,
          stats,
          elapsedTime: Math.floor((Date.now() - startTimeRef.current) / 1000),
        });
        break;

      default:
        break;
    }
  };

  // Handle download
  const handleDownload = () => {
    if (jobId) {
      window.location.href = `${apiEndpoint}/download/${jobId}`;
    }
  };

  // Platform badge color
  const getPlatformColor = (platform) => {
    switch (platform) {
      case "LeetCode":
        return "warning";
      case "GeeksForGeeks":
        return "success";
      case "HackerRank":
        return "info";
      case "CodeChef":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 3, mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Coding Profile Scraper
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <input
                accept=".xlsx,.xls"
                style={{ display: "none" }}
                id="excel-file-upload"
                type="file"
                onChange={handleFileChange}
                disabled={isProcessing}
              />
              <label htmlFor="excel-file-upload">
                <Button
                  variant="contained"
                  component="span"
                  disabled={isProcessing}
                  fullWidth
                >
                  Select Excel File
                </Button>
              </label>
              {file && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected file: {file.name}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={useCache}
                    onChange={(e) => setUseCache(e.target.checked)}
                    disabled={isProcessing}
                  />
                }
                label="Use cached results when available (faster)"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!file || isProcessing}
                fullWidth
              >
                {isProcessing ? "Processing..." : "Process Profiles"}
              </Button>
            </Grid>
          </Grid>
        </form>

        {isProcessing && (
          <Box sx={{ mt: 4 }}>
            <Alert severity="info">
              <AlertTitle>Processing Profiles</AlertTitle>
              <Typography variant="body2" gutterBottom>
                {status}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Time elapsed: {formatTime(elapsedTime)}
                </Typography>
                {estimatedTime !== null && (
                  <Typography variant="body2">
                    Estimated remaining: {formatTime(estimatedTime)}
                  </Typography>
                )}
              </Box>

              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ mt: 2, mb: 2 }}
              />
              <Typography variant="body2" align="center">
                {progress}%
              </Typography>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" align="center">
                        {stats.total}
                      </Typography>
                      <Typography variant="body2" align="center">
                        Total Students
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" align="center" color="primary">
                        {stats.processed}
                      </Typography>
                      <Typography variant="body2" align="center">
                        Processed
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" align="center" color="info.main">
                        {stats.cached}
                      </Typography>
                      <Typography variant="body2" align="center">
                        From Cache
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" align="center" color="error">
                        {stats.errors}
                      </Typography>
                      <Typography variant="body2" align="center">
                        Errors
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {platforms.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">
                    Platforms Processed:
                  </Typography>
                  <Box
                    sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}
                  >
                    {platforms.map((platform) => (
                      <Chip
                        key={platform}
                        label={platform}
                        color={getPlatformColor(platform)}
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Alert>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 3 }}>
            <AlertTitle>Success</AlertTitle>
            <Typography gutterBottom>{success}</Typography>
            <Typography variant="body2" gutterBottom>
              Total time: {formatTime(elapsedTime)}
            </Typography>
            <Button
              variant="outlined"
              color="success"
              onClick={handleDownload}
              sx={{ mt: 1 }}
            >
              Download Results
            </Button>
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default ProfileScraper;
