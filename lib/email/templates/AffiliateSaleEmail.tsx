import * as React from "react";
import { Text, Hr } from "@react-email/components";
import { BaseEmail, EmailButton, InfoBox, sharedStyles } from "./base";

interface AffiliateSaleEmailProps {
  affiliateName: string;
  commissionAmount: number;
  orderTotal: number;
  orderId: string;
  newBalance: number;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function AffiliateSaleEmail({
  affiliateName,
  commissionAmount,
  orderTotal,
  orderId,
  newBalance,
}: AffiliateSaleEmailProps) {
  const siteUrl = process.env.NEXT_PUBLIC_URL || "https://bingulin.com";
  const firstName = affiliateName?.split(" ")[0] || "Afiliado";
  const shortOrder = orderId.slice(0, 8).toUpperCase();

  return (
    <BaseEmail
      preview={`💰 Nova comissão! Você ganhou ${formatCurrency(commissionAmount)} por uma venda.`}
    >
      {/* Commission banner */}
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
        <Text style={{ fontSize: "36px", margin: "0 0 8px" }}>💰</Text>
        <Text style={{ color: "#d4af37", fontSize: "28px", fontWeight: "900", margin: "0 0 4px" }}>
          +{formatCurrency(commissionAmount)}
        </Text>
        <Text style={{ color: "#cccccc", fontSize: "14px", margin: "0" }}>
          Nova comissão creditada!
        </Text>
      </div>

      <Text style={sharedStyles.greeting}>
        Parabéns, {firstName}! Nova venda! 🎉
      </Text>

      <Text style={sharedStyles.body_text}>
        Uma venda foi realizada através do seu link de afiliado e sua comissão
        foi creditada automaticamente no seu saldo.
      </Text>

      <InfoBox>
        <Text style={{ color: "#d4af37", fontSize: "13px", fontWeight: "700", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          📊 Detalhes da Comissão
        </Text>
        <Text style={{ color: "#cccccc", fontSize: "14px", margin: "0 0 4px" }}>
          Pedido: <strong style={{ color: "#ffffff" }}>#{shortOrder}</strong>
        </Text>
        <Text style={{ color: "#cccccc", fontSize: "14px", margin: "0 0 4px" }}>
          Valor da venda: <strong style={{ color: "#ffffff" }}>{formatCurrency(orderTotal)}</strong>
        </Text>
        <Text style={{ color: "#cccccc", fontSize: "14px", margin: "0 0 8px" }}>
          Sua comissão: <strong style={{ color: "#4caf50", fontSize: "16px" }}>{formatCurrency(commissionAmount)}</strong>
        </Text>
        <Hr style={{ borderColor: "#333333", margin: "10px 0" }} />
        <Text style={{ color: "#d4af37", fontSize: "15px", fontWeight: "800", margin: "0" }}>
          Saldo atual: {formatCurrency(newBalance)}
        </Text>
      </InfoBox>

      <Text style={sharedStyles.body_text}>
        Quando quiser sacar, acesse o painel de afiliados e solicite a retirada
        para sua chave PIX cadastrada.
      </Text>

      <div style={{ textAlign: "center", margin: "28px 0" }}>
        <EmailButton href={`${siteUrl}/affiliate`}>
          Ver Meu Painel de Afiliado
        </EmailButton>
      </div>

      <Hr style={sharedStyles.hr} />

      <Text style={{ ...sharedStyles.body_text, fontSize: "13px", color: "#666666" }}>
        Continue compartilhando seu link para aumentar seus ganhos!
        Cada venda gera comissão automática.
      </Text>
    </BaseEmail>
  );
}

export default AffiliateSaleEmail;
