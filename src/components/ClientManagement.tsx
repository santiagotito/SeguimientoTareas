import React, { useState } from 'react';
import { Client } from '../types';
import { Building2, Plus, Edit, Trash2, X, Save } from 'lucide-react';

interface ClientManagementProps {
  clients: Client[];
  onCreateClient: (client: Client) => void;
  onUpdateClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
}

export const ClientManagement: React.FC<ClientManagementProps> = ({ 
  clients, 
  onCreateClient, 
  onUpdateClient, 
  onDeleteClient 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({ name: client.name });
    } else {
      setEditingClient(null);
      setFormData({ name: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    if (editingClient) {
      onUpdateClient({ id: editingClient.id, name: formData.name });
    } else {
      const newClient: Client = {
        id: `c${Date.now()}`,
        name: formData.name
      };
      onCreateClient(newClient);
    }

    setShowModal(false);
    setFormData({ name: '' });
    setEditingClient(null);
  };

  const handleDelete = (clientId: string) => {
    onDeleteClient(clientId);
    setDeleteConfirm(null);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Clientes</h2>
          <p className="text-sm text-gray-500 mt-1">Administra los clientes del proyecto</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow-sm"
        >
          <Plus size={18} />
          Nuevo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map(client => (
          <div key={client.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <Building2 size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">{client.name}</h3>
                  <p className="text-xs text-gray-500">ID: {client.id}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(client)}
                  className="text-gray-400 hover:text-blue-600 p-1"
                  title="Editar"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => setDeleteConfirm(client.id)}
                  className="text-gray-400 hover:text-red-600 p-1"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {deleteConfirm === client.id && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 mb-2">¿Eliminar este cliente?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-1 rounded"
                  >
                    Sí, eliminar
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs py-1 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="text-center py-12">
          <Building2 size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No hay clientes registrados</p>
          <button
            onClick={() => handleOpenModal()}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Crear primer cliente
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Cliente *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Coca-Cola"
                  required
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg"
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
