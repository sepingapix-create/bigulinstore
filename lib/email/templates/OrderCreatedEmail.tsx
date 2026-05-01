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

  // Structured Data / Schema.org para o Gmail identificar como Recibo (Anti-Spam 2026)
  const orderSchema = {
    "@context": "http://schema.org",
    "@type": "Order",
    "merchant": {
      "@type": "Organization",
      "name": "Bingulin"
    },
    "orderNumber": shortOrder,
    "priceCurrency": "BRL",
    "price": totalAmount,
    "orderStatus": "http://schema.org/OrderPaymentDue",
    "url": `${siteUrl}/order/${orderId}`
  };

  return (
    <BaseEmail
      preview={`Instruções de pagamento para o Pedido #${shortOrder}`}
      footerNote={`Documento referente ao Pedido ID: ${orderId}`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orderSchema) }}
      />

      <Text style={sharedStyles.greeting}>
        Resumo do Pedido #{shortOrder}
      </Text>

      <Text style={sharedStyles.body_text}>
        Olá, <strong style={{ color: "#ffffff" }}>{firstName}</strong>. 
        Recebemos a sua solicitação. O status atual do pedido é aguardando pagamento.
        Efetue a transferência via PIX utilizando o código abaixo para que possamos processar a entrega digital.
      </Text>

      <InfoBox>
        <Text style={{ color: "#d4af37", fontSize: "13px", fontWeight: "700", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          📦 Detalhes dos Itens
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
            Desconto Aplicado: -{formatCurrency(discountAmount)}
          </Text>
        )}
        <Text style={{ color: "#d4af37", fontSize: "17px", fontWeight: "800", margin: "0" }}>
          Valor a Pagar: {formatCurrency(totalAmount)}
        </Text>
      </InfoBox>

      <Text style={{ ...sharedStyles.body_text, fontWeight: "700", color: "#ffffff", marginBottom: "8px" }}>
        📋 Linha Digitável PIX (Copia e Cola):
      </Text>
      <KeyBox content={pixCode} />
      <Text style={{ color: "#888888", fontSize: "12px", margin: "4px 0 20px" }}>
        A chave expira em 30 minutos. Uma vez compensado, um novo e-mail será gerado contendo o acesso aos produtos.
      </Text>

      <div style={{ textAlign: "center", margin: "24px 0" }}>
        <EmailButton href={`${siteUrl}/order/${orderId}`}>
          Acompanhar Pedido
        </EmailButton>
      </div>

      <Hr style={sharedStyles.hr} />

      <Text style={{ ...sharedStyles.body_text, fontSize: "13px", color: "#666666" }}>
        Este é um documento de registro de compra gerado por sistema automatizado.
      </Text>
    </BaseEmail>
  );
}

export default OrderCreatedEmail;
