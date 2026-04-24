"use client";

import { useActionState, useEffect, useState } from "react";
import { saveStylepaySettings } from "@/actions/payments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface StylepayFormProps {
  initialData: {
    clientId: string;
    clientSecret: string;
  };
}

export function StylepayForm({ initialData }: StylepayFormProps) {
  const [state, formAction, isPending] = useActionState(saveStylepaySettings, null);
  const [clientId, setClientId] = useState(initialData.clientId);
  const [clientSecret, setClientSecret] = useState(initialData.clientSecret);

  useEffect(() => {
    if (state?.success) {
      toast.success("Configurações salvas com sucesso!");
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6 relative z-10">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-black uppercase italic text-muted-foreground tracking-widest">
            Client ID
          </label>
          <Input
            name="clientId"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="Seu Client ID Stylepay"
            className="bg-[#111] border-[#222] focus:border-primary/50 h-12 font-mono text-sm text-white"
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-black uppercase italic text-muted-foreground tracking-widest">
            Client Secret
          </label>
          <Input
            name="clientSecret"
            type="password"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            placeholder="••••••••••••••••"
            className="bg-[#111] border-[#222] focus:border-primary/50 h-12 font-mono text-sm text-white"
            disabled={isPending}
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-3 items-start">
        <ShieldCheck className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-400/80 leading-relaxed">
          Suas chaves são armazenadas com segurança. Certifique-se de configurar o Webhook no painel da Stylepay para:{" "}
          <code className="bg-black/50 px-1 rounded">https://seudominio.com/api/webhooks/stylepay</code>
        </p>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold uppercase italic tracking-widest shadow-lg shadow-primary/20"
      >
        {isPending ? "Salvando..." : "Salvar Configurações"}
      </Button>
    </form>
  );
}
