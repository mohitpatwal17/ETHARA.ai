import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        overdue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/tasks/stats');
            setStats(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching stats', err);
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center font-medium">Loading Dashboard Data...</div>;

    return (
        <div className="bg-gray-100 min-h-screen pb-10">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 pt-10">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Team Dashboard</h1>
                        <p className="text-gray-600 text-sm">Quick overview of task status and team productivity</p>
                    </div>
                    <button 
                        onClick={fetchStats}
                        className="bg-white px-4 py-2 rounded shadow text-sm font-bold text-gray-600 hover:bg-gray-50"
                    >
                        Refresh Data
                    </button>
                </div>
                
                {/* Simple 4-Card Layout */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
                        <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Total Tasks</div>
                        <div className="text-3xl font-black">{stats.total}</div>
                    </div>
                    <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
                        <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Completed</div>
                        <div className="text-3xl font-black">{stats.completed}</div>
                    </div>
                    <div className="bg-white p-6 rounded shadow border-l-4 border-yellow-500">
                        <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Pending</div>
                        <div className="text-3xl font-black">{stats.pending}</div>
                    </div>
                    <div className="bg-white p-6 rounded shadow border-l-4 border-red-500">
                        <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Overdue</div>
                        <div className="text-3xl font-black">{stats.overdue}</div>
                    </div>
                </div>

                {/* Status List Section */}
                <div className="mt-10 bg-white p-8 rounded shadow">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 pb-2 border-b">Task Distribution</h2>
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Completion rate</span>
                            <span className="text-sm font-bold text-green-600">
                                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div 
                                className="bg-green-500 h-full transition-all duration-700" 
                                style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
