import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Box,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
  Fab,
  Tooltip,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as ClockIcon,
  ExitToApp as ClockOutIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI } from '../../services/api';

const UserView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAdmin } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'staff',
    is_active: true,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers();
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        role: user.role || 'staff',
        is_active: user.is_active !== false,
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        role: 'staff',
        is_active: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      role: 'staff',
      is_active: true,
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await adminAPI.updateUser(editingUser.id, formData);
        setSnackbar({ open: true, message: 'User updated successfully', severity: 'success' });
      } else {
        await adminAPI.createUser(formData);
        setSnackbar({ open: true, message: 'User created successfully', severity: 'success' });
      }
      handleCloseDialog();
      fetchUsers();
    } catch (err) {
      setSnackbar({ open: true, message: 'Operation failed', severity: 'error' });
      console.error('Error saving user:', err);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
        fetchUsers();
      } catch (err) {
        setSnackbar({ open: true, message: 'Failed to delete user', severity: 'error' });
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleClockInOut = async (userId, isClockedIn) => {
    try {
      if (isClockedIn) {
        await adminAPI.clockOut(userId);
        setSnackbar({ open: true, message: 'Clocked out successfully', severity: 'success' });
      } else {
        await adminAPI.clockIn(userId);
        setSnackbar({ open: true, message: 'Clocked in successfully', severity: 'success' });
      }
      fetchUsers();
    } catch (err) {
      setSnackbar({ open: true, message: 'Clock operation failed', severity: 'error' });
      console.error('Error clocking in/out:', err);
    }
  };

  const getStatusColor = (isActive, isClockedIn) => {
    if (!isActive) return 'error';
    if (isClockedIn) return 'success';
    return 'warning';
  };

  const getStatusText = (isActive, isClockedIn) => {
    if (!isActive) return 'Inactive';
    if (isClockedIn) return 'Clocked In';
    return 'Clocked Out';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Loading users...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Restaurant Staff Management
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            size={isMobile ? 'small' : 'medium'}
          >
            {isMobile ? 'Add' : 'Add Staff Member'}
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Staff
              </Typography>
              <Typography variant="h4">
                {users.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Staff
              </Typography>
              <Typography variant="h4">
                {users.filter(u => u.is_active).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Currently Clocked In
              </Typography>
              <Typography variant="h4">
                {users.filter(u => u.is_clocked_in && u.is_active).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Staff Table */}
        <Grid item xs={12}>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Clock Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((staffUser) => (
                    <TableRow key={staffUser.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {staffUser.is_admin ? (
                            <AdminIcon sx={{ mr: 1, color: 'primary.main' }} />
                          ) : (
                            <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          )}
                          {staffUser.first_name} {staffUser.last_name}
                        </Box>
                      </TableCell>
                      <TableCell>{staffUser.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={staffUser.role || 'staff'}
                          size="small"
                          color={staffUser.is_admin ? 'primary' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={staffUser.is_active ? 'Active' : 'Inactive'}
                          size="small"
                          color={staffUser.is_active ? 'success' : 'error'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(staffUser.is_active, staffUser.is_clocked_in)}
                          size="small"
                          color={getStatusColor(staffUser.is_active, staffUser.is_clocked_in)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={staffUser.is_clocked_in ? 'Clock Out' : 'Clock In'}>
                          <IconButton
                            onClick={() => handleClockInOut(staffUser.id, staffUser.is_clocked_in)}
                            color={staffUser.is_clocked_in ? 'error' : 'success'}
                            disabled={!staffUser.is_active}
                          >
                            {staffUser.is_clocked_in ? <ClockOutIcon /> : <ClockIcon />}
                          </IconButton>
                        </Tooltip>
                        {isAdmin && (
                          <>
                            <Tooltip title="Edit">
                              <IconButton
                                onClick={() => handleOpenDialog(staffUser)}
                                color="primary"
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                onClick={() => handleDelete(staffUser.id)}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Edit Staff Member' : 'Add Staff Member'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            fullWidth
            variant="outlined"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="First Name"
            fullWidth
            variant="outlined"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Last Name"
            fullWidth
            variant="outlined"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              label="Role"
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <MenuItem value="staff">Staff</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Floating Action Button for mobile */}
      {isMobile && isAdmin && (
        <Fab
          color="primary"
          aria-label="add staff"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => handleOpenDialog()}
        >
          <AddIcon />
        </Fab>
      )}
    </Container>
  );
};

export default UserView;
