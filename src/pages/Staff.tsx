import { useEffect, useState } from "react";
// import Topbar from "../components/Topbar";
import api from "../services/api";
import type { Staff } from "../services/users";
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
  // Select,
  // MenuItem,
  // InputLabel,
  // FormControl,
  // Alert,
  TableContainer,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";

interface Appointment {
  id: number;
  patient_id: number;
  patient_name: string;
  date: string;
  status: string;
}

interface LabTest {
  id: number;
  patient_id: number;
  result_file_url: string;
  status: string;
  diagnosis?: string;
  patient_name: string;
}

const Staff = () => {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [diagnosisMap, setDiagnosisMap] = useState<{ [key: number]: string }>(
    {},
  );
  const [downloadLinks, setDownloadLinks] = useState<{ [key: number]: string }>(
    {},
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resStaff = await api.get("/staff/me");
        setStaff(resStaff.data);

        const resAppointments = await api.get("/appointments/staff/me");
        setAppointments(resAppointments.data);

        const resLabTests = await api.get("lab-tests/staff/me");
        setLabTests(resLabTests.data);
      } catch (error) {
        console.error("Failed to fetch staff data", error);
      }
    };

    fetchData();
  }, []);

  const fetchDownloadUrl = async (testId: number) => {
    try {
      const res = await api.get(`/lab-tests/download-url/${testId}`);
      setDownloadLinks((prev) => ({ ...prev, [testId]: res.data.url }));
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const handleDiagnosisChange = (id: number, value: string) => {
    setDiagnosisMap((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitDiagnosis = async (testId: number) => {
    const diagnosis = diagnosisMap[testId];
    if (!diagnosis) return;

    try {
      await api.patch(`/lab-tests/${testId}/diagnose`, { diagnosis });
      const res = await api.get("/lab-tests/staff/me");
      setLabTests(res.data);
      setDiagnosisMap((prev) => ({ ...prev, [testId]: "" }));
    } catch (err) {
      console.error("Failed to submit diagnosis", err);
    }
  };

  const handleApproveAppointment = async (appointmentId: number) => {
    try {
      await api.patch(`/appointments/${appointmentId}/approve`);
      const res = await api.get("/appointments/staff/me");
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to approve appointment", err);
      alert("Could not approve appointment.");
    }
  };

  const handleRejectAppointment = async (appointmentId: number) => {
    try {
      await api.patch(`/appointments/${appointmentId}/reject`);
      const res = await api.get("/appointments/staff/me");
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to reject appointment", err);
      alert("Could not reject appointment.");
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
      {/*<Topbar />*/}

      <Container
        maxWidth={false}
        sx={{ px: 4, py: 2, height: "100%", overflow: "auto" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Card */}
          <Paper elevation={6} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              My Profile
            </Typography>
            {staff ? (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography>
                    <strong>First Name:</strong> {staff.first_name}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography>
                    <strong>Last Name:</strong> {staff.last_name}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography>
                    <strong>Department:</strong>{" "}
                    {staff.department_name || "No department"}
                  </Typography>{" "}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography>
                    <strong>Role:</strong> {staff.role}
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <Typography>Loading profile...</Typography>
            )}
          </Paper>

          {/* Appointments Card */}
          <Paper
            elevation={6}
            sx={{ p: 3, mb: 3, display: "flex", flexDirection: "column" }}
          >
            <Typography variant="h6" color="primary" gutterBottom>
              My Appointments
            </Typography>
            {appointments.length > 0 ? (
              <TableContainer sx={{ maxHeight: "28vh" }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Date</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Patient</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Actions</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.map((appt) => (
                      <TableRow key={appt.id}>
                        <TableCell>
                          {new Date(appt.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{appt.patient_name}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-sm font-semibold
              ${
                appt.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : appt.status === "confirmed"
                    ? "bg-green-100 text-green-800"
                    : appt.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-700"
              }`}
                          >
                            {appt.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              disabled={appt.status === "confirmed"}
                              onClick={() => handleApproveAppointment(appt.id)}
                              color="primary"
                              variant="contained"
                            >
                              Approve
                            </Button>

                            <Button
                              disabled={appt.status !== "pending"}
                              onClick={() => handleRejectAppointment(appt.id)}
                              color="error"
                              variant="contained"
                            >
                              Reject
                            </Button>
                          </Box>
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

          {/* Lab Tests Card */}
          <Paper
            elevation={6}
            sx={{ p: 3, mb: 3, display: "flex", flexDirection: "column" }}
          >
            <Typography variant="h6" color="primary" gutterBottom>
              Patient Lab Tests
            </Typography>
            {labTests.length === 0 ? (
              <Typography>No pending lab tests.</Typography>
            ) : (
              <TableContainer sx={{ maxHeight: "28vh" }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Patient</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Result File</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Diagnosis</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Submit</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {labTests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell>{test.patient_name}</TableCell>
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
                              onClick={() => fetchDownloadUrl(test.id)}
                              variant="text"
                              color="primary"
                            >
                              Get Download Link
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            type="text"
                            placeholder="Enter diagnosis"
                            value={diagnosisMap[test.id] || ""}
                            onChange={(e) =>
                              handleDiagnosisChange(test.id, e.target.value)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleSubmitDiagnosis(test.id)}
                            variant="contained"
                            color="primary"
                          >
                            Submit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Staff;
