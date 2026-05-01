import * as React from "react";
import { Text, Hr, Section } from "@react-email/components";
import { BaseEmail, EmailButton, InfoBox, KeyBox, sharedStyles } from "./base";

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

  // Structured Data / Schema.org para recibo e entrega digital (Anti-Spam 2026)
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
    <BaseEmail
      preview={`Recibo e entrega de credenciais — Pedido #${shortOrder}`}
      footerNote={`Documento referente ao Pedido ID: ${orderId}`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orderSchema) }}
      />

      {/* Success banner */}
      <Section
        style={{
          background: "linear-gradient(135deg, #1a0505 0%, #2b0808 100%)",
          border: "1px solid #b71c1c",
          borderRadius: "8px",
          padding: "20px 24px",
          margin: "0 0 24px",
          textAlign: "center",
        }}
      >
        <Text style={{ fontSize: "40px", margin: "0 0 8px" }}>✅</Text>
        <Text style={{ color: "#d4af37", fontSize: "20px", fontWeight: "800", margin: "0 0 4px" }}>
          Pagamento Confirmado
        </Text>
        <Text style={{ color: "#cccccc", fontSize: "14px", margin: "0" }}>
          Recibo #{shortOrder} · {formatCurrency(totalAmount)}
        </Text>
      </Section>

      <Text style={sharedStyles.greeting}>
        Entrega Digital do Pedido
      </Text>

      <Text style={sharedStyles.body_text}>
        Prezado(a) <strong style={{ color: "#ffffff" }}>{firstName}</strong>,
        <br /><br />
        Acusamos o recebimento do pagamento referente ao pedido #{shortOrder}.
        Abaixo encontram-se as credenciais e licenças de acesso adquiridas.
        Recomendamos que arquive este e-mail para futuras referências.
      </Text>

      {/* Delivered items */}
      {deliveredItems.map((item, i) => (
        <Section key={i} style={{ margin: "0 0 24px" }}>
          <InfoBox>
            <Text
              style={{
                color: "#d4af37",
                fontSize: "15px",
                fontWeight: "700",
                margin: "0 0 12px",
              }}
            >
              📑 {item.productName}
            </Text>
            {item.keys.map((key, j) => (
              <div key={j}>
                {item.keys.length > 1 && (
                  <Text style={{ color: "#888888", fontSize: "11px", margin: "8px 0 2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Licença {j + 1}
                  </Text>
                )}
                <KeyBox content={key} />
              </div>
            ))}
          </InfoBox>
        </Section>
      ))}

      <Text style={{ ...sharedStyles.body_text, fontSize: "14px" }}>
        Para sua conveniência e segurança, o histórico de suas aquisições e respectivas credenciais 
        permanecem acessíveis em caráter permanente através da área restrita do seu perfil em nossa plataforma.
      </Text>

      <div style={{ textAlign: "center", margin: "28px 0" }}>
        <EmailButton href={`${siteUrl}/profile`}>
          Acessar Painel do Usuário
        </EmailButton>
      </div>

      <Hr style={sharedStyles.hr} />

      <Text style={{ ...sharedStyles.body_text, fontSize: "13px", color: "#666666" }}>
        Este é um documento de entrega automática. Para questões técnicas relacionadas aos itens adquiridos, favor acionar o suporte utilizando o e-mail cadastrado.
      </Text>
    </BaseEmail>
  );
}

export default OrderPaidEmail;
