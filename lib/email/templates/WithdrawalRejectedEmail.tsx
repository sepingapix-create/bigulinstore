import * as React from "react";
import { Text, Hr } from "@react-email/components";
import { BaseEmail, EmailButton, InfoBox, sharedStyles } from "./base";

interface WithdrawalRejectedEmailProps {
  name: string;
  amount: number;
  adminNotes?: string;
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
      preview={`Solicitação de saque de ${formatCurrency(amount)} não aprovada — Saldo devolvido.`}
    >
      <Text style={sharedStyles.greeting}>
        Sobre seu saque, {firstName}
      </Text>

      <Text style={sharedStyles.body_text}>
        Infelizmente sua solicitação de saque no valor de{" "}
        <strong style={{ color: "#f8c8a8" }}>{formatCurrency(amount)}</strong> não foi aprovada
        neste momento.
      </Text>

      <InfoBox color="#e84a4a">
        <Text style={{ color: "#f8a8a8", fontSize: "14px", margin: "0 0 8px", fontWeight: "700" }}>
          ❌ Saque não aprovado
        </Text>
        <Text style={{ color: "#c8a8a8", fontSize: "14px", margin: "0 0 4px" }}>
          Valor solicitado: <strong style={{ color: "#f8f8f8" }}>{formatCurrency(amount)}</strong>
        </Text>
        {adminNotes && (
          <Text style={{ color: "#c8a8a8", fontSize: "14px", margin: "8px 0 0" }}>
            Motivo: <em style={{ color: "#f8c8a8" }}>{adminNotes}</em>
          </Text>
        )}
      </InfoBox>

      <InfoBox color="#4ad868">
        <Text style={{ color: "#a8f8a8", fontSize: "14px", margin: "0" }}>
          ✅ O valor foi <strong>devolvido ao seu saldo</strong> automaticamente.
          Saldo atual: <strong style={{ fontSize: "16px" }}>{formatCurrency(newBalance)}</strong>
        </Text>
      </InfoBox>

      <Text style={sharedStyles.body_text}>
        Você pode tentar novamente a solicitação de saque a qualquer momento.
        Se tiver dúvidas sobre o motivo, entre em contato respondendo este email.
      </Text>

      <div style={{ textAlign: "center", margin: "28px 0" }}>
        <EmailButton href={`${siteUrl}/affiliate`}>
          Ver Meu Painel →
        </EmailButton>
      </div>

      <Hr style={sharedStyles.hr} />

      <Text style={{ ...sharedStyles.body_text, fontSize: "13px", color: "#6868a8" }}>
        Seu saldo está seguro e disponível para uma nova solicitação a qualquer momento.
      </Text>
    </BaseEmail>
  );
}

export default WithdrawalRejectedEmail;
