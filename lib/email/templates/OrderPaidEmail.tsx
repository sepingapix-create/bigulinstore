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

interface DeliveredItem {
  productName: string;
  keys: string[]; // The actual digital content/keys delivered
}

interface OrderPaidEmailProps {
  name: string;
  orderId: string;
  totalAmount: number;
  deliveredItems: DeliveredItem[];
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function OrderPaidEmail({
  name,
  orderId,
  totalAmount,
  deliveredItems,
}: OrderPaidEmailProps) {
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
    "orderStatus": "http://schema.org/OrderDelivered",
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
      <Preview>Recibo e entrega de credenciais — Pedido #{shortOrder}</Preview>
      <Body style={{ backgroundColor: "#f9fafb", fontFamily: "Arial, sans-serif", padding: "20px 0", margin: "0" }}>
        <Container style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "4px", padding: "32px", maxWidth: "600px", margin: "0 auto" }}>
          
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(orderSchema) }}
          />

          <Section style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: "16px", marginBottom: "24px" }}>
            <Text style={{ fontSize: "20px", fontWeight: "bold", color: "#111827", margin: "0" }}>
              Recibo de Pagamento e Entrega Digital
            </Text>
            <Text style={{ fontSize: "14px", color: "#6b7280", margin: "4px 0 0 0" }}>
              Bingulin — Pedido #{shortOrder} · {formatCurrency(totalAmount)}
            </Text>
          </Section>

          <Text style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6", margin: "0 0 16px 0" }}>
            Prezado(a) <strong>{firstName}</strong>,
            <br />
            Acusamos o recebimento do pagamento referente ao pedido #{shortOrder}.
            Abaixo encontram-se as credenciais e licenças de acesso adquiridas. Recomendamos que arquive este e-mail para futuras referências.
          </Text>

          {/* Delivered Items */}
          {deliveredItems.map((item, i) => (
            <Section key={i} style={{ backgroundColor: "#f3f4f6", padding: "16px", borderRadius: "4px", marginBottom: "16px" }}>
              <Text style={{ fontSize: "14px", fontWeight: "bold", color: "#111827", margin: "0 0 12px 0", textTransform: "uppercase" }}>
                {item.productName}
              </Text>
              {item.keys.map((key, j) => (
                <div key={j} style={{ marginBottom: "8px" }}>
                  {item.keys.length > 1 && (
                    <Text style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 4px 0" }}>
                      Licença {j + 1}
                    </Text>
                  )}
                  <Section style={{ backgroundColor: "#ffffff", border: "1px solid #d1d5db", padding: "12px", borderRadius: "4px" }}>
                    <Text style={{ fontSize: "14px", fontFamily: "monospace", color: "#111827", margin: "0", wordBreak: "break-all" }}>
                      {key}
                    </Text>
                  </Section>
                </div>
              ))}
            </Section>
          ))}

          <Text style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6", margin: "0 0 24px 0" }}>
            Para sua conveniência e segurança, o histórico de suas aquisições e respectivas credenciais 
            permanecem acessíveis em caráter permanente através da área restrita do seu perfil em nossa plataforma.
          </Text>

          <Section style={{ textAlign: "center", marginBottom: "32px" }}>
            <Link
              href={`${siteUrl}/profile`}
              style={{ backgroundColor: "#111827", color: "#ffffff", padding: "12px 24px", borderRadius: "4px", textDecoration: "none", fontSize: "14px", fontWeight: "bold", display: "inline-block" }}
            >
              Acessar Painel do Usuário
            </Link>
          </Section>

          <Hr style={{ borderColor: "#e5e7eb", margin: "0 0 16px 0" }} />

          <Text style={{ fontSize: "11px", color: "#9ca3af", margin: "0 0 8px 0", lineHeight: "1.5" }}>
            Este é um documento de entrega automática. Para questões técnicas relacionadas aos itens adquiridos, favor acionar o suporte utilizando o e-mail cadastrado.
          </Text>
          <Text style={{ fontSize: "11px", color: "#9ca3af", margin: "0", lineHeight: "1.5" }}>
            Bingulin © {new Date().getFullYear()} — Rua do Comércio, 1000 - São Paulo, SP, Brasil (BR)
            <br />
            Você está recebendo este e-mail pois realizou uma compra em nossa plataforma.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default OrderPaidEmail;
