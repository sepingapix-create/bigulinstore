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

  return (
    <BaseEmail
      preview={`✅ Pagamento confirmado! Seus produtos digitais estão prontos — #${shortOrder}`}
      footerNote={`Pedido ID: ${orderId} · Valor: ${formatCurrency(totalAmount)}`}
    >
      {/* Success banner */}
      <Section
        style={{
          background: "linear-gradient(135deg, #1a3a2a 0%, #0d2a1a 100%)",
          border: "1px solid #2a6a3a",
          borderRadius: "12px",
          padding: "20px 24px",
          margin: "0 0 24px",
          textAlign: "center",
        }}
      >
        <Text style={{ fontSize: "40px", margin: "0 0 8px" }}>✅</Text>
        <Text style={{ color: "#68d888", fontSize: "20px", fontWeight: "800", margin: "0 0 4px" }}>
          Pagamento Confirmado!
        </Text>
        <Text style={{ color: "#a8c8b8", fontSize: "14px", margin: "0" }}>
          Pedido #{shortOrder} · {formatCurrency(totalAmount)}
        </Text>
      </Section>

      <Text style={sharedStyles.greeting}>
        Seus produtos estão prontos, {firstName}! 🎮
      </Text>

      <Text style={sharedStyles.body_text}>
        Ótimas notícias! Seu pagamento foi confirmado e seus produtos digitais
        foram entregues abaixo. Guarde este email em local seguro — ele contém
        todas as suas credenciais de acesso.
      </Text>

      {/* Delivered items */}
      {deliveredItems.map((item, i) => (
        <Section key={i} style={{ margin: "0 0 24px" }}>
          <InfoBox color="#6c3de8">
            <Text
              style={{
                color: "#c8b8f8",
                fontSize: "15px",
                fontWeight: "700",
                margin: "0 0 12px",
              }}
            >
              🎯 {item.productName}
            </Text>
            {item.keys.map((key, j) => (
              <div key={j}>
                {item.keys.length > 1 && (
                  <Text style={{ color: "#6868a8", fontSize: "11px", margin: "8px 0 2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Item {j + 1}
                  </Text>
                )}
                <KeyBox content={key} />
              </div>
            ))}
          </InfoBox>
        </Section>
      ))}

      <InfoBox color="#f8c84a">
        <Text style={{ color: "#f8e888", fontSize: "14px", margin: "0", lineHeight: "1.6" }}>
          💡 <strong>Dica:</strong> Você também pode acessar seus produtos a qualquer
          momento na área do seu perfil. As credenciais ficam salvas com segurança.
        </Text>
      </InfoBox>

      <div style={{ textAlign: "center", margin: "28px 0" }}>
        <EmailButton href={`${siteUrl}/profile`}>
          Acessar Meus Produtos →
        </EmailButton>
      </div>

      <Hr style={sharedStyles.hr} />

      <Text style={{ ...sharedStyles.body_text, fontSize: "13px" }}>
        Obrigado por comprar na Bingulin! Se tiver algum problema com os produtos,
        entre em contato conosco respondendo este email.
      </Text>
    </BaseEmail>
  );
}

export default OrderPaidEmail;
