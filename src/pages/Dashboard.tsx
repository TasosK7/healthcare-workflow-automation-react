import { useEffect, useState } from 'react';
import api from '../services/api';
// import Topbar from '../components/Topbar';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    // Chip,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    // Alert,
    TableContainer,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import {motion} from "framer-motion";
import { getAllStaff,createStaffUser, createPatientUser} from '../services/users';
import {getAllPatients, createPatient} from "../services/patients.ts";
import { getDepartments, createDepartment} from '../services/departments';
import {createStaff} from "../services/staff.ts";
import type {Department} from "../services/departments";
import type {Staff, Patient} from "../services/users";
// import Navbar from "../components/Navbar.tsx";

const Dashboard = () => {

    // Patient creation states
    const [openCreatePatientUser, setOpenCreatePatientUser] = useState(false);
    const [openCreatePatientProfile, setOpenCreatePatientProfile] = useState(false);

    const [patientEmail, setPatientEmail] = useState("");
    const [patientEmailError, setPatientEmailError] = useState("");
    const [patientUsername, setPatientUsername] = useState("");
    const [patientUsernameError, setPatientUsernameError] = useState("");
    const [patientPassword, setPatientPassword] = useState("");

    const [createdPatientUserId, setCreatedPatientUserId] = useState<number | null>(null);

    const [patientFirstNameNew, setPatientFirstNameNew] = useState("");
    const [patientLastNameNew, setPatientLastNameNew] = useState("");


    const [staff, setStaff] = useState<Staff[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);

    const [editingDept, setEditingDept] = useState<Department | null>(null);
    const [updatedName, setUpdatedName] = useState('');
    const [updatedUnitType, setUpdatedUnitType] = useState('');

    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [staffFirstName, setStaffFirstName] = useState('');
    const [staffLastName, setStaffLastName] = useState('');
    const [staffRole, setStaffRole] = useState('');
    const [staffDepartmentId, setStaffDepartmentId] = useState<number | undefined>();

    const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
    const [patientFirstName, setPatientFirstName] = useState('');
    const [patientLastName, setPatientLastName] = useState('');

    const [openCreateUser, setOpenCreateUser] = useState(false);
    const [openCreateStaff, setOpenCreateStaff] = useState(false);

    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [createdUserId, setCreatedUserId] = useState<number | null>(null);

    const [newFirstName, setNewFirstName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    const [newDepartmentId, setNewDepartmentId] = useState<number | "">("");

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState("");


    const isUserFormValid =
        username.trim() &&
        email.trim() &&
        newPassword.trim() &&
        !emailError &&
        !usernameError;

    useEffect(() => {
        if (!email) {
            setEmailError("");
            return;
        }

        const delayDebounce = setTimeout(async () => {
            try {
                const res = await api.get("/auth/check-email", { params: { email } });
                if (res.data.exists) {
                    setEmailError("Email already exists");
                } else {
                    setEmailError("");
                }
            } catch {
                setEmailError("");
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [email]);

    useEffect(() => {
        if (!username) {
            setUsernameError("");
            return;
        }

        const delayDebounce = setTimeout(async () => {
            try {
                const res = await api.get("/auth/check-username", { params: { username } });
                if (res.data.exists) {
                    setUsernameError("Username already exists");
                } else {
                    setUsernameError("");
                }
            } catch {
                setUsernameError("");
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [username]);


    const handleEditDepartment = (dept: Department) => {
        setEditingDept(dept);
        setUpdatedName(dept.name);
        setUpdatedUnitType(dept.unit_type);
    };

    const handleEditStaff = (staff: Staff) => {
        setEditingStaff(staff);
        setStaffFirstName(staff.first_name);
        setStaffLastName(staff.last_name);
        setStaffRole(staff.role);
        setStaffDepartmentId(staff.department_id);
    };

    const handleEditPatient = (patient: Patient) => {
        setEditingPatient(patient);
        setPatientFirstName(patient.first_name);
        setPatientLastName(patient.last_name);
    };

    const handleSaveDepartment = async () => {
        if (!editingDept) return;
        try {
            await api.put(`/departments/${editingDept.id}`, {
                name: updatedName,
                unit_type: updatedUnitType,
            });
            setEditingDept(null);
            const updatedDepartments = await getDepartments();
            setDepartments(updatedDepartments);
        } catch (err) {
            console.error('Failed to update department', err);
        }
    };

    const handleSaveStaff = async () => {
        if (!editingStaff) return;
        try {
            await api.put(`/staff/${editingStaff.id}`, {
                first_name: staffFirstName,
                last_name: staffLastName,
                role: staffRole,
                department_id: staffDepartmentId,
            });
            setEditingStaff(null);
            const updated = await getAllStaff();
            setStaff(updated);
        } catch (err) {
            console.error("Failed to update staff", err);
        }
    };

    const handleSavePatient = async () => {
        if (!editingPatient) return;
        try {
            await api.put(`/patients/${editingPatient.id}`, {
                first_name: patientFirstName,
                last_name: patientLastName,
            });
            setEditingPatient(null);
            const updated = await getAllPatients();
            setPatients(updated);
        } catch (err) {
            console.error("Failed to update patient", err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const staffData = await getAllStaff();
                const patientData = await getAllPatients();
                const departmentData = await getDepartments();
                setStaff(staffData);
                setPatients(patientData);
                setDepartments(departmentData);
            } catch (err) {
                console.error('Error loading data:', err);
            }
        };
        fetchData();
    }, []);

    const getDepartmentName = (id: number | undefined) => {
        const dept = departments.find((d) => d.id === id);
        return dept ? dept.name : '-';
    };

    return (
        <Box sx={{
            minHeight: "100vh",
            py: 2,
            background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
        }}>
            {/*<Topbar />*/}
            {/*<Navbar />*/}

            <Container maxWidth={false}
                       sx={{ px: 4, py: 2, height: "100%", overflow: "auto" }}
            >
                <motion.div initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                >
                    {/* STAFF TABLE */}
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "text.primary" }}>
                        Admin Overview
                    </Typography>
                    <Grid container spacing={3}>
                        {/* STAFF TABLE */}
                        <Grid size={{xs: 12, md: 6}}>
                            <Paper elevation={6} sx={{p: 3, mb: 3}}>
                            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2}}>
                                <Typography variant="h6" color="primary">
                                    Staff Members
                                </Typography>
                                <Button variant="contained" onClick={() => setOpenCreateUser(true)}>
                                    + Create Staff
                                </Button>
                            </Box>

                            {staff.length > 0 ? (
                                <TableContainer>
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><strong>Name</strong></TableCell>
                                                <TableCell><strong>Role</strong></TableCell>
                                                <TableCell><strong>Department</strong></TableCell>
                                                <TableCell align="center"><strong>Actions</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {staff.map((s) => (
                                                <TableRow key={s.id}>
                                                    <TableCell>{s.first_name} {s.last_name}</TableCell>
                                                    <TableCell sx={{textTransform: "capitalize"}}>{s.role}</TableCell>
                                                    <TableCell>{getDepartmentName(s.department_id)}</TableCell>
                                                    <TableCell align="center">
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={() => handleEditStaff(s)}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Typography>No staff members found.</Typography>
                            )}
                        </Paper>
                        </Grid>

                        {/* DEPARTMENTS TABLE */}
                        <Grid size={{xs: 12, md: 6}}>
                            <Paper elevation={6} sx={{p: 3, mb: 3}}>
                            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2}}>
                                <Typography variant="h6" color="primary">
                                    Departments
                                </Typography>
                                <Button variant="contained" onClick={() => {
                                    setEditingDept({id: 0, name: "", unit_type: ""} as Department);
                                    setUpdatedName("");
                                    setUpdatedUnitType("");
                                }}>
                                    + New Department
                                </Button>
                            </Box>


                            {departments.length > 0 ? (
                                <TableContainer>
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><strong>Name</strong></TableCell>
                                                <TableCell><strong>Unit Type</strong></TableCell>
                                                <TableCell align="center"><strong>Actions</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {departments.map((d) => (
                                                <TableRow key={d.id}>
                                                    <TableCell>{d.name}</TableCell>
                                                    <TableCell>{d.unit_type}</TableCell>
                                                    <TableCell align="center">
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={() => handleEditDepartment(d)}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Typography>No departments found.</Typography>
                            )}
                        </Paper>
                        </Grid>
                        {/* PATIENTS TABLE */}
                        <Grid size={{xs: 12}}>
                            <Paper elevation={6} sx={{ p: 3, mb: 3 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                    <Typography variant="h6" color="primary" gutterBottom>
                                        Patients
                                    </Typography>
                                    <Button variant="contained" onClick={() => setOpenCreatePatientUser(true)}>
                                        + Create Patient
                                    </Button>
                                </Box>


                                {patients.length > 0 ? (
                                <TableContainer sx={{ maxHeight: 170, overflowY: "auto" }}>
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><strong>Name</strong></TableCell>
                                                <TableCell align="center"><strong>Actions</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {patients.map((p) => (
                                                <TableRow key={p.id}>
                                                    <TableCell>{p.first_name} {p.last_name}</TableCell>
                                                    <TableCell align="center">
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={() => handleEditPatient(p)}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Typography>No patients found.</Typography>
                            )}
                        </Paper>
                        </Grid>
                    </Grid>

                </motion.div>
            </Container>
            {editingDept && (
                <Dialog open={!!editingDept} onClose={() => setEditingDept(null)} maxWidth="sm" fullWidth>
                    <DialogTitle>{editingDept?.id === 0 ? "Add Department" : "Edit Department"}</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Name"
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                            fullWidth
                            margin="dense"
                        />
                        <TextField
                            label="Unit Type"
                            value={updatedUnitType}
                            onChange={(e) => setUpdatedUnitType(e.target.value)}
                            fullWidth
                            margin="dense"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditingDept(null)}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={async () => {
                                if (editingDept?.id === 0) {
                                    await createDepartment(updatedName, updatedUnitType);
                                } else {
                                    await handleSaveDepartment();
                                }
                                const updated = await getDepartments();
                                setDepartments(updated);
                                setEditingDept(null);
                            }}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>

            )}
            {editingStaff && (
                <Dialog open={!!editingStaff} onClose={() => setEditingStaff(null)} maxWidth="sm" fullWidth>
                    <DialogTitle>Edit Staff</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="First Name"
                            value={staffFirstName}
                            onChange={(e) => setStaffFirstName(e.target.value)}
                            fullWidth
                            margin="dense"
                        />
                        <TextField
                            label="Last Name"
                            value={staffLastName}
                            onChange={(e) => setStaffLastName(e.target.value)}
                            fullWidth
                            margin="dense"
                        />
                        <TextField
                            label="Role"
                            value={staffRole}
                            onChange={(e) => setStaffRole(e.target.value)}
                            fullWidth
                            margin="dense"
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Department</InputLabel>
                            <Select
                                value={staffDepartmentId ?? ""}
                                onChange={(e) => setStaffDepartmentId(Number(e.target.value))}
                                label="Department"
                            >
                                <MenuItem value="">Select Department</MenuItem>
                                {departments.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditingStaff(null)}>Cancel</Button>
                        <Button onClick={handleSaveStaff} variant="contained">Save</Button>
                    </DialogActions>
                </Dialog>

            )}
            {editingPatient && (
                <Dialog open={!!editingPatient} onClose={() => setEditingPatient(null)} maxWidth="sm" fullWidth>
                    <DialogTitle>Edit Patient</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="First Name"
                            value={patientFirstName}
                            onChange={(e) => setPatientFirstName(e.target.value)}
                            fullWidth
                            margin="dense"
                        />
                        <TextField
                            label="Last Name"
                            value={patientLastName}
                            onChange={(e) => setPatientLastName(e.target.value)}
                            fullWidth
                            margin="dense"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditingPatient(null)}>Cancel</Button>
                        <Button onClick={handleSavePatient} variant="contained">Save</Button>
                    </DialogActions>
                </Dialog>
            )}
            <Dialog open={openCreateUser} onClose={() => setOpenCreateUser(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create User (Staff)</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="dense"
                        error={!!emailError}
                        helperText={emailError}
                    />
                    <TextField
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                        margin="dense"
                        error={!!usernameError}
                        helperText={usernameError}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        fullWidth
                        margin="dense"
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCreateUser(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        disabled={!isUserFormValid}
                        onClick={async () => {
                            try {
                                const user = await createStaffUser(username, email, newPassword);
                                setCreatedUserId(user.id);

                                // reset fields
                                setUsername("");
                                setEmail("");
                                setNewPassword("");

                                setOpenCreateUser(false);
                                setOpenCreateStaff(true);
                            } catch (err) {
                                console.error("Failed to create user", err);
                            }
                        }}
                    >
                        Next
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openCreateStaff} onClose={() => setOpenCreateStaff(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create Staff Profile</DialogTitle>
                <DialogContent>
                    <TextField
                        label="First Name"
                        value={newFirstName}
                        onChange={(e) => setNewFirstName(e.target.value)}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Last Name"
                        value={newLastName}
                        onChange={(e) => setNewLastName(e.target.value)}
                        fullWidth
                        margin="dense"
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Department</InputLabel>
                        <Select
                            value={newDepartmentId}
                            onChange={(e) => setNewDepartmentId(Number(e.target.value))}
                            label="Department"
                        >
                            <MenuItem value="">Select Department</MenuItem>
                            {departments.map((dept) => (
                                <MenuItem key={dept.id} value={dept.id}>
                                    {dept.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCreateStaff(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={async () => {
                            if (!createdUserId) return;
                            try {
                                await createStaff(createdUserId, newFirstName, newLastName, newDepartmentId || undefined);

                                // refresh staff list
                                const updated = await getAllStaff();
                                setStaff(updated);

                                // reset fields
                                setNewFirstName("");
                                setNewLastName("");
                                setNewDepartmentId("");
                                setCreatedUserId(null);

                                setOpenCreateStaff(false);
                            } catch (err) {
                                console.error("Failed to create staff", err);
                            }
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openCreatePatientUser} onClose={() => setOpenCreatePatientUser(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create User (Patient)</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Email"
                        type="email"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        fullWidth
                        margin="dense"
                        error={!!patientEmailError}
                        helperText={patientEmailError}
                    />
                    <TextField
                        label="Username"
                        value={patientUsername}
                        onChange={(e) => setPatientUsername(e.target.value)}
                        fullWidth
                        margin="dense"
                        error={!!patientUsernameError}
                        helperText={patientUsernameError}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={patientPassword}
                        onChange={(e) => setPatientPassword(e.target.value)}
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCreatePatientUser(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        disabled={!patientEmail || !patientUsername || !patientPassword || !!patientEmailError || !!patientUsernameError}
                        onClick={async () => {
                            try {
                                const user = await createPatientUser(patientUsername, patientEmail, patientPassword);
                                setCreatedPatientUserId(user.id);

                                // reset user fields
                                setPatientUsername("");
                                setPatientEmail("");
                                setPatientPassword("");

                                setOpenCreatePatientUser(false);
                                setOpenCreatePatientProfile(true);
                            } catch (err) {
                                console.error("Failed to create patient user", err);
                            }
                        }}
                    >
                        Next
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openCreatePatientProfile} onClose={() => setOpenCreatePatientProfile(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create Patient Profile</DialogTitle>
                <DialogContent>
                    <TextField
                        label="First Name"
                        value={patientFirstNameNew}
                        onChange={(e) => setPatientFirstNameNew(e.target.value)}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Last Name"
                        value={patientLastNameNew}
                        onChange={(e) => setPatientLastNameNew(e.target.value)}
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCreatePatientProfile(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={async () => {
                            if (!createdPatientUserId) return;
                            try {
                                await createPatient(createdPatientUserId, patientFirstNameNew, patientLastNameNew);

                                // refresh patients list
                                const updated = await getAllPatients();
                                setPatients(updated);

                                // reset fields
                                setPatientFirstNameNew("");
                                setPatientLastNameNew("");
                                setCreatedPatientUserId(null);

                                setOpenCreatePatientProfile(false);
                            } catch (err) {
                                console.error("Failed to create patient", err);
                            }
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>


        </Box>
    );
};

export default Dashboard;