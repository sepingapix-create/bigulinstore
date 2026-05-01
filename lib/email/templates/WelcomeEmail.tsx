import * as React from "react";
import { Text, Hr, Link } from "@react-email/components";
import { BaseEmail, EmailButton, InfoBox, sharedStyles } from "./base";

interface WelcomeEmailProps {
  name: string;
  email: string;
}

export function WelcomeEmail({ name, email }: WelcomeEmailProps) {
  const siteUrl = process.env.NEXT_PUBLIC_URL || "https://bingulin.com";
  const firstName = name?.split(" ")[0] || "Usuário";

  return (
    <BaseEmail
      preview={`Bem-vindo ao Império Bingulin, ${firstName}! 🎉 Sua conta está pronta.`}
      footerNote={`Conta criada para ${email}`}
    >
      <Text style={sharedStyles.greeting}>
        Bem-vindo ao Império, {firstName}! 🐉
      </Text>

      <Text style={sharedStyles.body_text}>
        Sua conta foi criada com sucesso. Agora você tem acesso a toda a nossa
        loja de produtos digitais premium — jogos, streaming, softwares e muito mais.
      </Text>

      <InfoBox>
        <Text style={{ color: "#d4af37", fontSize: "15px", margin: "0 0 8px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
          ⚔️ O que você pode fazer agora:
        </Text>
        <Text style={{ color: "#cccccc", fontSize: "14px", margin: "4px 0 0", lineHeight: "1.7" }}>
          • Explorar nosso catálogo de produtos digitais<br />
          • Comprar com PIX instantâneo e receber na hora<br />
          • Acessar suas compras no perfil a qualquer momento<br />
          • Participar do programa de afiliados e ganhar comissões
        </Text>
      </InfoBox>

      <div style={{ textAlign: "center", margin: "32px 0" }}>
        <EmailButton href={`${siteUrl}`}>
          Explorar a Loja
        </EmailButton>
      </div>

      <Hr style={sharedStyles.hr} />

      <Text style={{ ...sharedStyles.body_text, fontSize: "13px", color: "#666666" }}>
        Se você não criou esta conta, ignore este email.
        Nenhuma ação é necessária — a conta não será ativada sem o primeiro login.
      </Text>
    </BaseEmail>
  );
}

export default WelcomeEmail;
