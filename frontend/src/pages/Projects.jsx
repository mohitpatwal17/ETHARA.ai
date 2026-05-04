import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({ title: '', description: '' });
    const [showForm, setShowForm] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data);
        } catch (err) {
            console.error('Error fetching projects', err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/projects', newProject);
            setNewProject({ title: '', description: '' });
            setShowForm(false);
            fetchProjects();
        } catch (err) {
            alert('Failed to create project');
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen pb-10">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 pt-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
                        <p className="text-gray-600 text-sm">Organize your team's work into projects</p>
                    </div>
                    {user?.role === 'admin' && (
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-indigo-600 text-white px-5 py-2 rounded font-bold shadow hover:bg-indigo-700 transition-colors"
                        >
                            {showForm ? 'Cancel' : 'Create Project'}
                        </button>
                    )}
                </div>

                {showForm && (
                    <div className="bg-white p-8 rounded shadow mb-10 border-t-4 border-indigo-500">
                        <h2 className="text-xl font-bold mb-6">New Project</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-indigo-200 outline-none"
                                    value={newProject.title}
                                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full px-4 py-2 border rounded outline-none h-24"
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="bg-green-600 text-white px-8 py-2 rounded font-bold hover:bg-green-700">
                                Save Project
                            </button>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <div key={project._id} className="bg-white p-6 rounded shadow hover:border-indigo-400 border-2 border-transparent transition-all">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                            <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                                {project.description || 'No description provided.'}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-1">
                                {project.members?.map(m => (
                                    <span key={m._id} className="text-[9px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded border">
                                        {m.name}
                                    </span>
                                ))}
                            </div>
                            <div className="pt-4 mt-4 border-t flex justify-between items-center text-[10px] text-gray-400">
                                <span className="font-bold uppercase tracking-widest">{project.members?.length || 0} Members</span>
                                <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                            {user?.role === 'admin' && (
                                <AddMemberForm projectId={project._id} />
                            )}
                        </div>
                    ))}
                    {projects.length === 0 && (
                        <div className="col-span-full py-20 text-center text-gray-400">
                            No projects found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AddMemberForm = ({ projectId }) => {
    const [email, setEmail] = useState('');
    
    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/projects/${projectId}/add-member`, { email });
            alert('Member added!');
            setEmail('');
        } catch (err) {
            alert(err.response?.data?.message || 'Error adding member');
        }
    };

    return (
        <form onSubmit={handleAdd} className="mt-4 pt-4 border-t flex space-x-2">
            <input
                type="email"
                className="flex-1 text-xs p-2 border rounded bg-gray-50 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Member email"
                required
            />
            <button type="submit" className="bg-gray-800 text-white text-[10px] px-3 py-1 rounded font-bold uppercase tracking-tighter">
                Add
            </button>
        </form>
    );
};

export default Projects;
