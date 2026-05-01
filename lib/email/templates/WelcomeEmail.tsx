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
      preview={`Bem-vindo à Bingulin, ${firstName}! 🎉 Sua conta está pronta.`}
      footerNote={`Conta criada para ${email}`}
    >
      <Text style={sharedStyles.greeting}>
        Bem-vindo à Bingulin, {firstName}! 🎉
      </Text>

      <Text style={sharedStyles.body_text}>
        Sua conta foi criada com sucesso. Agora você tem acesso a toda a nossa
        loja de produtos digitais premium — jogos, streaming, softwares e muito mais.
      </Text>

      <InfoBox color="#6c3de8">
        <Text style={{ color: "#c8b8f8", fontSize: "14px", margin: "0 0 4px", fontWeight: "600" }}>
          🚀 O que você pode fazer agora:
        </Text>
        <Text style={{ color: "#a0a0c0", fontSize: "14px", margin: "4px 0 0", lineHeight: "1.7" }}>
          • Explorar nosso catálogo de produtos digitais<br />
          • Comprar com PIX instantâneo e receber na hora<br />
          • Acessar suas compras no perfil a qualquer momento<br />
          • Participar do programa de afiliados e ganhar comissões
        </Text>
      </InfoBox>

      <div style={{ textAlign: "center", margin: "28px 0" }}>
        <EmailButton href={`${siteUrl}`}>
          Explorar a Loja →
        </EmailButton>
      </div>

      <Hr style={sharedStyles.hr} />

      <Text style={{ ...sharedStyles.body_text, fontSize: "13px", color: "#6868a8" }}>
        Se você não criou esta conta, ignore este email.
        Nenhuma ação é necessária — a conta não será ativada sem o primeiro login.
      </Text>
    </BaseEmail>
  );
}

export default WelcomeEmail;
