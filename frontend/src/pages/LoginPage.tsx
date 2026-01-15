import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, ArrowRight, Monitor, Cpu } from 'lucide-react';

export function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                login(data.access_token, data.user);

                if (data.user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } else {
                alert('Credenciais inválidas');
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao conectar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] md:grid md:grid-cols-2 lg:grid-cols-[1fr_500px]">

            {/* Left Side - Branding (Hidden on Mobile) */}
            <div className="hidden md:flex flex-col justify-between bg-[#0a0a0a] p-12 relative overflow-hidden text-white border-r border-white/5">
                {/* Abstract Tech Background */}
                <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-500/20 p-2 rounded-xl border border-orange-500/20 backdrop-blur-sm">
                            <Monitor className="w-8 h-8 text-orange-500" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">Zapicar<span className="text-orange-500">.Info</span></span>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg mb-12">
                    <h1 className="text-5xl font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Gestão Inteligente para sua Assistência.
                    </h1>
                    <p className="text-lg text-gray-400 leading-relaxed border-l-4 border-orange-500 pl-4">
                        Controle produtos, serviços e leads em um único lugar. O sistema definitivo para profissionais de T.I.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <Cpu className="w-4 h-4 text-orange-900" />
                    © {new Date().getFullYear()} Zapicar Tecnologia.
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-24 bg-[#1a1a1a] relative">

                <div className="w-full max-w-sm mx-auto mt-12 md:mt-0">
                    <div className="mb-10">
                        {/* Mobile Logo Show */}
                        <div className="flex md:hidden items-center justify-center mb-8 gap-2">
                            <div className="bg-orange-500/20 p-2 rounded-xl border border-orange-500/20">
                                <Monitor className="w-8 h-8 text-orange-500" />
                            </div>
                            <span className="text-2xl font-bold text-white">Zapicar</span>
                        </div>

                        <h2 className="text-3xl font-bold text-white tracking-tight">Bem-vindo(a)</h2>
                        <p className="mt-2 text-gray-400">
                            Acesse o painel administrativo.
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-1.5 ml-1">Email Corporativo</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3.5 bg-[#252525] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all font-medium"
                                    placeholder="admin@empresa.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-1.5 ml-1">Senha de Acesso</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3.5 bg-[#252525] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-700 bg-[#252525] rounded cursor-pointer"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400 cursor-pointer select-none">
                                    Lembrar dispositivo
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-orange-500 hover:text-orange-400 transition-colors">
                                    Recuperar acesso
                                </a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-orange-900/20 text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a1a1a] focus:ring-orange-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
                        >
                            {loading ? 'Validando...' : 'Entrar no Sistema'}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>

                    <div className="mt-10 text-center border-t border-white/5 pt-6">
                        <p className="text-sm text-gray-500">
                            Acesso restrito a colaboradores autorizados.<br />
                            <span className="text-xs opacity-70">Para suporte, contate o administrador.</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
