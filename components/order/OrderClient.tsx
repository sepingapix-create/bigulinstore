"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Copy, Download, QrCode, Loader2 } from "lucide-react";
import { simulatePaymentAction } from "@/actions/checkout";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
      
      if (status === "PENDING" && !isSimulating) {
        toast.info("Simulando aprovação de pagamento em 5 segundos...");
        handleSimulatePayment();
      }
    }
  };

  async function handleSimulatePayment() {
    setIsSimulating(true);
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const result = await simulatePaymentAction(orderId);
    
    if (result.success) {
      setStatus("PAID");
      toast.success("Pagamento aprovado!");
      router.refresh();
    } else {
      toast.error("Erro ao simular pagamento");
    }
    setIsSimulating(false);
  }

  return (
    <div className="grid gap-6">
      {/* Status Card */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Status do Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center gap-3">
              {status === "PENDING" ? (
                <>
                  <div className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-500"></span>
                  </div>
                  <span className="font-medium text-yellow-500">Aguardando Pagamento</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-green-500">Pagamento Aprovado</span>
                </>
              )}
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              PIX
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Payment Instructions / Resgatar */}
      <Card className="border-border/50 shadow-lg shadow-primary/5">
        <CardHeader>
          <CardTitle className="text-xl">
            {status === "PENDING" ? "Realize o Pagamento" : "Acesso Liberado!"}
          </CardTitle>
          <CardDescription>
            {status === "PENDING" 
              ? "Copie o código abaixo e cole no aplicativo do seu banco para finalizar a compra."
              : "Seu pagamento foi confirmado. Veja abaixo os seus produtos digitais."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === "PENDING" ? (
            <>
              <div className="flex justify-center p-4 sm:p-8 bg-white rounded-xl max-w-[280px] sm:max-w-sm mx-auto shadow-inner border border-border/20">
                {qrCodeImage ? (
                  <img 
                    src={qrCodeImage.startsWith("data:image") ? qrCodeImage : `data:image/png;base64,${qrCodeImage}`} 
                    alt="QR Code PIX" 
                    className="w-full h-auto aspect-square object-contain mix-blend-multiply"
                  />
                ) : (
                  <QrCode className="w-48 h-48 text-black opacity-10" />
                )}
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Código PIX Copia e Cola:</p>
                <div className="flex gap-2">
                  <code className="flex-1 p-3 rounded-lg bg-muted border border-border/50 font-mono text-xs break-all line-clamp-2">
                    {pixCode}
                  </code>
                  <Button 
                    onClick={handleCopyPix} 
                    className="shrink-0 h-auto"
                    variant={copied ? "default" : "secondary"}
                    disabled={isSimulating && status === "PENDING"}
                  >
                    {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Produtos Entregues:</h3>
              {deliveredContent.length > 0 ? (
                <div className="grid gap-3">
                  {deliveredContent.map((content, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between group">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Acesso {idx + 1}</p>
                        <code className="text-sm font-mono text-white">{content}</code>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-primary opacity-50 group-hover:opacity-100 transition-opacity"
                        onClick={() => copyToClipboard(content)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center rounded-xl border border-dashed border-border text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" />
                  <p>Processando sua entrega automática...</p>
                  <p className="text-xs">Isso deve levar apenas alguns segundos.</p>
                </div>
              )}
              <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/25">
                <Download className="mr-2 h-4 w-4" /> Baixar Comprovante
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
