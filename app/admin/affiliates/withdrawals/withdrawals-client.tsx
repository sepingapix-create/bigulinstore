"use client";

import { useState } from "react";
import { updateWithdrawalStatusAction } from "@/actions/admin";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

export function WithdrawalsClient({ initialWithdrawals }: { initialWithdrawals: any[] }) {
  const [withdrawals, setWithdrawals] = useState(initialWithdrawals);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleStatusUpdate = async (id: string, status: "APPROVED" | "REJECTED") => {
    let notes: string | null = null;
    if (status === "REJECTED") {
      notes = prompt("Motivo da rejeição:");
      if (notes === null) return;
    }

    setProcessingId(id);
    const result = await updateWithdrawalStatusAction(id, status, notes || undefined);

    if ("success" in result && result.success) {
      toast.success(status === "APPROVED" ? "Saque aprovado!" : "Saque rejeitado.");
      // Update local state
      setWithdrawals(prev => prev.map(w => 
        w.id === id ? { ...w, status, adminNotes: notes || w.adminNotes, updatedAt: new Date() } : w
      ));
    } else {
      const errorMsg = "error" in result ? result.error : "Erro ao atualizar status";
      toast.error(errorMsg);
    }
    setProcessingId(null);
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

  return (
    <Card className="bg-[#0A0A0A] border-[#1A1A1A] overflow-hidden">
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#111111]">
            <TableRow className="hover:bg-transparent border-[#1A1A1A]">
              <TableHead>Data</TableHead>
              <TableHead>Afiliado</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Dados PIX</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground italic">
                  Nenhuma solicitação de saque encontrada.
                </TableCell>
              </TableRow>
            ) : (
              withdrawals.map((w) => (
                <TableRow key={w.id} className="border-[#1A1A1A] hover:bg-muted/5">
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {new Date(w.createdAt).toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">@{w.affiliate.handle}</p>
                        <p className="text-[10px] text-muted-foreground">{w.affiliate.user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-black text-green-500 text-lg">
                    {fmt(Number(w.amount))}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-[9px] uppercase font-bold py-0 h-4 border-primary/30 text-primary">
                        {w.pixKeyType}
                      </Badge>
                      <p className="font-mono text-sm tracking-tighter">{w.pixKey}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={cn(
                        "text-[10px] uppercase font-black px-2 py-0.5",
                        w.status === "PENDING" && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                        w.status === "APPROVED" && "bg-green-500/10 text-green-500 border-green-500/20",
                        w.status === "REJECTED" && "bg-red-500/10 text-red-500 border-red-500/20",
                      )}
                    >
                      {w.status === "PENDING" ? <Clock className="h-3 w-3 mr-1 inline" /> : null}
                      {w.status === "PENDING" ? "Pendente" : 
                       w.status === "APPROVED" ? "Aprovado" : "Rejeitado"}
                    </Badge>
                    {w.adminNotes && (
                      <p className="text-[10px] text-muted-foreground mt-1 italic">"{w.adminNotes}"</p>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {w.status === "PENDING" ? (
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 text-xs border-green-500/30 text-green-500 hover:bg-green-500/10 hover:text-green-400"
                          onClick={() => handleStatusUpdate(w.id, "APPROVED")}
                          disabled={processingId === w.id}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Aprovar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 text-xs border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                          onClick={() => handleStatusUpdate(w.id, "REJECTED")}
                          disabled={processingId === w.id}
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1" /> Rejeitar
                        </Button>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground italic font-medium">
                        Finalizado em {new Date(w.updatedAt).toLocaleDateString("pt-BR")}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
