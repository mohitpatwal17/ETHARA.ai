import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const { user } = useContext(AuthContext);

    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        assignedUser: '',
        project: '',
        dueDate: ''
    });

    useEffect(() => {
        if (user) {
            fetchTasks();
            if (user.role === 'admin') {
                fetchProjects();
                fetchUsers();
            }
        }
    }, [user]);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (err) {
            console.error('Error fetching tasks', err);
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data);
        } catch (err) {
            console.error('Error fetching projects', err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Error fetching users', err);
            alert('Failed to load team members. Please refresh the page.');
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks', newTask);
            setShowForm(false);
            setNewTask({ title: '', description: '', assignedUser: '', project: '', dueDate: '' });
            fetchTasks();
        } catch (err) {
            alert('Error creating task: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await api.put(`/tasks/${taskId}`, { status: newStatus });
            fetchTasks();
        } catch (err) {
            alert('Error updating status');
        }
    };

    const handleDelete = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await api.delete(`/tasks/${taskId}`);
                fetchTasks();
            } catch (err) {
                alert('Error deleting task');
            }
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen pb-10">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 pt-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
                        <p className="text-gray-600 text-sm">Create and track progress of your items</p>
                    </div>
                    {user?.role === 'admin' && (
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-indigo-600 text-white px-5 py-2 rounded font-bold shadow hover:bg-indigo-700 transition-colors"
                        >
                            {showForm ? 'Cancel' : 'Add New Task'}
                        </button>
                    )}
                </div>

                {showForm && (
                    <div className="bg-white p-8 rounded shadow mb-10 border-t-4 border-indigo-500">
                        <h2 className="text-xl font-bold mb-6">Create Task</h2>
                        <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Task Title</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-indigo-200 outline-none"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Project</label>
                                <select
                                    className="w-full px-4 py-2 border rounded bg-white outline-none"
                                    value={newTask.project}
                                    onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                                    required
                                >
                                    <option value="">-- Select Project --</option>
                                    {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Assign Member</label>
                                <select
                                    className="w-full px-4 py-2 border rounded bg-white outline-none"
                                    value={newTask.assignedUser}
                                    onChange={(e) => setNewTask({ ...newTask, assignedUser: e.target.value })}
                                    required
                                >
                                    <option value="">-- Select User --</option>
                                    {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Due Date</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border rounded outline-none"
                                    value={newTask.dueDate}
                                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <button type="submit" className="bg-green-600 text-white px-8 py-2 rounded font-bold hover:bg-green-700">
                                    Save Task
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded shadow overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr className="text-gray-600 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Task Name</th>
                                <th className="px-6 py-4">Project</th>
                                <th className="px-6 py-4">Assigned To</th>
                                <th className="px-6 py-4">Due Date</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {tasks.map(task => (
                                <tr key={task._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                            className={`text-[10px] font-black uppercase px-2 py-1 rounded border-none outline-none cursor-pointer ${
                                                task.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                                                task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">Working</option>
                                            <option value="Completed">Done</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`font-bold text-gray-800 ${task.status === 'Completed' ? 'line-through opacity-50' : ''}`}>
                                            {task.title}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {task.project?.title || 'General'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {task.assignedUser?.name || 'Unassigned'}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <span className={new Date(task.dueDate) < new Date() && task.status !== 'Completed' ? 'text-red-600' : 'text-gray-500'}>
                                            {new Date(task.dueDate).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {user?.role === 'admin' && (
                                            <button
                                                onClick={() => handleDelete(task._id)}
                                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {tasks.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-400 italic">
                                        No tasks found. Try adding a new task!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Tasks;
