import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Calendar, AlertCircle } from 'lucide-react';
import { Sidebar } from '../componentes/SideBar';

//variaveis unicas
const API_URL = 'https://todolist-backend-w4uu.onrender.com';
const TOKEN = localStorage.getItem('accessToken');
const USER = localStorage.getItem('idUser');


const TaskCRUD = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id_user: USER,
    titulo: '',
    descricao: '',
    data: '',
    prioridade: 2,
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      if (!TOKEN || !USER) return;

      const response = await fetch(`${API_URL}/tasks`, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      });
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Erro ao buscar tasks:', error);
    }
  };

  const handleSubmit = async () => {
    if (!TOKEN || !USER) {
      return
    };
    setLoading(true);
    try {

      const url = editingTask
        ? `${API_URL}/tasks/${editingTask.id}`
        : `${API_URL}/tasks`;

      const method = editingTask ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchTasks();
        closeModal();
      }
    } catch (error) {
      console.error('Erro ao salvar task:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Deseja realmente deletar esta task?')) return;

    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      });
      await fetchTasks();
    } catch (error) {
      console.error('Erro ao deletar task:', error);
    }
  };

  const toggleComplete = async (id) => {
    try {
      await fetch(`${API_URL}/tasks/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      });
      await fetchTasks();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const openModal = (task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        titulo: task.titulo,
        descricao: task.descricao || '',
        data: task.data.split('T')[0],
        prioridade: parseInt(task.prioridade),
        id_user: task.id_user
      });
    } else {
      setEditingTask(null);
      setFormData({
        titulo: '',
        descricao: '',
        data: new Date().toISOString().split('T')[0],
        prioridade: 2,
        id_user: USER
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const getPriorityColor = (prioridade) => {
    switch (prioridade) {
      case '1': return 'bg-red-100 text-red-800';
      case '2': return 'bg-yellow-100 text-yellow-800';
      case '3': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (prioridade) => {
    switch (prioridade) {
      case '1': return 'Alta';
      case '2': return 'Média';
      case '3': return 'Baixa';
      default: return 'Indefinida';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Sidebar />
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Minhas Tasks</h1>
              <p className="text-gray-600 mt-1">Gerencie suas tarefas diárias</p>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <Plus className="w-5 h-5" />
              Nova Task
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {tasks?.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg ${task.concluida ? 'opacity-60' : ''
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.concluida
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-green-500'
                      }`}
                  >
                    {task.concluida && <Check className="w-4 h-4 text-white" />}
                  </button>

                  <div className="flex-1">
                    <h3
                      className={`text-xl font-semibold ${task.concluida ? 'line-through text-gray-500' : 'text-gray-800'
                        }`}
                    >
                      {task.titulo}
                    </h3>
                    {task.descricao && (
                      <p className="text-gray-600 mt-2">{task.descricao}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(task.data).toLocaleDateString('pt-BR')}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                          task.prioridade
                        )}`}
                      >
                        {getPriorityText(task.prioridade)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(task)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nenhuma task encontrada</p>
              <p className="text-gray-400 mt-2">Clique em "Nova Task" para começar</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingTask ? 'Editar Task' : 'Nova Task'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Digite o título da task"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  rows={3}
                  placeholder="Adicione uma descrição (opcional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data
                </label>
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) =>
                    setFormData({ ...formData, data: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridade
                </label>
                <select
                  value={formData.prioridade}
                  onChange={(e) =>
                    setFormData({ ...formData, prioridade: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value={1}>Alta</option>
                  <option value={2}>Média</option>
                  <option value={3}>Baixa</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
              <button
                onClick={closeModal}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.titulo}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCRUD;
