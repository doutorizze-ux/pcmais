import { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
import { Plus, Trash2, Wrench, DollarSign, PenTool } from 'lucide-react';
// import { API_URL } from '../config';

interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    durationMinutes: number;
}

export function ServicesPage() {
    // const { token } = useAuth();
    const [services, setServices] = useState<Service[]>([]);
    // const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [formData, setFormData] = useState<Partial<Service>>({
        name: '',
        description: '',
        price: 0,
        durationMinutes: 60
    });

    useEffect(() => {
        fetchServices();
    }, []);

    // Mock fetch for now, assuming backend endpoint might not exist yet or we reuse products?
    // User requested "Services Page" for stores to register services.
    // We'll create a simple local state management or try to hit a generic endpoint if available.
    // For now, let's simulate or use a new endpoint if we created one.
    // Looking at file list, we don't have a services module.
    // We should probably use local state or a placeholder until backend is ready.
    // BUT, since we are "transforming" the app, let's assume we might need to create it later.
    // For this specific request "Menu and Page of Services", I will build the Frontend UI.

    const fetchServices = async () => {
        try {
            // Placeholder: In a real scenario, we'd fetch from API
            // const res = await fetch(`${API_URL}/services`, { ... });
            // For now, let's just mock it or leave emptiness
            setServices([
                { id: '1', name: 'Formatação', description: 'Formatação completa com backup', price: 120.00, durationMinutes: 120 },
                { id: '2', name: 'Limpeza Completa', description: 'Limpeza interna e troca de pasta térmica', price: 150.00, durationMinutes: 90 },
                { id: '3', name: 'Instalação de SSD', description: 'Mão de obra para instalação e clonagem', price: 80.00, durationMinutes: 60 },
            ]);
        } catch (error) {
            console.error(error);
        } finally {
            // setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Mock save
        if (editingService) {
            setServices(services.map(s => s.id === editingService.id ? { ...s, ...formData } as Service : s));
        } else {
            setServices([...services, { ...formData, id: Math.random().toString() } as Service]);
        }
        setIsModalOpen(false);
        setEditingService(null);
        setFormData({ name: '', description: '', price: 0, durationMinutes: 60 });
    };

    const handleDelete = (id: string) => {
        if (confirm('Tem certeza que deseja excluir este serviço?')) {
            setServices(services.filter(s => s.id !== id));
        }
    };

    const openEdit = (service: Service) => {
        setEditingService(service);
        setFormData(service);
        setIsModalOpen(true);
    };

    const openNew = () => {
        setEditingService(null);
        setFormData({ name: '', description: '', price: 0, durationMinutes: 60 });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Wrench className="w-6 h-6 text-orange-500" />
                        Serviços da Loja
                    </h1>
                    <p className="text-gray-500">Gerencie o catálogo de serviços oferecidos pela sua assistência.</p>
                </div>
                <button
                    onClick={openNew}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all font-bold"
                >
                    <Plus className="w-4 h-4" /> Novo Serviço
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                    <div key={service.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                                    <PenTool className="w-6 h-6" />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openEdit(service)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <Wrench className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(service.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
                            <p className="text-gray-500 text-sm mb-6 h-10 line-clamp-2">{service.description}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Valor</p>
                                    <p className="text-xl font-black text-gray-900">R$ {service.price.toFixed(2)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Tempo</p>
                                    <p className="text-sm font-bold text-gray-700">{service.durationMinutes} min</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            {editingService ? <Wrench className="w-6 h-6 text-orange-500" /> : <Plus className="w-6 h-6 text-orange-500" />}
                            {editingService ? 'Editar Serviço' : 'Novo Serviço'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nome do Serviço</label>
                                <input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium"
                                    placeholder="Ex: Formatação"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Descrição</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none h-24"
                                    placeholder="O que está incluso neste serviço?"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Preço (R$)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                            className="w-full pl-9 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-bold text-gray-900"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Duração (min)</label>
                                    <input
                                        type="number"
                                        value={formData.durationMinutes}
                                        onChange={e => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 px-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 px-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
                                >
                                    Salvar Serviço
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
