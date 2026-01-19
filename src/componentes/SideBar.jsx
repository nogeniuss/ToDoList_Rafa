import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckSquare, User, LogOut, Mail, Menu, X } from 'lucide-react';

export const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userEmail, setUserEmail] = useState('');
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const email = localStorage.getItem('email');
        setUserEmail(email || 'Usuário');
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('email');
        localStorage.removeItem('idUser');

        navigate('/login');
    };

    const menuItems = [
        {
            path: '/task',
            label: 'Tarefas',
            icon: CheckSquare,
        },
        {
            path: '/perfil',
            label: 'Perfil',
            icon: User,
        },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-gradient-to-b from-indigo-600 to-indigo-800 text-white shadow-2xl z-40 transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 w-64`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-indigo-500">
                        <h1 className="text-2xl font-bold text-center">ToDoList do Rafa</h1>
                    </div>

                    {/* User Info */}
                    <div className="p-4 bg-indigo-700 bg-opacity-50">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white bg-opacity-20 p-2 rounded-full">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-indigo-200">Logado como</p>
                                <p className="text-sm font-semibold truncate">{userEmail}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex-1 p-4 space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => {
                                        navigate(item.path);
                                        setIsMobileOpen(false);
                                    }}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive(item.path)
                                            ? 'bg-white text-indigo-600 shadow-lg font-semibold'
                                            : 'text-white hover:bg-indigo-500 hover:bg-opacity-50'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Logout Button */}
                    <div className="p-4 border-t border-indigo-500">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white hover:bg-red-500 hover:bg-opacity-50 transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Sair</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Spacer for content (desktop only) */}
            <div className="hidden lg:block w-64" />
        </>
    );
};

