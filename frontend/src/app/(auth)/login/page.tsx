'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader2, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getErrorMessage } from '@/lib/utils';

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-[#07070f]">
      {/* Background orbs */}
      <div className="orb w-96 h-96 bg-brand-600 top-[-8rem] left-[-8rem]" />
      <div className="orb w-72 h-72 bg-violet-700 bottom-[-6rem] right-[-4rem]" />
      <div className="orb w-48 h-48 bg-indigo-500 top-1/2 left-2/3" />

      {/* Mesh grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-glow">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">TaskFlow</span>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1.5">Welcome back</h1>
            <p className="text-slate-400 text-sm">Sign in to your account to continue.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="input-base"
                autoComplete="email"
              />
              {errors.email && <p className="mt-1.5 text-xs text-rose-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-base pr-11"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-rose-400">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 mt-2">
              {isLoading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
              Create one
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Secured with JWT · Encrypted passwords · Your data stays yours
        </p>
      </div>
    </div>
  );
}
