import { getWithdrawalsAction } from "@/actions/admin";
import { WithdrawalsClient } from "./withdrawals-client";

export default async function AdminWithdrawalsPage() {
  const withdrawals = await getWithdrawalsAction();
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight italic uppercase italic">Solicitações de Saque</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie os pedidos de pagamento dos afiliados via PIX.
        </p>
      </div>
      
      <WithdrawalsClient initialWithdrawals={withdrawals} />
    </div>
  );
}
