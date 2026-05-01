import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Link,
} from "@react-email/components";

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
    <Html lang="pt-BR" style={{ backgroundColor: "#f9fafb" }}>
      <Head>
        <style>
          {`
            a[href^="mailto:"] { color: inherit !important; text-decoration: none !important; }
          `}
        </style>
      </Head>
      <Preview>Instruções de pagamento para o Pedido #{shortOrder}</Preview>
      <Body style={{ backgroundColor: "#f9fafb", fontFamily: "Arial, sans-serif", padding: "20px 0", margin: "0" }}>
        <Container style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "4px", padding: "32px", maxWidth: "600px", margin: "0 auto" }}>
          
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(orderSchema) }}
          />

          <Section style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: "16px", marginBottom: "24px" }}>
            <Text style={{ fontSize: "20px", fontWeight: "bold", color: "#111827", margin: "0" }}>
              Resumo do Pedido #{shortOrder}
            </Text>
            <Text style={{ fontSize: "14px", color: "#6b7280", margin: "4px 0 0 0" }}>
              Bingulin — Detalhes da Solicitação
            </Text>
          </Section>

          <Text style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6", margin: "0 0 16px 0" }}>
            Prezado(a) <strong>{firstName}</strong>,
            <br />
            Recebemos a sua solicitação. O status atual do pedido é aguardando pagamento. Efetue a transferência via PIX utilizando o código abaixo para que possamos processar a entrega digital.
          </Text>

          {/* Items Table Equivalent */}
          <Section style={{ backgroundColor: "#f3f4f6", padding: "16px", borderRadius: "4px", marginBottom: "24px" }}>
            <Text style={{ fontSize: "14px", fontWeight: "bold", color: "#111827", margin: "0 0 12px 0", textTransform: "uppercase" }}>
              Detalhes dos Itens
            </Text>
            {items.map((item, i) => (
              <Text key={i} style={{ fontSize: "14px", color: "#374151", margin: "0 0 8px 0", display: "flex", justifyContent: "space-between" }}>
                <span>{item.name} × {item.quantity}</span>
                <span style={{ float: "right", fontWeight: "bold" }}>{formatCurrency(item.price * item.quantity)}</span>
              </Text>
            ))}
            <Hr style={{ borderColor: "#e5e7eb", margin: "12px 0" }} />
            {discountAmount > 0 && (
              <Text style={{ fontSize: "14px", color: "#dc2626", margin: "0 0 4px 0" }}>
                Desconto Aplicado: -{formatCurrency(discountAmount)}
              </Text>
            )}
            <Text style={{ fontSize: "16px", fontWeight: "bold", color: "#111827", margin: "0" }}>
              Valor a Pagar: {formatCurrency(totalAmount)}
            </Text>
          </Section>

          <Text style={{ fontSize: "14px", fontWeight: "bold", color: "#111827", margin: "0 0 8px 0" }}>
            Linha Digitável PIX (Copia e Cola):
          </Text>
          <Section style={{ backgroundColor: "#ffffff", border: "1px dashed #9ca3af", padding: "16px", borderRadius: "4px", marginBottom: "8px" }}>
            <Text style={{ fontSize: "14px", fontFamily: "monospace", color: "#111827", margin: "0", wordBreak: "break-all" }}>
              {pixCode}
            </Text>
          </Section>
          <Text style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 24px 0" }}>
            A chave expira em 30 minutos. Uma vez compensado, um novo e-mail será gerado contendo o acesso aos produtos.
          </Text>

          <Section style={{ textAlign: "center", marginBottom: "32px" }}>
            <Link
              href={`${siteUrl}/order/${orderId}`}
              style={{ backgroundColor: "#111827", color: "#ffffff", padding: "12px 24px", borderRadius: "4px", textDecoration: "none", fontSize: "14px", fontWeight: "bold", display: "inline-block" }}
            >
              Acompanhar Pedido
            </Link>
          </Section>

          <Hr style={{ borderColor: "#e5e7eb", margin: "0 0 16px 0" }} />

          <Text style={{ fontSize: "11px", color: "#9ca3af", margin: "0 0 8px 0", lineHeight: "1.5" }}>
            Este é um documento de registro de compra gerado por sistema automatizado. Não responda diretamente a esta mensagem.
          </Text>
          <Text style={{ fontSize: "11px", color: "#9ca3af", margin: "0", lineHeight: "1.5" }}>
            Bingulin © {new Date().getFullYear()} — Rua do Comércio, 1000 - São Paulo, SP, Brasil (BR)
            <br />
            Você está recebendo este e-mail pois realizou um pedido em nossa plataforma.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default OrderCreatedEmail;
