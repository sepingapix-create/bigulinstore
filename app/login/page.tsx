"use client";

import { useActionState, useState } from "react";
import { loginAction, registerAction, socialLoginAction } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, ShieldCheck, Zap } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  const [loginState, loginFormAction, isLoginPending] = useActionState(loginAction, undefined);
  const [registerState, registerFormAction, isRegisterPending] = useActionState(registerAction, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/8 blur-[140px] rounded-full" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-yellow-600/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 left-1/4 w-[200px] h-[200px] bg-red-900/10 blur-[80px] rounded-full" />
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1 mb-4 group">
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)] group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 italic mr-1">
              爱
            </span>
            <span className="font-black text-2xl tracking-tighter uppercase italic text-white">
              Bi<span className="text-yellow-500">gulin</span>
            </span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 mb-2">Império das Assinaturas</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900/70 backdrop-blur-xl border border-white/8 rounded-2xl shadow-[0_0_60px_-15px_rgba(220,38,38,0.3)] overflow-hidden">
          {/* Tab switcher */}
          <div className="flex border-b border-white/5">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                isLogin
                  ? "text-white border-b-2 border-red-500 bg-red-500/5"
                  : "text-zinc-600 hover:text-zinc-400"
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                !isLogin
                  ? "text-white border-b-2 border-red-500 bg-red-500/5"
                  : "text-zinc-600 hover:text-zinc-400"
              }`}
            >
              Cadastrar
            </button>
          </div>

          <div className="p-8">
            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-xl font-bold text-white tracking-tight">
                {isLogin ? "Bem-vindo de volta" : "Criar uma conta"}
              </h1>
              <p className="text-xs text-zinc-500 mt-1">
                {isLogin
                  ? "Entre com suas credenciais para acessar a plataforma."
                  : "Preencha os dados abaixo para se cadastrar."}
              </p>
            </div>

            {/* Forms */}
            {isLogin ? (
              <form action={loginFormAction} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Seu e-mail"
                    required
                    className="pl-10 bg-white/5 border-white/8 text-white placeholder:text-zinc-600 focus-visible:ring-red-500/40 focus-visible:border-red-500/40 rounded-xl h-11 transition-all"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                  <Input
                    name="password"
                    type="password"
                    placeholder="Sua senha"
                    required
                    className="pl-10 bg-white/5 border-white/8 text-white placeholder:text-zinc-600 focus-visible:ring-red-500/40 focus-visible:border-red-500/40 rounded-xl h-11 transition-all"
                  />
                </div>

                {loginState?.error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                    <p className="text-xs text-red-400 font-medium">{loginState.error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoginPending}
                  className="w-full h-11 mt-1 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(220,38,38,0.35)]"
                >
                  {isLoginPending ? "Entrando..." : "Entrar"}
                </button>
              </form>
            ) : (
              <form action={registerFormAction} className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                  <Input
                    name="name"
                    type="text"
                    placeholder="Nome completo"
                    required
                    className="pl-10 bg-white/5 border-white/8 text-white placeholder:text-zinc-600 focus-visible:ring-red-500/40 focus-visible:border-red-500/40 rounded-xl h-11 transition-all"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Seu e-mail"
                    required
                    className="pl-10 bg-white/5 border-white/8 text-white placeholder:text-zinc-600 focus-visible:ring-red-500/40 focus-visible:border-red-500/40 rounded-xl h-11 transition-all"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                  <Input
                    name="password"
                    type="password"
                    placeholder="Senha (mín. 6 caracteres)"
                    required
                    className="pl-10 bg-white/5 border-white/8 text-white placeholder:text-zinc-600 focus-visible:ring-red-500/40 focus-visible:border-red-500/40 rounded-xl h-11 transition-all"
                  />
                </div>

                {registerState?.error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                    <p className="text-xs text-red-400 font-medium">{registerState.error}</p>
                  </div>
                )}
                {registerState?.success && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2.5">
                    <p className="text-xs text-green-400 font-medium">Conta criada! Faça login.</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isRegisterPending}
                  className="w-full h-11 mt-1 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(220,38,38,0.35)]"
                >
                  {isRegisterPending ? "Criando conta..." : "Criar Conta"}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-zinc-900 px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                  ou continue com
                </span>
              </div>
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
              <form action={socialLoginAction.bind(null, "google")} className="w-full">
                <button
                  type="submit"
                  className="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 hover:border-white/15 transition-all text-sm font-semibold text-zinc-300"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </button>
              </form>

              <form action={socialLoginAction.bind(null, "discord")} className="w-full">
                <button
                  type="submit"
                  className="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/20 hover:bg-[#5865F2]/20 transition-all text-sm font-semibold text-[#7983f5]"
                >
                  <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.23 10.23 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.874.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  Discord
                </button>
              </form>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-white/5">
              <div className="flex items-center gap-1.5 text-zinc-600">
                <ShieldCheck className="h-3 w-3" />
                <span className="text-[10px] uppercase tracking-widest font-medium">Seguro</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-zinc-800" />
              <div className="flex items-center gap-1.5 text-zinc-600">
                <Zap className="h-3 w-3" />
                <span className="text-[10px] uppercase tracking-widest font-medium">Acesso Imediato</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-700 mt-6">
          © {new Date().getFullYear()} Império Bigulin · Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
