import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">TeamTask</Link>
            <div className="flex items-center space-x-6">
                <Link to="/" className="hover:text-blue-600 font-medium">Dashboard</Link>
                <Link to="/team" className="hover:text-blue-600 font-medium">Team</Link>
                <Link to="/projects" className="hover:text-blue-600 font-medium">Projects</Link>
                <Link to="/tasks" className="hover:text-blue-600 font-medium">Tasks</Link>
                {user && (
                    <div className="flex items-center space-x-4">
                        <span className="text-sm bg-gray-200 px-2 py-1 rounded">
                            {user.name} ({user.role})
                        </span>
                        <button
                            onClick={handleLogout}
                            className="text-red-500 hover:text-red-700"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
