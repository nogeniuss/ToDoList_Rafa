import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Save, ArrowLeft, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Sidebar } from '../componentes/SideBar';


const EditUser = () => {
  const [userData, setUserData] = useState({
    id: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const API_URL = 'https://todolist-backend-w4uu.onrender.com';
  const TOKEN = localStorage.getItem('accessToken');
  const USER = localStorage.getItem('idUser');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/${USER}`, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      });
      const data = await response.json();
      setUserData({
        ...userData,
        id: data.id,
        email: data.email
      });
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };

  const handleUpdateEmail = async () => {
    if (!userData.email) {
      setMessage({ type: 'error', text: 'Email é obrigatório' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_URL}/auth/${USER}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`
        },
        body: JSON.stringify({ email: userData.email })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Email atualizado com sucesso!' });
      } else {
        setMessage({ type: 'error', text: 'Erro ao atualizar email' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar email' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!userData.newPassword || !userData.confirmPassword) {
      setMessage({ type: 'error', text: 'Preencha todos os campos de senha' });
      return;
    }

    if (userData.newPassword !== userData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' });
      return;
    }

    if (userData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter no mínimo 6 caracteres' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_URL}/auth/${USER}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`
        },
        body: JSON.stringify({ password: userData.newPassword })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Senha atualizada com sucesso!' });
        setUserData({
          ...userData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage({ type: 'error', text: 'Erro ao atualizar senha' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar senha' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.')) return;
    if (!window.confirm('ATENÇÃO: Todas as suas tasks serão deletadas. Deseja continuar?')) return;

    try {
      const response = await fetch(`${API_URL}/auth/${USER}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      });

      if (response.ok) {
        alert('Conta deletada com sucesso!');
        window.location.href = '/login';
      } else {
        setMessage({ type: 'error', text: 'Erro ao deletar conta' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao deletar conta' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <Sidebar />
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Meu Perfil</h1>
                <p className="text-blue-100 mt-1">Gerencie suas informações pessoais</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {message.text && (
              <div
                className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
              >
                {message.text}
              </div>
            )}

            <div className="space-y-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  Alterar Email
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Novo Email
                    </label>
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <button
                    onClick={handleUpdateEmail}
                    disabled={loading}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md"
                  >
                    <Save className="w-5 h-5" />
                    Salvar Email
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  Alterar Senha
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nova Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={userData.newPassword}
                        onChange={(e) =>
                          setUserData({ ...userData, newPassword: e.target.value })
                        }
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Digite a nova senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Nova Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={userData.confirmPassword}
                        onChange={(e) =>
                          setUserData({ ...userData, confirmPassword: e.target.value })
                        }
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Confirme a nova senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleUpdatePassword}
                    disabled={loading}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md"
                  >
                    <Save className="w-5 h-5" />
                    Salvar Senha
                  </button>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <Trash2 className="w-5 h-5" />
                  Zona de Perigo
                </h2>
                <p className="text-red-600 mb-4">
                  Ao deletar sua conta, todas as suas tasks serão permanentemente removidas. Esta ação não pode ser desfeita.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-md"
                >
                  <Trash2 className="w-5 h-5" />
                  Deletar Conta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
