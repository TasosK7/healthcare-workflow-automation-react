import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import axios from 'axios';

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
            alert('Registration successful! You can now log in.');
            navigate('/login');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.detail || 'Registration failed');
            } else {
                setError('Registration failed');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Register as Patient</h2>
                {error && <div className="mb-4 text-sm text-red-500">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name" className="w-full px-4 py-2 border rounded" />
                    <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" className="w-full px-4 py-2 border rounded" />
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded"
                        placeholder="Email"
                    />
                    {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border rounded"
                        placeholder="Username"
                    />
                    {usernameError && <p className="text-red-500 text-sm">{usernameError}</p>}
                    <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full px-4 py-2 border rounded" />
                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className={`w-full py-2 rounded text-white ${
                            !isFormValid
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
