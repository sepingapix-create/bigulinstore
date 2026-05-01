import * as React from "react";
import { Text, Hr } from "@react-email/components";
import { BaseEmail, EmailButton, InfoBox, sharedStyles } from "./base";

interface WithdrawalApprovedEmailProps {
  name: string;
  amount: number;
  pixKey: string;
  pixKeyType: string;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function WithdrawalApprovedEmail({ name, amount, pixKey, pixKeyType }: WithdrawalApprovedEmailProps) {
  const siteUrl = process.env.NEXT_PUBLIC_URL || "https://bingulin.com";
  const firstName = name?.split(" ")[0] || "Afiliado";

  return (
    <BaseEmail
      preview={`✅ Saque de ${formatCurrency(amount)} aprovado! O valor será enviado ao seu PIX.`}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a05 0%, #2b2b08 100%)",
          border: "1px solid #d4af37",
          borderRadius: "8px",
          padding: "24px",
          margin: "0 0 24px",
          textAlign: "center",
        }}
      >
        <Text style={{ fontSize: "36px", margin: "0 0 8px" }}>✅</Text>
        <Text style={{ color: "#d4af37", fontSize: "26px", fontWeight: "900", margin: "0 0 4px" }}>
          Saque Aprovado!
        </Text>
        <Text style={{ color: "#cccccc", fontSize: "15px", margin: "0" }}>
          {formatCurrency(amount)}
        </Text>
      </div>

      <Text style={sharedStyles.greeting}>
        Boa notícia, {firstName}! 🎊
      </Text>

      <Text style={sharedStyles.body_text}>
        Sua solicitação de saque foi <strong style={{ color: "#d4af37" }}>aprovada</strong> pela
        nossa equipe. O valor será transferido para o seu PIX em breve.
      </Text>

      <InfoBox>
        <Text style={{ color: "#d4af37", fontSize: "13px", fontWeight: "700", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          💳 Dados do Pagamento
        </Text>
        <Text style={{ color: "#cccccc", fontSize: "14px", margin: "0 0 4px" }}>
          Valor: <strong style={{ color: "#4caf50", fontSize: "16px" }}>{formatCurrency(amount)}</strong>
        </Text>
        <Text style={{ color: "#cccccc", fontSize: "14px", margin: "0 0 4px" }}>
          Chave PIX ({pixKeyType}): <strong style={{ color: "#ffffff" }}>{pixKey}</strong>
        </Text>
        <Text style={{ color: "#888888", fontSize: "12px", margin: "8px 0 0" }}>
          O prazo de processamento pode variar de acordo com seu banco (geralmente imediato).
        </Text>
      </InfoBox>

      <div style={{ textAlign: "center", margin: "28px 0" }}>
        <EmailButton href={`${siteUrl}/affiliate`}>
          Ver Meu Painel
        </EmailButton>
      </div>

      <Hr style={sharedStyles.hr} />

      <Text style={{ ...sharedStyles.body_text, fontSize: "13px", color: "#666666" }}>
        Obrigado por fazer parte do império Bingulin!
        Continue indicando e aumentando seus ganhos.
      </Text>
    </BaseEmail>
  );
}

export default WithdrawalApprovedEmail;
