import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';

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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Healthcare Portal Login</h2>

                {error && <div className="mb-4 text-sm text-red-500">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Login
                    </button>
                </form>
                <div className="text-center mt-4">
                    <span className="text-sm text-gray-600">Don't have an account? </span>
                    <button onClick={() => navigate('/register')} className="text-blue-600 hover:underline">Register</button>
                </div>
            </div>
        </div>
    );
};

export default Login;
