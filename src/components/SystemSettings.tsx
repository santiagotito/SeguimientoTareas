import React, { useState, useEffect } from 'react';
import { Save, Upload, Settings, Layout, Type } from 'lucide-react';
import { SystemConfig } from '../types';
import { sheetsService } from '../services/sheetsService';

interface SystemSettingsProps {
    config: SystemConfig;
    onUpdate: (config: SystemConfig) => void;
    onSaveStart?: () => void;
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({ config, onUpdate, onSaveStart }) => {
    const [formData, setFormData] = useState<SystemConfig>(config);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        setFormData(config);
    }, [config]);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) { // 1MB limit for Sheets
                alert('El logo es muy pesado. Por favor usa una imagen menor a 1MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, logo: reader.result as string }));
                // Activar cooldown para evitar que sync sobrescriba la previsualización
                if (onSaveStart) onSaveStart();
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus('idle');
        try {
            if (onSaveStart) onSaveStart();

            // Normalizar config antes de guardar
            const normalizedConfig = {
                appName: formData.appName || 'Tráfico Analítica RAM',
                logo: (formData.logo && formData.logo.trim() !== '') ? formData.logo : 'https://rangle.ec/img/ram.webp'
            };

            await sheetsService.saveSystemConfig(normalizedConfig);

            // Actualizar estado local con config normalizado
            onUpdate(normalizedConfig);
            setFormData(normalizedConfig);

            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (error) {
            console.error('Error saving config:', error);
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-ram-navy text-white rounded-lg">
                            <Settings size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Configuración del Sistema</h2>
                            <p className="text-sm text-gray-500">Personaliza la identidad visual de tu plataforma</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Nombre de la Aplicación */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        <div className="flex items-center gap-2 text-gray-700 font-semibold">
                            <Type size={18} className="text-ram-blue" />
                            <span>Nombre de la App</span>
                        </div>
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                value={formData.appName}
                                onChange={(e) => setFormData(prev => ({ ...prev, appName: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-ram-blue/20 focus:border-ram-blue transition-all"
                                placeholder="Ej. Tráfico Analítica RAM"
                            />
                            <p className="mt-2 text-xs text-gray-400">Este nombre aparecerá en la pantalla de inicio de sesión y en el título de la página.</p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Logo de la Aplicación */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        <div className="flex items-center gap-2 text-gray-700 font-semibold">
                            <Layout size={18} className="text-ram-blue" />
                            <span>Logo de la App</span>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                            <div className="flex items-center gap-6">
                                <div className="h-20 w-20 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative group">
                                    {formData.logo ? (
                                        <img src={formData.logo} alt="Logo Preview" className="h-full w-full object-contain p-2" />
                                    ) : (
                                        <span className="text-xs text-gray-400">Sin Logo</span>
                                    )}
                                    <label className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                        <Upload size={20} />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                                    </label>
                                </div>
                                <div className="flex-1">
                                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors shadow-sm">
                                        <Upload size={16} />
                                        Seleccionar Imagen
                                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                                    </label>
                                    <p className="mt-2 text-xs text-gray-400">Recomendado: fondo transparente y formato circular o cuadrado. Máx 1MB.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end items-center gap-4">
                    {saveStatus === 'success' && (
                        <span className="text-sm text-green-600 font-medium">¡Configuración guardada!</span>
                    )}
                    {saveStatus === 'error' && (
                        <span className="text-sm text-red-600 font-medium">Error al guardar</span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-ram-navy hover:bg-ram-navy/90 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-ram-navy/20 disabled:opacity-70"
                    >
                        {isSaving ? (
                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        Guardar Cambios
                    </button>
                </div>
            </div>

            {/* Vista Previa */}
            <div className="bg-ram-navy rounded-2xl p-8 text-white shadow-xl">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white/50 mb-6">Vista Previa en Login</h3>
                <div className="flex flex-col items-center max-w-xs mx-auto text-center space-y-4">
                    <div className="h-20 w-20 bg-white p-3 rounded-2xl shadow-inner">
                        {formData.logo ? (
                            <img src={formData.logo} alt="Logo" className="h-full w-full object-contain" />
                        ) : (
                            <div className="h-full w-full bg-ram-blue rounded-xl" />
                        )}
                    </div>
                    <div>
                        <h4 className="text-2xl font-bold">{formData.appName}</h4>
                        <p className="text-white/60 text-sm">Panel de Gestión Operativa</p>
                    </div>
                    <div className="w-full h-10 bg-white/10 rounded-lg mt-4" />
                    <div className="w-full h-10 bg-white/10 rounded-lg" />
                </div>
            </div>
        </div>
    );
};
