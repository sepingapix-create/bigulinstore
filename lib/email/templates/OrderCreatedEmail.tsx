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
        Olá, <strong style={{ color: "#e8e8f8" }}>{firstName}</strong>! Seu pedido{" "}
        <strong style={{ color: "#c8b8f8" }}>#{shortOrder}</strong> foi registrado.
        Complete o pagamento via PIX para receber seus produtos digitais <strong style={{ color: "#68d888" }}>instantaneamente</strong>.
      </Text>

      {/* Order Summary */}
      <InfoBox color="#3d7de8">
        <Text style={{ color: "#88aaff", fontSize: "13px", fontWeight: "700", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          📦 Resumo do Pedido
        </Text>
        {items.map((item, i) => (
          <Section key={i} style={{ margin: "0 0 6px" }}>
            <Text style={{ color: "#c8c8e8", fontSize: "14px", margin: "0", display: "flex", justifyContent: "space-between" }}>
              {item.name} × {item.quantity}
              <span style={{ color: "#a8f8c8", fontWeight: "600", float: "right" }}>
                {formatCurrency(item.price * item.quantity)}
              </span>
            </Text>
          </Section>
        ))}
        <Hr style={{ borderColor: "#2a2a5a", margin: "10px 0" }} />
        {discountAmount > 0 && (
          <Text style={{ color: "#f8a8c8", fontSize: "14px", margin: "0 0 4px" }}>
            Desconto: -{formatCurrency(discountAmount)}
          </Text>
        )}
        <Text style={{ color: "#a8f8c8", fontSize: "17px", fontWeight: "800", margin: "0" }}>
          Total: {formatCurrency(totalAmount)}
        </Text>
      </InfoBox>

      {/* PIX Code */}
      <Text style={{ ...sharedStyles.body_text, fontWeight: "700", color: "#e8e8f8", marginBottom: "8px" }}>
        📋 Código PIX Copia e Cola:
      </Text>
      <KeyBox content={pixCode} />
      <Text style={{ color: "#6868a8", fontSize: "12px", margin: "4px 0 20px" }}>
        Válido por 30 minutos. Copie o código acima e cole no seu aplicativo bancário.
      </Text>

      <InfoBox color="#f8c84a">
        <Text style={{ color: "#f8e888", fontSize: "14px", margin: "0", lineHeight: "1.6" }}>
          ⚡ <strong>Após confirmar o pagamento</strong>, você receberá automaticamente
          outro email com seus produtos digitais. O processo é 100% automático e instantâneo.
        </Text>
      </InfoBox>

      <div style={{ textAlign: "center", margin: "24px 0" }}>
        <EmailButton href={`${siteUrl}/order/${orderId}`}>
          Ver Status do Pedido →
        </EmailButton>
      </div>

      <Hr style={sharedStyles.hr} />

      <Text style={{ ...sharedStyles.body_text, fontSize: "13px", color: "#6868a8" }}>
        Se tiver dúvidas, acesse seu pedido pelo link acima ou entre em contato com nosso suporte.
      </Text>
    </BaseEmail>
  );
}

export default OrderCreatedEmail;
