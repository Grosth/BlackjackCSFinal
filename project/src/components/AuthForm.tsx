import React, { useState } from 'react';
import { User, CreditCard } from 'lucide-react';

interface AuthFormProps {
  isLogin: boolean;
  onSubmit: (email: string, password: string, username?: string) => void;
  onToggle: () => void;
  loading: boolean;
  error: string | null;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  isLogin,
  onSubmit,
  onToggle,
  loading,
  error
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password, username);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-white border-4 border-red-600 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-red-600 p-4 rounded-full">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">BlackJack Casino</h1>
          <p className="text-red-600 font-semibold">
            {isLogin ? 'Inicia sesión para jugar' : 'Regístrate para empezar'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-black mb-2">
                Nombre de usuario
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 pl-10 bg-white border-2 border-black rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Tu nombre de usuario"
                  required
                />
                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-600" />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Tu contraseña"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="bg-red-100 border-2 border-red-600 rounded-lg p-3">
              <p className="text-red-600 text-sm font-semibold">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {loading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-black">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button
              onClick={onToggle}
              className="ml-2 text-red-600 hover:text-red-500 font-bold transition-colors underline"
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};