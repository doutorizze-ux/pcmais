import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { X, Upload, Save, Trash2, Loader2 } from 'lucide-react';
import { API_URL } from '../config';

interface Product {
    id: string;
    name: string;
    brand: string;
    model: string;
    category?: string; // e.g. Hardware, Periferico
    condition: 'Novo' | 'Usado' | 'Open Box';
    price: number;
    costPrice?: number;
    stock: number;
    description: string;
    images?: string[];
}

interface ProductManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: Product | null;
}

export function ProductManagerModal({ isOpen, onClose, onSuccess, initialData }: ProductManagerModalProps) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        brand: '',
        model: '',
        category: 'Hardware',
        condition: 'Novo',
        price: 0,
        costPrice: 0,
        stock: 1,
        description: '',
        images: []
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData({
                    name: '',
                    brand: '',
                    model: '',
                    category: 'Hardware',
                    condition: 'Novo',
                    price: 0,
                    costPrice: 0,
                    stock: 1,
                    description: '',
                    images: []
                });
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const url = initialData ? `${API_URL}/products/${initialData.id}` : `${API_URL}/products`;
            const method = initialData ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const err = await res.json();
                alert(err.message || 'Falha ao salvar produto');
                return;
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Erro ao conectar com o servidor');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!initialData || !confirm('Tem certeza que deseja excluir este produto?')) return;
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/products/${initialData.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                alert('Erro ao excluir');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        // If create mode, we need to create first or handle temp upload (simplification: block upload on create or force create)
        // For better UX, allow saving first.
        if (!initialData) {
            alert('Salve o produto antes de adicionar fotos.');
            return;
        }

        setUploading(true);
        const files = Array.from(e.target.files);
        const uploadData = new FormData();
        files.forEach(f => uploadData.append('files', f));

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/products/${initialData.id}/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: uploadData
            });

            if (res.ok) {
                // Refresh data happens via parent fetch or local update
                // Since this component uses onSuccess to refresh parent, we can just trigger that or simpler:
                onSuccess();
                // But we also need to update local state to show new images immediately if we don't close
                // Ideally backend returns updated entity
                onClose(); // Close to refresh simply
            } else {
                alert('Falha no upload');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setUploading(false);
        }
    }

    const getImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        const baseUrl = API_URL.replace('/api', ''); // simplistic guess if API_URL includes /api
        // Better: assume API_URL is backend base
        return `${API_URL}${url}`;
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                                <div className="flex justify-between items-center mb-6">
                                    <Dialog.Title as="h3" className="text-xl font-bold text-gray-900">
                                        {initialData ? 'Editar Produto' : 'Novo Produto'}
                                    </Dialog.Title>
                                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Basic Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                                                placeholder="Ex: RTX 4060, Processador i5"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.brand}
                                                onChange={e => setFormData({ ...formData, brand: e.target.value })}
                                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                                                placeholder="Ex: Asus, Intel, Logitech"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                                            <input
                                                type="text"
                                                value={formData.model}
                                                onChange={e => setFormData({ ...formData, model: e.target.value })}
                                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                                                placeholder="Ex: Dual OC 8GB"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                                            <select
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                                            >
                                                <option value="Hardware">Hardware</option>
                                                <option value="Computadores">Computadores</option>
                                                <option value="Notebooks">Notebooks</option>
                                                <option value="Periféricos">Periféricos</option>
                                                <option value="Monitores">Monitores</option>
                                                <option value="Outros">Outros</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Pricing & Condition */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Venda (R$)</label>
                                            <input
                                                type="number"
                                                required
                                                step="0.01"
                                                value={formData.price}
                                                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none font-bold text-orange-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Custo (R$)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.costPrice}
                                                onChange={e => setFormData({ ...formData, costPrice: parseFloat(e.target.value) })}
                                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-gray-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
                                            <input
                                                type="number"
                                                required
                                                value={formData.stock}
                                                onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Condição</label>
                                        <div className="flex gap-4">
                                            {['Novo', 'Usado', 'Open Box'].map(c => (
                                                <label key={c} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="condition"
                                                        value={c}
                                                        checked={formData.condition === c}
                                                        onChange={e => setFormData({ ...formData, condition: e.target.value as any })}
                                                        className="w-4 h-4 text-orange-600"
                                                    />
                                                    <span>{c}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Detalhada</label>
                                        <textarea
                                            rows={4}
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                                            placeholder="Detalhes técnicos, estado de conservação, garantia..."
                                        />
                                    </div>

                                    {/* Images */}
                                    {initialData && (
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Fotos do Produto</label>
                                            <div className="grid grid-cols-4 gap-4">
                                                {initialData.images?.map((img, idx) => (
                                                    <div key={idx} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                        <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                                <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                                                    {uploading ? (
                                                        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                                                    ) : (
                                                        <>
                                                            <Upload className="w-6 h-6 text-gray-400 mb-1" />
                                                            <span className="text-xs text-gray-500">Adicionar</span>
                                                        </>
                                                    )}
                                                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                </label>
                                            </div>
                                        </div>
                                    )}


                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        {initialData && (
                                            <button
                                                type="button"
                                                onClick={handleDelete}
                                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Excluir
                                            </button>
                                        )}
                                        <div className={`flex gap-3 ${!initialData ? 'ml-auto' : ''}`}>
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="flex items-center gap-2 px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50"
                                            >
                                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                Salvar Produto
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
