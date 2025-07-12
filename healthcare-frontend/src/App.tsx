import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import Staff from './pages/Staff';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/departments" element={<Departments />} />
                <Route path="/staff" element={<Staff />} />
            </Routes>
        </Router>
    );
}

export default App;
