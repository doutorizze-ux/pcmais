import { Plus, Search, Filter, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';
import { API_URL } from '../config';
import { ProductManagerModal } from '../components/ProductManagerModal';

interface Product {
    id: string;
    name: string;
    brand: string;
    model: string;
    category?: string;
    condition: 'Novo' | 'Usado' | 'Open Box';
    price: number;
    costPrice?: number;
    stock: number;
    description: string;
    images?: string[];
}

export function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/products`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    setProducts([]);
                }
            } else {
                console.error("Failed to fetch products:", res.status);
            }
        } catch (err) {
            console.error("Failed to fetch products", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (editingProduct) {
            const updated = products.find(p => p.id === editingProduct.id);
            if (updated) {
                setEditingProduct(updated);
            }
        }
    }, [products]);

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const getImageUrl = (url?: string) => {
        if (!url) return "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2042&auto=format&fit=crop"; // Tech default
        if (url.startsWith('http')) return url;
        return `${API_URL}${url}`;
    };

    const handleNewProduct = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <ProductManagerModal
                isOpen={isModalOpen}
                onClose={handleClose}
                onSuccess={fetchProducts}
                initialData={editingProduct}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Monitor className="w-8 h-8 text-orange-600" />
                        Produtos
                    </h2>
                    <p className="text-gray-500 mt-1">Gerencie seu catálogo de peças e computadores.</p>
                </div>
                <button
                    onClick={handleNewProduct}
                    className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-orange-600/20"
                >
                    <Plus className="w-5 h-5" />
                    Novo Produto
                </button>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nome, marca ou modelo (ex: RTX, Asus)..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors">
                    <Filter className="w-5 h-5" />
                    Filtros
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-2xl p-4 h-64 animate-pulse bg-gray-100"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
                            <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                <img
                                    src={getImageUrl(product.images?.[0])}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 right-3 px-3 py-1 bg-black/70 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/20">
                                    {product.condition}
                                </div>
                                {product.stock === 0 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <span className="text-white font-bold px-4 py-2 bg-red-600 rounded-lg">ESGOTADO</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="mb-2">
                                    <span className="text-xs font-bold text-orange-600 uppercase tracking-wide bg-orange-50 px-2 py-0.5 rounded-full">{product.brand}</span>
                                    <h3 className="text-lg font-bold text-gray-900 mt-2 leading-tight">{product.name}</h3>
                                    <p className="text-gray-500 text-sm mt-1">{product.model} • {product.category}</p>
                                </div>
                                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xl font-bold text-green-600">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(product.price))}
                                        </span>
                                        {product.stock > 0 ? (
                                            <span className="text-xs text-green-600 font-medium">{product.stock} em estoque</span>
                                        ) : (
                                            <span className="text-xs text-red-500 font-medium">Sem estoque</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="px-4 py-2 bg-gray-50 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        Gerenciar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
