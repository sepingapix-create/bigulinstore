"use client";

import { useActionState, useState } from "react";
import { loginAction, registerAction, socialLoginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  const [loginState, loginFormAction, isLoginPending] = useActionState(loginAction, undefined);
  const [registerState, registerFormAction, isRegisterPending] = useActionState(registerAction, undefined);

  return (
    <div className="flex-1 flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/50 backdrop-blur-md border-border/50 shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight">
              {isLogin ? "Bem-vindo de volta" : "Criar uma conta"}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? "Entre com suas credenciais para acessar a plataforma." 
                : "Preencha os dados abaixo para se cadastrar."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLogin ? (
              <form action={loginFormAction} className="space-y-4">
                <div className="space-y-2">
                  <Input name="email" type="email" placeholder="E-mail" required className="bg-muted/50 border-transparent focus-visible:ring-primary/50" />
                </div>
                <div className="space-y-2">
                  <Input name="password" type="password" placeholder="Senha" required className="bg-muted/50 border-transparent focus-visible:ring-primary/50" />
                </div>
                
                {loginState?.error && (
                  <p className="text-sm text-destructive font-medium text-center">{loginState.error}</p>
                )}

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25" disabled={isLoginPending}>
                  {isLoginPending ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            ) : (
              <form action={registerFormAction} className="space-y-4">
                <div className="space-y-2">
                  <Input name="name" type="text" placeholder="Nome completo" required className="bg-muted/50 border-transparent focus-visible:ring-primary/50" />
                </div>
                <div className="space-y-2">
                  <Input name="email" type="email" placeholder="E-mail" required className="bg-muted/50 border-transparent focus-visible:ring-primary/50" />
                </div>
                <div className="space-y-2">
                  <Input name="password" type="password" placeholder="Senha (min 6 caracteres)" required className="bg-muted/50 border-transparent focus-visible:ring-primary/50" />
                </div>

                {registerState?.error && (
                  <p className="text-sm text-destructive font-medium text-center">{registerState.error}</p>
                )}
                {registerState?.success && (
                  <p className="text-sm text-green-500 font-medium text-center">Conta criada com sucesso! Faça login.</p>
                )}

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25" disabled={isRegisterPending}>
                  {isRegisterPending ? "Criando conta..." : "Criar Conta"}
                </Button>
              </form>
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Ou entrar com</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                onClick={() => socialLoginAction("google")}
                className="bg-muted/30 border-border/50 hover:bg-muted/50 transition-all font-semibold"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button 
                variant="outline" 
                onClick={() => socialLoginAction("discord")}
                className="bg-muted/30 border-border/50 hover:bg-muted/50 transition-all font-semibold"
              >
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.23 10.23 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.874.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Discord
              </Button>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                {isLogin ? "Ainda não tem uma conta?" : "Já tem uma conta?"}
              </span>{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? "Cadastre-se" : "Faça Login"}
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
