'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth.context';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Wifi, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = z.object({ email: z.string().email('Email inválido'), password: z.string().min(6, 'Mínimo 6 caracteres') });
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch {
      toast.error('Email ou senha inválidos');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Wifi size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">NetPulse</h1>
          <p className="text-slate-400 mt-2">Plataforma de Monitoramento ISP</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Entrar na plataforma</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Email" type="email" placeholder="seu@email.com" error={errors.email?.message} {...register('email')} />
            <div className="relative">
              <Input label="Senha" type={showPassword ? 'text' : 'password'} placeholder="••••••••" error={errors.password?.message} {...register('password')} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-8 text-slate-400 hover:text-white">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <Button type="submit" className="w-full mt-2" isLoading={isSubmitting}>Entrar</Button>
          </form>

          <div className="mt-6 p-4 bg-slate-900 rounded-lg">
            <p className="text-xs text-slate-400 font-medium mb-2">Credenciais de teste:</p>
            <div className="space-y-1 text-xs text-slate-500">
              <p>Admin: admin@netpulse.com / Admin@123</p>
              <p>Técnico: tecnico@netpulse.com / Tech@123</p>
              <p>Cliente: cliente@netpulse.com / Client@123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
