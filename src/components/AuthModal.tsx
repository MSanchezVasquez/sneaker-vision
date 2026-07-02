import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Chrome, AlertCircle, ArrowRight } from 'lucide-react';
import { auth } from '../lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      onClose();
    } catch (err: any) {
      setError('Error al iniciar sesión con Google. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
      }
      onClose();
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Este correo ya está en uso.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña es muy débil.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Credenciales incorrectas.');
      } else {
        setError('Ocurrió un error. Por favor, inténtalo de nuevo.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl text-slate-900 dark:text-slate-100 transition-colors duration-300"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors z-10 text-slate-800 dark:text-slate-200"
            >
              <X size={20} />
            </button>

            <div className="p-8 sm:p-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-black tracking-tighter mb-2 text-slate-900 dark:text-slate-100">
                  {isLogin ? 'BIENVENIDO' : 'CREAR CUENTA'}
                </h2>
                <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">
                  {isLogin ? 'Ingresa tus credenciales para continuar' : 'Únete a la comunidad SneakerVision'}
                </p>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold"
                >
                  <AlertCircle size={18} />
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                 {!isLogin && (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-sm text-slate-800 dark:text-slate-100 placeholder-gray-400"
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-sm text-slate-800 dark:text-slate-100 placeholder-gray-400"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-sm text-slate-800 dark:text-slate-100 placeholder-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-gray-900 dark:hover:bg-gray-100 transition-all flex items-center justify-center gap-2 group"
                >
                  {isLoading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                  {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100 dark:border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase font-black tracking-widest text-gray-400">
                  <span className="bg-white dark:bg-slate-900 px-4">O continúa con</span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-800 text-black dark:text-white py-4 rounded-2xl font-black text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
              >
                <Chrome size={20} className="text-blue-600" />
                Google
              </button>

              <p className="mt-8 text-center text-sm font-bold text-gray-400">
                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-blue-600 hover:underline"
                >
                  {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
