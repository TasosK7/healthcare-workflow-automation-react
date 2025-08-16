import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
// import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    Box,
    Avatar
} from "@mui/material";
import { motion } from "framer-motion";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await login(username, password);
            localStorage.setItem('authToken', result.access_token);
            localStorage.setItem('userRole', result.user.role);
            localStorage.setItem('userEmail', result.user.email);

            switch (result.user.role) {
                case 'admin':
                case 'hr':
                    navigate('/dashboard');
                    break;
                case 'staff':
                    navigate('/staff');
                    break;
                case 'patient':
                    navigate('/patient');
                    break;
                default:
                    navigate('/login');
            }        } catch {
            setError('Login failed: Invalid credentials');
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
                    <Paper
                        elevation={6}
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            textAlign: "center",
                        }}
                    >
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

                        <Typography variant="h5" gutterBottom>
                            Healthcare Portal Login
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleLogin}>
                            <TextField
                                label="Username"
                                fullWidth
                                required
                                margin="normal"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                label="Password"
                                type="password"
                                fullWidth
                                required
                                margin="normal"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2, py: 1.2 }}
                            >
                                Login
                            </Button>
                        </Box>

                        <Typography variant="body2" sx={{ mt: 2 }}>
                            Don’t have an account?{" "}
                            <Button variant="text" onClick={() => navigate("/register")}>
                                Register
                            </Button>
                        </Typography>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
};

export default Login;
