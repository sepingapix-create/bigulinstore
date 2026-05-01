import * as React from "react";
import { Text, Hr, Section } from "@react-email/components";
import { BaseEmail, EmailButton, InfoBox, KeyBox, sharedStyles } from "./base";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderCreatedEmailProps {
  name: string;
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
  pixCode: string;
  discountAmount?: number;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function OrderCreatedEmail({
  name,
  orderId,
  items,
  totalAmount,
  pixCode,
  discountAmount = 0,
}: OrderCreatedEmailProps) {
  const siteUrl = process.env.NEXT_PUBLIC_URL || "https://bingulin.com";
  const firstName = name?.split(" ")[0] || "Cliente";
  const shortOrder = orderId.slice(0, 8).toUpperCase();

  return (
    <BaseEmail
      preview={`Pedido #${shortOrder} criado — Pague com PIX e receba na hora! ⚡`}
      footerNote={`Pedido ID: ${orderId}`}
    >
      <Text style={sharedStyles.greeting}>
        Pedido criado com sucesso! ⚡
      </Text>

      <Text style={sharedStyles.body_text}>
        Olá, <strong style={{ color: "#ffffff" }}>{firstName}</strong>! Seu pedido{" "}
        <strong style={{ color: "#d4af37" }}>#{shortOrder}</strong> foi registrado.
        Complete o pagamento via PIX para receber seus produtos digitais <strong style={{ color: "#4caf50" }}>instantaneamente</strong>.
      </Text>

      {/* Order Summary */}
      <InfoBox>
        <Text style={{ color: "#d4af37", fontSize: "13px", fontWeight: "700", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          📦 Resumo do Pedido
        </Text>
        {items.map((item, i) => (
          <Section key={i} style={{ margin: "0 0 6px" }}>
            <Text style={{ color: "#cccccc", fontSize: "14px", margin: "0", display: "flex", justifyContent: "space-between" }}>
              {item.name} × {item.quantity}
              <span style={{ color: "#ffffff", fontWeight: "600", float: "right" }}>
                {formatCurrency(item.price * item.quantity)}
              </span>
            </Text>
          </Section>
        ))}
        <Hr style={{ borderColor: "#333333", margin: "10px 0" }} />
        {discountAmount > 0 && (
          <Text style={{ color: "#ff5252", fontSize: "14px", margin: "0 0 4px" }}>
            Desconto: -{formatCurrency(discountAmount)}
          </Text>
        )}
        <Text style={{ color: "#d4af37", fontSize: "17px", fontWeight: "800", margin: "0" }}>
          Total: {formatCurrency(totalAmount)}
        </Text>
      </InfoBox>

      {/* PIX Code */}
      <Text style={{ ...sharedStyles.body_text, fontWeight: "700", color: "#ffffff", marginBottom: "8px" }}>
        📋 Código PIX Copia e Cola:
      </Text>
      <KeyBox content={pixCode} />
      <Text style={{ color: "#888888", fontSize: "12px", margin: "4px 0 20px" }}>
        Válido por 30 minutos. Copie o código acima e cole no seu aplicativo bancário.
      </Text>

      <InfoBox color="#b71c1c">
        <Text style={{ color: "#ffffff", fontSize: "14px", margin: "0", lineHeight: "1.6" }}>
          ⚡ <strong>Após confirmar o pagamento</strong>, você receberá automaticamente
          outro email com seus produtos digitais. O processo é 100% automático e instantâneo.
        </Text>
      </InfoBox>

      <div style={{ textAlign: "center", margin: "24px 0" }}>
        <EmailButton href={`${siteUrl}/order/${orderId}`}>
          Ver Status do Pedido
        </EmailButton>
      </div>

      <Hr style={sharedStyles.hr} />

      <Text style={{ ...sharedStyles.body_text, fontSize: "13px", color: "#666666" }}>
        Se tiver dúvidas, acesse seu pedido pelo link acima ou entre em contato com nosso suporte.
      </Text>
    </BaseEmail>
  );
}

export default OrderCreatedEmail;
