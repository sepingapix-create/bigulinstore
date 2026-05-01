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
  Img,
} from "@react-email/components";

interface BaseEmailProps {
  preview: string;
  children: React.ReactNode;
  footerNote?: string;
}

const styles = {
  html: { backgroundColor: "#000000" },
  body: {
    backgroundColor: "#000000",
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    margin: "0",
    padding: "0",
  },
  wrapper: {
    backgroundColor: "#050505",
    backgroundImage: "url('https://images.unsplash.com/photo-1615598166649-0dcb62ab0096?q=80&w=600&auto=format&fit=crop&opacity=10')", // Subtle dark texture
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "40px 16px",
  },
  container: {
    maxWidth: "560px",
    margin: "0 auto",
    backgroundColor: "#0d0d0d",
    borderRadius: "8px",
    overflow: "hidden",
    border: "1px solid #3e0c0c", // Dark red border
    boxShadow: "0 4px 20px rgba(183, 28, 28, 0.15)",
  },
  header: {
    backgroundColor: "#1a0505",
    borderBottom: "2px solid #b71c1c", // Imperial Red
    padding: "36px 40px",
    textAlign: "center" as const,
    backgroundImage: "linear-gradient(to bottom, #2b0808, #1a0505)",
  },
  headerLogo: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#d4af37", // Imperial Gold
    letterSpacing: "1px",
    margin: "0",
    textTransform: "uppercase" as const,
  },
  headerTagline: {
    fontSize: "13px",
    color: "#a8a8a8",
    margin: "8px 0 0",
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
  },
  contentPadding: {
    padding: "36px 40px",
  },
  greeting: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#ffffff",
    margin: "0 0 16px",
    lineHeight: "1.3",
  },
  body_text: {
    fontSize: "15px",
    color: "#cccccc",
    lineHeight: "1.7",
    margin: "0 0 16px",
  },
  hr: {
    borderColor: "#2a0a0a",
    margin: "28px 0",
  },
  footer: {
    padding: "24px 40px",
    backgroundColor: "#050505",
    borderTop: "1px solid #2a0a0a",
    textAlign: "center" as const,
  },
  footerText: {
    fontSize: "12px",
    color: "#666666",
    lineHeight: "1.6",
    margin: "0",
  },
  footerLink: {
    color: "#b71c1c",
    textDecoration: "none",
  },
};

export function BaseEmail({ preview, children, footerNote }: BaseEmailProps) {
  const siteUrl = process.env.NEXT_PUBLIC_URL || "https://bingulin.com";

  return (
    <Html lang="pt-BR" style={styles.html}>
      <Head>
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Section style={styles.wrapper}>
          <Container style={styles.container}>
            {/* Header */}
            <Section style={styles.header}>
              <Text style={styles.headerLogo}>🐉 Bingulin</Text>
              <Text style={styles.headerTagline}>Império Digital</Text>
            </Section>

            {/* Content */}
            <Section style={styles.contentPadding}>
              {children}
            </Section>

            {/* Footer */}
            <Section style={styles.footer}>
              <Text style={styles.footerText}>
                Este é um e-mail automático. Por favor, não responda diretamente.
              </Text>
              <Text style={{...styles.footerText, marginTop: "12px"}}>
                © {new Date().getFullYear()} Bingulin. Todos os direitos reservados.
                <br />
                Rua do Comércio, 1000 - São Paulo, SP, Brasil (BR)
              </Text>
              <Text style={{...styles.footerText, marginTop: "12px"}}>
                <Link href={`${siteUrl}/privacidade`} style={styles.footerLink}>Privacidade</Link>
                {" • "}
                <Link href={`${siteUrl}/termos`} style={styles.footerLink}>Termos</Link>
                {" • "}
                <Link href={`mailto:${process.env.EMAIL_REPLY_TO || "suporte@bingulin.com"}?subject=unsubscribe`} style={{...styles.footerLink, color: "#888888"}}>
                  Cancelar Inscrição
                </Link>
              </Text>
              {footerNote && (
                <Text style={{ ...styles.footerText, marginTop: "16px", color: "#444444" }}>
                  {footerNote}
                </Text>
              )}
            </Section>
          </Container>
        </Section>
      </Body>
    </Html>
  );
}

// ---------- Shared sub-components ----------

export function EmailButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-block",
        backgroundColor: "#b71c1c", // Imperial Red
        color: "#ffffff",
        fontWeight: "700",
        fontSize: "15px",
        textDecoration: "none",
        padding: "14px 32px",
        borderRadius: "4px",
        margin: "8px 0",
        border: "1px solid #ff5252",
        textTransform: "uppercase",
        letterSpacing: "1px",
      }}
    >
      {children}
    </Link>
  );
}

export function InfoBox({ children, color = "#d4af37" }: { children: React.ReactNode; color?: string }) {
  // color default is gold now
  return (
    <Section
      style={{
        backgroundColor: "#0f0f0f",
        border: `1px solid ${color}40`,
        borderLeft: `4px solid ${color}`,
        borderRadius: "4px",
        padding: "16px 20px",
        margin: "16px 0",
      }}
    >
      {children}
    </Section>
  );
}

export function KeyBox({ content }: { content: string }) {
  return (
    <Section
      style={{
        backgroundColor: "#050505",
        border: "1px solid #333333",
        borderRadius: "4px",
        padding: "14px 18px",
        margin: "8px 0",
        fontFamily: "'Courier New', monospace",
      }}
    >
      <Text
        style={{
          fontSize: "15px",
          color: "#d4af37", // Gold for keys
          margin: "0",
          wordBreak: "break-all",
          letterSpacing: "0.5px",
          fontWeight: "600",
        }}
      >
        {content}
      </Text>
    </Section>
  );
}

export const sharedStyles = styles;
