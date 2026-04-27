"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Copy, Download, QrCode, Loader2 } from "lucide-react";
import { simulatePaymentAction, checkOrderStatus } from "@/actions/checkout";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function OrderClient({ 
  orderId, 
  initialPixCode, 
  initialQrCodeImage,
  initialStatus,
  deliveredContent = []
}: { 
  orderId: string; 
  initialPixCode: string; 
  initialQrCodeImage?: string;
  initialStatus: string;
  deliveredContent?: string[];
}) {
  const [pixCode] = useState(initialPixCode);
  const [qrCodeImage] = useState(initialQrCodeImage);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [isSimulating, setIsSimulating] = useState(false);
  const router = useRouter();

  // Polling for status update
  useEffect(() => {
    if (status !== "PENDING") return;

    const interval = setInterval(async () => {
      const result = await checkOrderStatus(orderId);
      if (result.status === "PAID") {
        setStatus("PAID");
        toast.success("Pagamento confirmado com sucesso!");
        router.refresh();
        clearInterval(interval);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [orderId, status, router]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado!");
  };

  const handleCopyPix = () => {
    if (pixCode) {
      navigator.clipboard.writeText(pixCode);
      setCopied(true);
      toast.success("Código PIX copiado!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  async function handleSimulatePayment() {
    setIsSimulating(true);
    const result = await simulatePaymentAction(orderId);
    
    if (result.success) {
      setStatus("PAID");
      toast.success("Pagamento simulado com sucesso!");
      router.refresh();
    } else {
      toast.error("Erro ao simular pagamento");
    }
    setIsSimulating(false);
  }

  return (
    <div className="relative">
      {/* Background Decorative Element */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="grid gap-6 relative z-10">
        {/* Unified Status & Info Section */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          <div className="flex-1 p-5 rounded-3xl bg-card/40 border border-white/5 backdrop-blur-md flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${status === "PAID" ? "bg-green-500/10" : "bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.2)]"}`}>
                {status === "PENDING" ? (
                  <div className="relative flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></span>
                  </div>
                ) : (
                  <CheckCircle2 className="h-6 w-6 text-green-500 animate-in zoom-in duration-500" />
                )}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-0.5">Status do Pedido</p>
                <h2 className={`text-lg font-black italic uppercase tracking-tight ${status === "PAID" ? "text-green-500" : "text-yellow-500"}`}>
                  {status === "PENDING" ? "Aguardando Pix" : "Pagamento Aprovado"}
                </h2>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="font-black text-[10px] tracking-widest border-primary/20 text-primary bg-primary/5 px-3 py-1">
                PIX AUTOMÁTICO
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Action Area */}
        <Card className="border-white/5 bg-card/30 backdrop-blur-xl shadow-2xl overflow-hidden rounded-3xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-black italic uppercase tracking-tighter">
              {status === "PENDING" ? "Finalize sua Compra" : "Seus Acessos"}
            </CardTitle>
            <CardDescription className="text-zinc-400 font-medium">
              {status === "PENDING" 
                ? "Efetue o pagamento para liberar seus produtos instantaneamente."
                : "Seu pagamento foi confirmado com sucesso! Aproveite seus produtos."}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {status === "PENDING" ? (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* QR Code Column */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex justify-center p-6 bg-white rounded-[2.5rem] shadow-2xl border-4 border-white/10 max-w-[240px] mx-auto transition-transform group-hover:scale-[1.02] duration-500">
                    {qrCodeImage ? (
                      <img 
                        src={qrCodeImage.startsWith("data:image") ? qrCodeImage : `data:image/png;base64,${qrCodeImage}`} 
                        alt="QR Code PIX" 
                        className="w-full h-auto aspect-square object-contain mix-blend-multiply"
                      />
                    ) : (
                      <QrCode className="w-32 h-32 text-black opacity-10 animate-pulse" />
                    )}
                  </div>
                </div>
                
                {/* Instructions Column */}
                <div className="space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary">1</div>
                      <p className="text-sm font-bold text-zinc-300">Copie o código Pix abaixo</p>
                    </div>
                    <div className="relative group">
                      <code className="block w-full p-4 rounded-2xl bg-black/40 border border-white/5 font-mono text-xs text-zinc-300 break-all line-clamp-3 group-hover:border-primary/30 transition-colors">
                        {pixCode}
                      </code>
                      <Button 
                        onClick={handleCopyPix} 
                        size="sm"
                        className={`absolute right-2 bottom-2 h-9 px-4 rounded-xl transition-all ${copied ? "bg-green-600 text-white" : "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"}`}
                      >
                        {copied ? (
                          <><CheckCircle2 className="h-4 w-4 mr-2" /> Copiado</>
                        ) : (
                          <><Copy className="h-4 w-4 mr-2" /> Copiar Código</>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-[10px] font-bold text-green-500">2</div>
                    <p className="text-sm font-bold text-zinc-300">Cole no APP do seu banco</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-4">
                  {deliveredContent.length > 0 ? (
                    deliveredContent.map((content, idx) => (
                      <div key={idx} className="relative group overflow-hidden p-5 rounded-[2rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-primary/20 transition-all duration-500">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-all" />
                        <div className="relative flex items-center justify-between">
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                              <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em]">Entrega Digital #{idx + 1}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <code className="text-base font-mono text-white truncate pr-4">{content}</code>
                            </div>
                          </div>
                          <Button 
                            size="icon" 
                            variant="secondary" 
                            className="h-12 w-12 rounded-2xl bg-white/5 hover:bg-primary hover:text-white transition-all shadow-xl group/btn active:scale-90"
                            onClick={() => copyToClipboard(content)}
                          >
                            <Copy className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center rounded-[2.5rem] bg-black/20 border border-dashed border-white/10 text-muted-foreground">
                      <div className="relative h-16 w-16 mx-auto mb-6">
                        <Loader2 className="h-16 w-16 animate-spin text-primary opacity-40" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <h4 className="text-white font-bold mb-1">Processando Entrega...</h4>
                      <p className="text-xs text-zinc-500">Isso leva apenas alguns segundos, não feche esta página.</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/profile" className="flex-1">
                    <Button 
                      className="w-full h-14 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black italic uppercase tracking-widest shadow-xl shadow-red-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Ir para o Perfil
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
