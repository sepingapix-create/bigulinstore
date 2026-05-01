import * as React from "react";
import { Text, Hr } from "@react-email/components";
import { BaseEmail, EmailButton, InfoBox, sharedStyles } from "./base";

interface OrderCancelledEmailProps {
  name: string;
  orderId: string;
  totalAmount: number;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function OrderCancelledEmail({ name, orderId, totalAmount }: OrderCancelledEmailProps) {
  const siteUrl = process.env.NEXT_PUBLIC_URL || "https://bingulin.com";
  const firstName = name?.split(" ")[0] || "Cliente";
  const shortOrder = orderId.slice(0, 8).toUpperCase();

  return (
    <BaseEmail
      preview={`Pedido #${shortOrder} cancelado — Podemos te ajudar a refazer.`}
      footerNote={`Pedido ID: ${orderId}`}
    >
      <Text style={sharedStyles.greeting}>
        Pedido cancelado — #{shortOrder}
      </Text>

      <Text style={sharedStyles.body_text}>
        Olá, <strong style={{ color: "#ffffff" }}>{firstName}</strong>. Infelizmente seu pedido no
        valor de <strong style={{ color: "#ff5252" }}>{formatCurrency(totalAmount)}</strong> foi
        cancelado pois o pagamento não foi confirmado dentro do prazo.
      </Text>

      <InfoBox color="#b71c1c">
        <Text style={{ color: "#ffffff", fontSize: "14px", margin: "0", lineHeight: "1.6" }}>
          ❌ Nenhuma cobrança foi realizada. O código PIX expirou e o pedido foi
          automaticamente cancelado pelo sistema.
        </Text>
      </InfoBox>

      <Text style={sharedStyles.body_text}>
        Caso queira adquirir os produtos, basta criar um novo pedido — é rápido
        e o processo se repete instantaneamente.
      </Text>

      <InfoBox>
        <Text style={{ color: "#d4af37", fontSize: "14px", margin: "0", lineHeight: "1.6" }}>
          💡 <strong>Dica:</strong> O PIX gerado tem validade de 30 minutos.
          Se não conseguir pagar no tempo, basta refazer o pedido normalmente.
        </Text>
      </InfoBox>

      <div style={{ textAlign: "center", margin: "28px 0" }}>
        <EmailButton href={`${siteUrl}`}>
          Fazer Novo Pedido
        </EmailButton>
      </div>

      <Hr style={sharedStyles.hr} />

      <Text style={{ ...sharedStyles.body_text, fontSize: "13px", color: "#666666" }}>
        Se acredita que houve um erro, entre em contato respondendo este email com
        o número do pedido <strong style={{ color: "#aaaaaa" }}>#{shortOrder}</strong>.
      </Text>
    </BaseEmail>
  );
}

export default OrderCancelledEmail;
