import React, { useState } from 'react';
import { User } from '../types';
import { Users, Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';

interface TeamManagementProps {
  users: User[];
  onUpdateUsers: (users: User[]) => void;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({ users, onUpdateUsers }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    role: 'Analyst' as User['role'],
    avatar: ''
  });

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password || '',
        role: user.role,
        avatar: user.avatar
      });
    } else {
      setEditingUser(null);
      setFormData({
        id: `u${Date.now()}`,
        name: '',
        email: '',
        password: '',
        role: 'Analyst',
        avatar: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let newUsers: User[];
    if (editingUser) {
      // Editar usuario existente
      newUsers = users.map(u => u.id === editingUser.id ? { ...formData } : u);
    } else {
      // Crear nuevo usuario
      if (!formData.avatar) {
        formData.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`;
      }
      newUsers = [...users, { ...formData }];
    }
    
    onUpdateUsers(newUsers);
    handleCloseModal();
  };

  const handleDelete = (userId: string) => {
    if (confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      const newUsers = users.filter(u => u.id !== userId);
      onUpdateUsers(newUsers);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Equipo</h2>
          <p className="text-sm text-gray-500 mt-1">{users.length} miembros del equipo</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#0078D4] hover:bg-[#006cbd] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} />
          Nuevo Miembro
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(user => (
          <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 truncate">{user.name}</h3>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                <span className="inline-block mt-2 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                  {user.role}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => handleOpenModal(user)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit size={14} />
                Editar
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={14} />
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">
                {editingUser ? 'Editar Miembro' : 'Nuevo Miembro del Equipo'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={formData.avatar || 'https://ui-avatars.com/api/?name=Usuario&background=cccccc'}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                  />
                  <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg">
                    <Upload size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">Click para subir foto</p>
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="usuario@rangle.ec"
                  required
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña {editingUser && '(dejar vacío para no cambiar)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required={!editingUser}
                />
              </div>

              {/* Rol */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Manager">Manager</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Data Engineer">Data Engineer</option>
                  <option value="Analyst">Analyst</option>
                </select>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#0078D4] text-white rounded-lg hover:bg-[#006cbd] flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
