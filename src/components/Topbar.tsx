import { useNavigate } from 'react-router-dom';

const Topbar = () => {
    const navigate = useNavigate();
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');

    const logout = () => {
        localStorage.clear();
        window.dispatchEvent(new Event("storage"));
        navigate('/login');
    };

    return (
        <div className="w-full bg-white shadow flex justify-between items-center px-6 py-3 mb-6">
            <div className="text-lg font-semibold text-gray-700">Healthcare Portal</div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>
          {email} ({role})
        </span>
                <button
                    onClick={logout}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Topbar;
