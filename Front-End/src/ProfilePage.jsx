import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  Avatar,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    profilePicture: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("jwtToken");
          navigate("/login");
        }
        setNotification({
          open: true,
          message: "Failed to load profile",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");
    setUpdating(true);

    try {
      const response = await axios.put(
        "http://localhost:5000/api/auth/profile",
        {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          profilePicture: profile.profilePicture,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProfile(response.data);
      setNotification({
        open: true,
        message: "Profile updated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to update profile",
        severity: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 5, mb: 5 }}>
        <Box sx={{ mb: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar
            src={profile.profilePicture || ""}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Typography variant="h4" component="h1" gutterBottom>
            User Profile
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={profile.username}
                disabled
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={profile.firstName || ""}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={profile.lastName || ""}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Profile Picture URL"
                name="profilePicture"
                value={profile.profilePicture || ""}
                onChange={handleChange}
                variant="outlined"
                helperText="Enter a URL for your profile picture"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={updating}
                sx={{ py: 1.5 }}
              >
                {updating ? <CircularProgress size={24} /> : "Update Profile"}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                onClick={handleLogout}
                sx={{ py: 1.5 }}
              >
                Logout
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;
