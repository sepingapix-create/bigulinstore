import * as React from "react";
import { Text, Hr } from "@react-email/components";
import { BaseEmail, EmailButton, InfoBox, sharedStyles } from "./base";

interface WithdrawalRejectedEmailProps {
  name: string;
  amount: number;
  adminNotes?: string | null;
  newBalance: number;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function WithdrawalRejectedEmail({ name, amount, adminNotes, newBalance }: WithdrawalRejectedEmailProps) {
  const siteUrl = process.env.NEXT_PUBLIC_URL || "https://bingulin.com";
  const firstName = name?.split(" ")[0] || "Afiliado";

  return (
    <BaseEmail
      preview={`Sua solicitação de saque de ${formatCurrency(amount)} não foi aprovada.`}
    >
      <Text style={sharedStyles.greeting}>
        Atualização do Saque
      </Text>

      <Text style={sharedStyles.body_text}>
        Olá, <strong style={{ color: "#ffffff" }}>{firstName}</strong>. Sua solicitação de saque no valor de{" "}
        <strong style={{ color: "#ff5252" }}>{formatCurrency(amount)}</strong> não pôde ser concluída e foi recusada.
      </Text>

      <InfoBox color="#b71c1c">
        <Text style={{ color: "#ffffff", fontSize: "14px", margin: "0", lineHeight: "1.6" }}>
          ❌ O valor foi <strong>devolvido integralmente</strong> para o seu saldo de afiliado.
          Nenhum valor foi perdido.
        </Text>
        {adminNotes && (
          <Text style={{ color: "#aaaaaa", fontSize: "13px", margin: "8px 0 0", fontStyle: "italic" }}>
            Motivo: "{adminNotes}"
          </Text>
        )}
      </InfoBox>

      <InfoBox>
        <Text style={{ color: "#d4af37", fontSize: "14px", margin: "0 0 4px" }}>
          Seu saldo atualizado é:
        </Text>
        <Text style={{ color: "#d4af37", fontSize: "18px", fontWeight: "800", margin: "0" }}>
          {formatCurrency(newBalance)}
        </Text>
      </InfoBox>

      <div style={{ textAlign: "center", margin: "28px 0" }}>
        <EmailButton href={`${siteUrl}/affiliate`}>
          Acessar Painel
        </EmailButton>
      </div>

      <Hr style={sharedStyles.hr} />

      <Text style={{ ...sharedStyles.body_text, fontSize: "13px", color: "#666666" }}>
        Se tiver dúvidas sobre a recusa, responda este email para falar com o suporte.
      </Text>
    </BaseEmail>
  );
}

export default WithdrawalRejectedEmail;
