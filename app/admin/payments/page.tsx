import { getStylepaySettings } from "@/actions/payments";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Zap, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StylepayForm } from "@/components/admin/StylepayForm";

export default async function AdminPaymentsPage() {
  const settings = await getStylepaySettings();
  const isConfigured = !!settings.clientId && !!settings.clientSecret;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">
          Métodos de <span className="text-primary">Pagamento</span>
        </h1>
        <p className="text-muted-foreground">Gerencie as integrações e chaves de API do seu império.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Configuration Card */}
        <Card className="lg:col-span-2 bg-[#0A0A0A] border-[#1A1A1A] shadow-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
             <CreditCard className="h-32 w-32 text-primary" />
          </div>
          
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
               <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                     <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold tracking-tight">STYLEPAY</CardTitle>
                    <CardDescription>Integração direta via PIX</CardDescription>
                  </div>
               </div>
               <Badge variant={isConfigured ? "default" : "outline"} className={isConfigured ? "bg-green-500/20 text-green-500 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"}>
                  {isConfigured ? "Configurado" : "Pendente"}
               </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <StylepayForm initialData={settings} />
          </CardContent>
        </Card>

        {/* Info/Stats Card */}
        <div className="space-y-6">
           <Card className="bg-[#0A0A0A] border-[#1A1A1A]">
              <CardHeader>
                 <CardTitle className="text-lg font-bold italic uppercase tracking-tight">Status da API</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Latência</span>
                    <span className="font-mono text-green-500">24ms</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Disponibilidade</span>
                    <span className="font-mono text-green-500">99.9%</span>
                 </div>
                 <div className="pt-4 border-t border-[#1A1A1A]">
                    <div className="flex items-center gap-2 text-xs text-yellow-500">
                       <AlertCircle className="h-4 w-4" />
                       <span>Ambiente de Produção Ativo</span>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/10">
              <h4 className="font-bold italic uppercase mb-2">Dica Imperial</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Utilize o modo Sandbox da Stylepay antes de entrar em produção para garantir que o fluxo de checkout e entrega automática esteja funcionando perfeitamente.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
