import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button, Input } from '../components/ui';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo and branding */}
                <div className="text-center mb-8 animate-slide-down">
                    <div className="inline-flex items-center justify-center mb-4">
                        <img
                            src="/assets/logo-light.png"
                            alt="Chamou"
                            className="h-16 w-auto"
                        />
                    </div>
                    <p className="text-light-300">Gestão Inteligente de Filas para Restaurantes</p>
                </div>

                {/* Login card */}
                <div className="glass rounded-3xl p-8 shadow-2xl animate-scale-in">
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-2">Bem-vindo de volta</h2>
                        <p className="text-light-300">Entre com suas credenciais para continuar</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="E-mail"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            required
                            leftIcon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            }
                        />

                        <Input
                            label="Senha"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            leftIcon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            }
                        />

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-light-300 cursor-pointer">
                                <input type="checkbox" className="rounded border-light-400 text-primary-500 focus:ring-primary-500" />
                                <span>Lembrar-me</span>
                            </label>
                            <a href="#" className="text-primary-400 hover:text-primary-300 transition-colors">
                                Esqueceu a senha?
                            </a>
                        </div>

                        {error && (
                            <div className="bg-danger-500/10 border border-danger-500/20 text-danger-400 p-4 rounded-xl text-sm flex items-start gap-3">
                                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                            {loading ? 'Entrando...' : 'Entrar'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-light-300">
                            Não tem uma conta?{' '}
                            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                                Cadastre-se gratuitamente
                            </Link>
                        </p>
                    </div>

                    {/* Demo credentials */}
                    <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                        <p className="text-sm text-primary-300 font-medium mb-2 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Conta de demonstração
                        </p>
                        <p className="text-xs text-light-400 font-mono">
                            E-mail: admin@restaurantedemo.com.br<br />
                            Senha: admin123
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-light-400 text-sm mt-8">
                    © 2024 Chamou. Todos os direitos reservados.
                </p>
            </div>
        </div>
    );
}

export function Register() {
    const [formData, setFormData] = useState({
        restaurantName: '',
        cnpj: '',
        phone: '',
        email: '',
        city: '',
        userName: '',
        userEmail: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao cadastrar');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-2xl">
                {/* Logo */}
                <div className="text-center mb-8 animate-slide-down">
                    <div className="inline-flex items-center justify-center mb-4">
                        <img
                            src="/assets/logo-light.png"
                            alt="Chamou"
                            className="h-16 w-auto"
                        />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">Criar Conta</h1>
                    <p className="text-light-300">Comece a gerenciar seu restaurante hoje</p>
                </div>

                {/* Register card */}
                <div className="glass rounded-3xl p-8 shadow-2xl animate-scale-in">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Restaurant info */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Informações do Restaurante</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <Input
                                        label="Nome do Restaurante"
                                        name="restaurantName"
                                        value={formData.restaurantName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <Input
                                    label="CNPJ (opcional)"
                                    name="cnpj"
                                    value={formData.cnpj}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="Telefone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="E-mail"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Cidade"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="border-t border-light-300/20 pt-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Suas Informações</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Seu Nome"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Seu E-mail"
                                    name="userEmail"
                                    type="email"
                                    value={formData.userEmail}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="col-span-2">
                                    <Input
                                        label="Senha"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        hint="Mínimo de 6 caracteres"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-danger-500/10 border border-danger-500/20 text-danger-400 p-4 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                            {loading ? 'Criando conta...' : 'Criar Conta'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-light-300">
                            Já tem uma conta?{' '}
                            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                                Faça login
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-light-400 text-sm mt-8">
                    © 2024 Chamou. Todos os direitos reservados.
                </p>
            </div>
        </div>
    );
}
