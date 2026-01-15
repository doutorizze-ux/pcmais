import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle, Search, MapPin,
    Monitor, Package, Tag,
    X, ChevronLeft, ChevronRight, Share2, Menu,
    Flame
} from 'lucide-react';
import { API_URL } from '../config';

// --- Interfaces ---
interface Product {
    id: string;
    name: string;
    brand: string;
    model: string;
    category?: string;
    condition: 'Novo' | 'Usado' | 'Open Box';
    price: number;
    stock: number;
    description: string;
    images?: string[];
    views?: number;
    interestCount?: number;
    specs?: Record<string, string>;
}

interface StoreData {
    name: string;
    logoUrl?: string;
    coverUrl?: string;
    phone?: string;
    primaryColor: string;
    email?: string;
    address?: string;
    description?: string;
}

// --- Components ---

const ProductModal = ({ product, store, onClose }: { product: Product, store: StoreData, onClose: () => void }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = product.images && product.images.length > 0
        ? product.images
        : ["https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2042&auto=format&fit=crop"];

    const getImageUrl = (url: string) => url.startsWith('http') ? url : `${API_URL}${url}`;

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleWhatsappClick = () => {
        if (!store.phone) return;
        let text = `Olá! Vi o produto *${product.brand} ${product.name}* no site e tenho interesse.`;
        if (product.condition) text += `\nCondição: ${product.condition}`;
        const link = `https://wa.me/${store.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
        window.open(link, '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white w-full max-w-6xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-50 bg-black/50 p-2 rounded-full text-white md:hidden backdrop-blur-md">
                    <X className="w-5 h-5" />
                </button>

                <div className="w-full md:w-3/5 bg-black relative flex flex-col justify-center h-[40vh] md:h-auto">
                    <div className="relative w-full h-full">
                        <img
                            src={getImageUrl(images[currentImageIndex])}
                            alt={product.name}
                            className="w-full h-full object-contain"
                        />
                        {images.length > 1 && (
                            <>
                                <button onClick={handlePrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors backdrop-blur-sm">
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button onClick={handleNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors backdrop-blur-sm">
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}
                        <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1 rounded-full text-white text-xs font-medium backdrop-blur-md">
                            {currentImageIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-2/5 p-6 md:p-8 bg-white overflow-y-auto max-h-[60vh] md:max-h-full scrollbar-thin">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{product.brand}</p>
                            <h2 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h2>
                            <p className="text-gray-500 font-medium">{product.model}</p>
                        </div>
                        <button onClick={onClose} className="hidden md:block p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black" style={{ color: store.primaryColor }}>
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(product.price))}
                            </span>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className={`px-2 py-1 rounded-lg text-xs font-bold uppercase ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {product.stock > 0 ? 'Disponível' : 'Esgotado'}
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-6 p-4 rounded-2xl flex items-center gap-4 border ${(product.interestCount || 0) > 0
                            ? "bg-orange-50 border-orange-100"
                            : "bg-blue-50 border-blue-100"
                            }`}
                    >
                        <div className={`p-3 rounded-xl shadow-sm bg-white`}>
                            {(product.interestCount || 0) > 0 ? (
                                <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
                            ) : (
                                <Monitor className="w-5 h-5 text-blue-500" />
                            )}
                        </div>
                        <div>
                            {(product.interestCount || 0) > 0 ? (
                                <>
                                    <p className="text-sm font-bold text-orange-900">Produto Procurado!</p>
                                    <p className="text-xs text-orange-700/80 font-medium">
                                        Várias pessoas pesquisaram este item hoje.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm font-bold text-blue-900">Excelente Escolha!</p>
                                    <p className="text-xs text-blue-700/80 font-medium">
                                        Qualidade e performance garantida.
                                    </p>
                                </>
                            )}
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <Package className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Condição</p>
                                <p className="font-semibold text-gray-900">{product.condition}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <Tag className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Categoria</p>
                                <p className="font-semibold text-gray-900">{product.category || 'Geral'}</p>
                            </div>
                        </div>
                    </div>

                    {product.description && (
                        <div className="mb-8 p-4 bg-gray-50 rounded-2xl">
                            <h3 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wide">Descrição</h3>
                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
                        </div>
                    )}

                    <div className="mt-auto">
                        <button
                            onClick={handleWhatsappClick}
                            className="w-full py-4 text-white rounded-xl font-bold text-lg shadow-xl shadow-green-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-3"
                            style={{ backgroundColor: '#25D366' }}
                        >
                            <MessageCircle className="w-6 h-6" />
                            Tenho Interesse
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export function PublicStorePage() {
    const { slug } = useParams();
    const [store, setStore] = useState<StoreData | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
                setDeferredPrompt(null);
            }
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;
            try {
                // Assuming backend /users/public/:slug returns { store, products } now instead of vehicles
                // I might need to update UsersService to return products or a separate endpoint
                // But typically UsersService aggregates public data.
                // Assuming "vehicles" field in response might still be there but renamed or I should check backend UsersControler/Service.
                // For now, I'll assume the backend exposes 'vehicles' property but it contains products, or 'products' property.
                // If I kept VehiclesService but renamed logic, it might still return 'vehicles' property in JSON if I didn't change the field name in the aggregation.
                // Let's assume it returns `products` or `vehicles`. I will check both.

                const res = await fetch(`${API_URL}/users/public/${slug}`);
                if (!res.ok) throw new Error('Loja não encontrada');
                const data = await res.json();
                setStore(data.store);
                const productList = data.products || data.vehicles || []; // Fallback
                setProducts(productList);
                setFilteredProducts(productList);

                const params = new URLSearchParams(window.location.search);
                const pId = params.get('p') || params.get('v');
                if (pId) {
                    const product = productList.find((p: any) => p.id === pId);
                    if (product) setSelectedProduct(product);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && setSelectedProduct(null);
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [slug]);

    useEffect(() => {
        const term = searchTerm.toLowerCase();
        setFilteredProducts(products.filter(p =>
            p.name?.toLowerCase().includes(term) ||
            p.brand?.toLowerCase().includes(term) ||
            p.model?.toLowerCase().includes(term)
        ));
    }, [searchTerm, products]);

    const getImageUrl = (url?: string) => {
        if (!url) return "";
        if (url.startsWith('http')) return url;
        return `${API_URL}${url}`;
    };

    const scrollToSection = (id: string) => {
        setIsMenuOpen(false);
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin" /></div>;

    if (!store) return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-6">
            <Monitor className="w-20 h-20 text-gray-300 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Loja não encontrada</h1>
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-50 font-sans selection:bg-black/10">
            <AnimatePresence>
                {selectedProduct && (
                    <ProductModal
                        product={selectedProduct}
                        store={store}
                        onClose={() => setSelectedProduct(null)}
                    />
                )}
            </AnimatePresence>

            {deferredPrompt && (
                <div onClick={handleInstallClick} className="fixed top-24 right-4 z-40 bg-black text-white px-4 py-2 rounded-full shadow-lg cursor-pointer flex items-center gap-2 animate-pulse hover:animate-none">
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm font-bold">Instalar App</span>
                </div>
            )}

            <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="container mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {store.logoUrl ? (
                            <img src={getImageUrl(store.logoUrl)} className="h-10 w-auto object-contain" />
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">{store.name[0]}</div>
                                <span className="font-bold text-xl text-gray-900 truncate max-w-[200px]">{store.name}</span>
                            </div>
                        )}
                    </div>
                    <div className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-500">
                        <button onClick={() => scrollToSection('stock')} className="hover:text-gray-900 transition-colors">Produtos</button>
                        <button onClick={() => scrollToSection('about')} className="hover:text-gray-900 transition-colors">Sobre</button>
                        <button onClick={() => scrollToSection('footer')} className="hover:text-gray-900 transition-colors">Contato</button>
                    </div>
                    <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <Menu className="w-6 h-6 text-gray-700" />
                    </button>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 flex flex-col gap-4">
                        <button onClick={() => scrollToSection('stock')} className="text-left font-medium text-gray-700">Produtos</button>
                        <button onClick={() => scrollToSection('about')} className="text-left font-medium text-gray-700">Sobre</button>
                        <button onClick={() => scrollToSection('footer')} className="text-left font-medium text-gray-700">Contato</button>
                    </div>
                )}
            </nav>

            <div className="relative h-[40vh] md:h-[50vh] bg-gray-900 overflow-hidden flex items-center justify-center">
                {store.coverUrl ? (
                    <img src={getImageUrl(store.coverUrl)} className="absolute inset-0 w-full h-full object-cover opacity-80" />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" style={{ backgroundColor: store.primaryColor }} />
                )}
                <div className="absolute inset-0 bg-black/40" />

                <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-lg"
                    >
                        {store.name}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-white/90 font-medium"
                    >
                        {store.description || "Tecnologia e Performance ao seu alcance."}
                    </motion.p>
                </div>
            </div>

            <main id="stock" className="container mx-auto px-4 sm:px-6 py-16">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Catálogo</h2>
                        <p className="text-gray-500 mt-2">Confira nossos produtos disponíveis</p>
                    </div>

                    <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-2 w-full md:w-96">
                        <div className="p-3 text-gray-400"><Search className="w-5 h-5" /></div>
                        <input
                            type="text"
                            placeholder="Buscar produto..."
                            className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-400 font-medium"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
                        <Monitor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">Nenhum produto encontrado</h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group bg-white rounded-3xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-2xl border border-gray-100 flex flex-col"
                                onClick={() => setSelectedProduct(product)}
                            >
                                <div className="aspect-[4/3] relative bg-gray-200 overflow-hidden">
                                    <img
                                        src={getImageUrl(product.images?.[0])}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 uppercase tracking-wider shadow-lg">
                                        {product.condition}
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{product.brand}</p>
                                        <h3 className="text-xl font-bold text-gray-900 truncate">{product.name}</h3>
                                        <p className="text-sm text-gray-500 truncate">{product.model}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto">
                                        <p className="text-2xl font-bold" style={{ color: store.primaryColor }}>
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(product.price))}
                                        </p>
                                        <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center group-hover:bg-green-500 transition-colors shadow-lg">
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            <section id="about" className="bg-white py-20 border-t border-gray-100">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Sobre a {store.name}</h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        {store.description || "Somos especialistas em tecnologia e informática."}
                    </p>
                    {store.address && (
                        <div className="mt-10 p-6 bg-gray-50 rounded-2xl inline-flex flex-col items-center gap-3 border border-gray-200">
                            <MapPin className="w-8 h-8 text-red-500" />
                            <p className="text-gray-900 font-bold">{store.address}</p>
                        </div>
                    )}
                </div>
            </section>

            <footer id="footer" className="bg-gray-900 text-white py-16 border-t border-gray-800">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between gap-12">
                    <div className="max-w-xs">
                        <div className="text-2xl font-bold mb-6">{store.name}</div>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-6">Contato</h4>
                        <div className="space-y-4">
                            {store.phone && (
                                <a href={`https://wa.me/${store.phone.replace(/\D/g, '')}`} target="_blank" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                                    <MessageCircle className="w-5 h-5 text-green-500" />
                                    {store.phone} (WhatsApp)
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
