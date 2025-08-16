import { useEffect, useState } from 'react';
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
    Alert, TableContainer,
    // TextField
} from "@mui/material";
import { motion } from "framer-motion";
// import { DatePicker } from "@mui/x-date-pickers";
import {AxiosError} from "axios";
import api from '../services/api';
import type {Staff, Patient} from '../services/users'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
// import {CloudUpload} from "@mui/icons-material";

interface Appointment {
    id: number;
    staff_id: number;
    date: string;
    status: string;
    staff_name: string;
}

interface DiagnosedTest {
    id: number;
    result_file_url: string;
    diagnosis: string;
    staff_name: string;
}


const Patient = () => {
    const [patient, setPatient] = useState<Patient | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<number | "">("");
    const [selectedDate, setSelectedDate] = useState<string>("");


    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [bookingStatus, setBookingStatus] = useState<string | null>(null);


    const [diagnosedTests, setDiagnosedTests] = useState<DiagnosedTest[]>([]);

    const [downloadLinks, setDownloadLinks] = useState<{ [key: number]: string }>({});

    // const [bookingError, setBookingError] = useState<string | null>(null);

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });



    useEffect(() => {
        const fetchData = async () => {
            try {
                const resPatient = await api.get('/patients/me');
                setPatient(resPatient.data);

                const resAppointments = await api.get('/appointments/me');
                setAppointments(resAppointments.data);

                const resDiagnosis = await api.get("/lab-tests/diagnosed/me");
                setDiagnosedTests(resDiagnosis.data);

            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };

        fetchData();

        const fetchStaff = async () => {
            try {
                const res = await api.get("/staff");
                setStaffList(res.data);
            } catch (err) {
                console.error("Failed to fetch staff", err);
            }
        };
        fetchStaff();

    }, []);

    const getDownloadLink = async (testId: number): Promise<string | null> => {
        try {
            const res = await api.get(`/lab-tests/download-url/${testId}`);
            return res.data.url;
        } catch (err) {
            console.error("Download URL error:", err);
            return null;
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setBookingStatus(null);
        try {
            await api.post("/appointments/book", {
                patient_id: 0, // dummy, will be ignored by backend
                staff_id: selectedStaff,
                date: selectedDate,
                status: "pending"
            });

            const resAppointments = await api.get('/appointments/me');
            setAppointments(resAppointments.data);
            setSelectedDate("");
            setSelectedStaff("");
            setBookingStatus("Booking request successful");
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ detail: string }>;
            console.error("Failed to book appointment", error);
            if (axiosError.response && axiosError.response.status === 400) {
                setBookingStatus(axiosError.response.data?.detail || "Booking error.");
            } else {
                setBookingStatus("An unexpected error occurred.");
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file);
        } else {
            setSelectedFile(null);
            setUploadStatus("Please upload a valid PDF file.");
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !selectedStaff) return;

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("staff_id", selectedStaff.toString());

        try {
            await api.post("/lab-tests/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setUploadStatus("Upload successful!");
            setSelectedFile(null);
            setSelectedStaff("");
        } catch (error) {
            console.error("Upload error:", error);
            setUploadStatus("Upload failed.");
        }
    };


    return (
        <Box
            sx={{
                minHeight: "100vh",
                py: 2,
                background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
            }}
        >
            <Container
                maxWidth={false}
                sx={{ px: 4, py: 2, height: "100%", overflow: "auto" }}  // ✅ auto scroll if needed
            >

            <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Grid container spacing={3}>

                        {/* Profile - Full width */}
                        <Grid size={{ xs: 12 }}>
                            <Paper elevation={6} sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
                                <Typography variant="h6" color="primary" gutterBottom>
                                    My Profile
                                </Typography>
                                {patient ? (
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 6 }}>
                                            <p><strong>First Name:</strong> {patient.first_name}</p>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <p><strong>Last Name:</strong> {patient.last_name}</p>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <Typography>Loading profile...</Typography>
                                )}
                            </Paper>
                        </Grid>

                        {/* Appointments + Diagnoses side by side */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper elevation={6} sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
                                <Typography variant="h6" color="primary" gutterBottom>
                                    My Appointments
                                </Typography>
                                {appointments.length ? (
                                    <TableContainer sx={{ maxHeight: "28vh" }}>
                                        <Table stickyHeader size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><strong>Date</strong></TableCell>
                                                    <TableCell><strong>Staff</strong></TableCell>
                                                    <TableCell><strong>Status</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {appointments.map((appt) => (
                                                    <TableRow key={appt.id}>
                                                        <TableCell>{new Date(appt.date).toLocaleDateString()}</TableCell>
                                                        <TableCell>{appt.staff_name}</TableCell>
                                                        <TableCell>
                                                            {/*<Chip*/}
                                                            {/*    label={appt.status}*/}
                                                            {/*    color={*/}
                                                            {/*        appt.status === "pending"*/}
                                                            {/*            ? "warning"*/}
                                                            {/*            : appt.status === "confirmed"*/}
                                                            {/*                ? "success"*/}
                                                            {/*                : "default"*/}
                                                            {/*    }*/}
                                                            {/*/>*/}
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-sm font-semibold
                                                                ${appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                    appt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                                        'bg-red-100 text-red-700'}`}
                                                            >
                                                            {appt.status}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Typography>No appointments found.</Typography>
                                )}
                            </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper elevation={6} sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
                                <Typography variant="h6" color="primary" gutterBottom>
                                    My Diagnoses
                                </Typography>
                                {diagnosedTests.length ? (
                                    <TableContainer sx={{ maxHeight: "28vh" }}>
                                        <Table stickyHeader size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><strong>Staff Member</strong></TableCell>
                                                    <TableCell><strong>Diagnosis</strong></TableCell>
                                                    <TableCell><strong>Lab Test</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {diagnosedTests.map((test) => (
                                                    <TableRow key={test.id}>
                                                        <TableCell>{test.staff_name}</TableCell>
                                                        <TableCell>{test.diagnosis || "No diagnosis yet"}</TableCell>
                                                        <TableCell>
                                                            {downloadLinks[test.id] ? (
                                                                <Button
                                                                    href={downloadLinks[test.id]}
                                                                    target="_blank"
                                                                    variant="outlined"
                                                                >
                                                                    Download PDF
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    onClick={async () => {
                                                                        const url = await getDownloadLink(test.id);
                                                                        if (url) {
                                                                            setDownloadLinks(prev => ({ ...prev, [test.id]: url }));
                                                                        }
                                                                    }}
                                                                >
                                                                    Get Download Link
                                                                </Button>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Typography>No diagnoses available yet.</Typography>
                                )}
                            </Paper>
                        </Grid>

                        {/* Book Appointment + File Upload side by side */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper elevation={6} sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
                                <Typography variant="h6" color="primary" gutterBottom>
                                    Book New Appointment
                                </Typography>
                                <Box component="form" onSubmit={handleSubmit}>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Staff</InputLabel>
                                        <Select
                                            value={selectedStaff}
                                            onChange={(e) => setSelectedStaff(Number(e.target.value))}
                                            required
                                        >
                                            <option value="">-- Choose --</option>
                                            {staffList.map((s) => (
                                                <MenuItem key={s.id} value={s.id}>
                                                    {s.first_name} {s.last_name} ({s.role}, {s.department_name || "No department"})
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <div>
                                        <label className="block mb-1 font-medium">Date</label>
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            min={new Date().toISOString().split("T")[0]}
                                            className="w-full border rounded px-3 py-2"
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{ mt: 2 }}
                                        disabled={!selectedStaff || !selectedDate}
                                    >
                                        Book Appointment
                                    </Button>
                                </Box>
                                {bookingStatus && (
                                    <p className="mt-3 text-sm">
                                        {bookingStatus.includes("successful") ? (
                                            <Alert className="text-green-600">{bookingStatus}</Alert>
                                        ) : (
                                            <Alert className="text-red-600">{bookingStatus}</Alert>
                                        )}
                                    </p>
                                )}
                            </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper elevation={6} sx={{ p: 3,flexDirection: "column" }}>
                                <Typography variant="h6" color="primary" gutterBottom>
                                    Upload Lab Test Results
                                </Typography>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Staff</InputLabel>
                                    <Select
                                        value={selectedStaff}
                                        onChange={(e) => setSelectedStaff(Number(e.target.value))}
                                        required
                                    >
                                        <option value="">-- Choose --</option>
                                        {staffList.map((s) => (
                                            <MenuItem key={s.id} value={s.id}>
                                                {s.first_name} {s.last_name} ({s.role}, {s.department_name || "No department"})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Button
                                    component="label"
                                    variant="contained"
                                    startIcon={<CloudUploadIcon />}
                                >
                                    {selectedFile ? selectedFile.name : "Select file"}
                                    <VisuallyHiddenInput
                                        type="file"
                                        onChange={handleFileChange}
                                        accept="application/pdf"
                                    />
                                </Button>

                                <Button
                                    onClick={handleUpload}
                                    disabled={!selectedFile}
                                    variant="contained"
                                    sx={{ bgcolor: "green", ml: 1 }}
                                >
                                    Upload
                                </Button>

                                {uploadStatus && (
                                    <p className="mt-3 text-sm">
                                        {uploadStatus.includes("successful") ? (
                                            <span className="text-green-600">{uploadStatus}</span>
                                        ) : (
                                            <span className="text-red-600">{uploadStatus}</span>
                                        )}
                                    </p>
                                )}
                            </Paper>
                        </Grid>

                    </Grid>
                </motion.div>
            </Container>
        </Box>
    );
};

export default Patient;
