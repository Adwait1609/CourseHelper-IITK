import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Box,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    name: "",
    code: "",
    credit: "",
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [profileMenu, setProfileMenu] = useState(null);

  const navigate = useNavigate();

  // Fetch user data
  const [user, setUser] = useState(null);
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("jwtToken");
          navigate("/login");
        }
        setNotification({
          open: true,
          message: "Failed to load courses",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [navigate]);

  const handleEditClick = (course) => {
    setSelectedCourse(course);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedCourse(null);
  };

  const handleViewClick = (course) => {
    setSelectedCourse(course);
    setOpenView(true);
  };

  const handleCloseView = () => {
    setOpenView(false);
    setSelectedCourse(null);
  };

  const handleAddCourse = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    setNewCourse({ name: "", code: "", credit: "", description: "", image: "" });
  };

  const handleAddNewCourse = async () => {
    setActionLoading(true);
    const token = localStorage.getItem("jwtToken");
    
    try {
      const response = await axios.post("http://localhost:5000/api/courses", newCourse, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses([...courses, response.data]);
      setNotification({
        open: true,
        message: "Course added successfully",
        severity: "success",
      });
      handleCloseAdd();
    } catch (error) {
      console.error("Error adding course:", error);
      setNotification({
        open: true,
        message: "Failed to add course",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateCourse = async () => {
    setActionLoading(true);
    const token = localStorage.getItem("jwtToken");
    
    try {
      const response = await axios.put(
        `http://localhost:5000/api/courses/${selectedCourse.id}`,
        selectedCourse,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCourses(
        courses.map((course) => (course.id === selectedCourse.id ? response.data : course))
      );
      setNotification({
        open: true,
        message: "Course updated successfully",
        severity: "success",
      });
      handleCloseEdit();
    } catch (error) {
      console.error("Error updating course:", error);
      setNotification({
        open: true,
        message: "Failed to update course",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    setActionLoading(true);
    const token = localStorage.getItem("jwtToken");
    
    try {
      await axios.delete(`http://localhost:5000/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(courses.filter((course) => course.id !== courseId));
      setNotification({
        open: true,
        message: "Course deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting course:", error);
      setNotification({
        open: true,
        message: "Failed to delete course",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenu(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenu(null);
  };

  const handleNavigateToProfile = () => {
    handleProfileMenuClose();
    navigate("/profile");
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
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Course Helper
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              color="inherit"
              variant="outlined"
              onClick={handleAddCourse}
              sx={{ mr: 2 }}
            >
              Add Course
            </Button>
            <IconButton
              color="inherit"
              onClick={handleProfileMenuOpen}
              aria-controls="profile-menu"
              aria-haspopup="true"
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              id="profile-menu"
              anchorEl={profileMenu}
              keepMounted
              open={Boolean(profileMenu)}
              onClose={handleProfileMenuClose}
            >
              <MenuItem onClick={handleNavigateToProfile}>
                <Typography variant="body1">
                  {user ? `${user.username}` : "Profile"}
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Courses
        </Typography>

        {courses.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 5,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              You don't have any courses yet.
            </Typography>
            <Button variant="contained" onClick={handleAddCourse}>
              Add Your First Course
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {courses.map((course) => (
              <Grid item key={course.id} xs={12} sm={6} md={4}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={course.image || "https://source.unsplash.com/random?education"}
                    alt={course.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {course.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Code: {course.code}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Credits: {course.credit}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
                    <Button size="small" onClick={() => handleViewClick(course)}>
                      View
                    </Button>
                    <Button size="small" onClick={() => handleEditClick(course)}>
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* View Course Dialog */}
      <Dialog open={openView} onClose={handleCloseView} maxWidth="sm" fullWidth>
        <DialogTitle>Course Details</DialogTitle>
        <DialogContent>
          {selectedCourse && (
            <Box>
              {selectedCourse.image && (
                <Box sx={{ mb: 2 }}>
                  <img
                    src={selectedCourse.image}
                    alt={selectedCourse.name}
                    style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
                  />
                </Box>
              )}
              <Typography variant="h5" gutterBottom>
                {selectedCourse.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Course Code:</strong> {selectedCourse.code}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Credits:</strong> {selectedCourse.credit}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Description:</strong>
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedCourse.description || "No description available."}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent>
          {selectedCourse && (
            <Box component="form" sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Course Name"
                value={selectedCourse.name}
                onChange={(e) =>
                  setSelectedCourse({ ...selectedCourse, name: e.target.value })
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Course Code"
                value={selectedCourse.code}
                onChange={(e) =>
                  setSelectedCourse({ ...selectedCourse, code: e.target.value })
                }
              />
              <TextField
                margin="normal"
                fullWidth
                label="Credits"
                type="number"
                value={selectedCourse.credit || ""}
                onChange={(e) =>
                  setSelectedCourse({ ...selectedCourse, credit: e.target.value })
                }
              />
              <TextField
                margin="normal"
                fullWidth
                label="Image URL"
                value={selectedCourse.image || ""}
                onChange={(e) =>
                  setSelectedCourse({ ...selectedCourse, image: e.target.value })
                }
              />
              <TextField
                margin="normal"
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={selectedCourse.description || ""}
                onChange={(e) =>
                  setSelectedCourse({ ...selectedCourse, description: e.target.value })
                }
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button 
            onClick={handleUpdateCourse} 
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Course Dialog */}
      <Dialog open={openAdd} onClose={handleCloseAdd} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Course Name"
              value={newCourse.name}
              onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Course Code"
              value={newCourse.code}
              onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Credits"
              type="number"
              value={newCourse.credit}
              onChange={(e) => setNewCourse({ ...newCourse, credit: e.target.value })}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Image URL"
              value={newCourse.image}
              onChange={(e) => setNewCourse({ ...newCourse, image: e.target.value })}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={newCourse.description}
              onChange={(e) =>
                setNewCourse({ ...newCourse, description: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd}>Cancel</Button>
          <Button 
            onClick={handleAddNewCourse} 
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} /> : "Add Course"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CoursesPage;
