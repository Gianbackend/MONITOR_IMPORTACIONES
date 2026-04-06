import React, { useState } from 'react';
import { supabase } from '../lib/supabase'; // Tu cliente configurado
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Error: ' + error.message);
    } else {
      // Supabase guarda la sesión automáticamente en LocalStorage
      window.location.href = '/'; 
    }
    setLoading(false);
  };

return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-transparent">

      
    
      <div className="bg-white/60 backdrop-blur-xl p-12 md:p-16 rounded-[2.5rem] shadow-2xl border border-white/20 max-w-md w-full transition-all duration-300">
       
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Monitor de Importaciones
          </h2>
          <p className="text-slate-600 mt-2 text-sm font-medium">
            Ingresa tus credenciales para continuar
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-widest">
              Correo electrónico
            </label>
            <Input 
              type="email" 
              placeholder="nombre@empresa.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/80 border-white/40 text-slate-900 h-12 rounded-xl focus:bg-white transition-all shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-widest">
              Contraseña
            </label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white/80 border-white/40 text-slate-900 h-12 rounded-xl focus:bg-white transition-all shadow-sm"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 rounded-xl transition-all shadow-lg active:scale-95 mt-4 text-lg" 
            disabled={loading}
          >
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </Button>
        </form>
        <p className="text-center text-[10px] text-slate-500 mt-12 font-semibold uppercase tracking-[0.2em]">
          &copy; 2026 Crosland - Gestión Logística
        </p>
      </div>
    </div>
  );
};
