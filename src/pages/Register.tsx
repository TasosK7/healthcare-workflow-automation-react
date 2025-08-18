import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import axios from 'axios';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    Box,
    Avatar,
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import {motion} from "framer-motion";

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [success, setSuccess] = useState('');

    const isFormValid =
        form.first_name.trim() &&
        form.last_name.trim() &&
        email.trim() &&
        username.trim() &&
        form.password.trim() &&
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
        }, 500); // 500ms delay after typing

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
        }, 500); // 500ms delay after typing

        return () => clearTimeout(delayDebounce);
    }, [username]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', {...form, email, username});
            setSuccess('Registration successful! You can now log in.');
            setError('');
            setTimeout(() => navigate('/login'), 2000)
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.detail || 'Registration failed');
            } else {
                setError('Registration failed');
            }
            setSuccess('');
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
            }}
        >
            <Container maxWidth="xs">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper elevation={6} sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
                        <Avatar
                            sx={{
                                bgcolor: "transparent",
                                width: 56,
                                height: 56,
                                mx: "auto",
                                mb: 2,
                            }}
                        >
                            <img
                                src="/cardiogram.png"
                                alt="Logo"
                                style={{ width: 50, height: 50 }}
                            />
                        </Avatar>

                        <Typography color="primary" variant="h5" gutterBottom>
                            Register
                        </Typography>

                        {success && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                {success}
                            </Alert>
                        )}
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}


                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                name="first_name"
                                label="First Name"
                                fullWidth
                                required
                                margin="normal"
                                value={form.first_name}
                                onChange={handleChange}
                            />
                            <TextField
                                name="last_name"
                                label="Last Name"
                                fullWidth
                                required
                                margin="normal"
                                value={form.last_name}
                                onChange={handleChange}
                            />
                            <TextField
                                type="email"
                                label="Email"
                                fullWidth
                                required
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={!!emailError}
                                helperText={emailError}
                            />
                            <TextField
                                label="Username"
                                fullWidth
                                required
                                margin="normal"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                error={!!usernameError}
                                helperText={usernameError}
                            />
                            <TextField
                                name="password"
                                type="password"
                                label="Password"
                                fullWidth
                                required
                                margin="normal"
                                value={form.password}
                                onChange={handleChange}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={!isFormValid}
                                sx={{ mt: 2, py: 1.2 }}
                            >
                                Register
                            </Button>
                        </Box>

                        <Typography variant="body2" sx={{ mt: 2 }}>
                            Already have an account?{" "}
                            <Button variant="text" onClick={() => navigate("/login")}>
                                Login
                            </Button>
                        </Typography>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
};

export default Register;
