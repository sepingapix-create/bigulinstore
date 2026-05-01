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

interface BaseEmailProps {
  preview: string;
  children: React.ReactNode;
  footerNote?: string;
}

const styles = {
  html: { backgroundColor: "#0a0a0f" },
  body: {
    backgroundColor: "#0a0a0f",
    fontFamily: "'Segoe UI', Helvetica, Arial, sans-serif",
    margin: "0",
    padding: "0",
  },
  wrapper: {
    backgroundColor: "#0a0a0f",
    padding: "40px 16px",
  },
  container: {
    maxWidth: "560px",
    margin: "0 auto",
    backgroundColor: "#0d0d1a",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid #1e1e3a",
  },
  header: {
    background: "linear-gradient(135deg, #6c3de8 0%, #9b59b6 50%, #3d7de8 100%)",
    padding: "32px 40px",
    textAlign: "center" as const,
  },
  headerLogo: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: "-0.5px",
    margin: "0",
  },
  headerTagline: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.75)",
    margin: "6px 0 0",
  },
  contentPadding: {
    padding: "36px 40px",
  },
  greeting: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#e8e8f8",
    margin: "0 0 16px",
    lineHeight: "1.3",
  },
  body_text: {
    fontSize: "15px",
    color: "#a8a8c8",
    lineHeight: "1.7",
    margin: "0 0 16px",
  },
  hr: {
    borderColor: "#1e1e3a",
    margin: "28px 0",
  },
  footer: {
    padding: "24px 40px",
    backgroundColor: "#08080f",
    borderTop: "1px solid #1e1e3a",
    textAlign: "center" as const,
  },
  footerText: {
    fontSize: "12px",
    color: "#55557a",
    lineHeight: "1.6",
    margin: "0",
  },
  footerLink: {
    color: "#7c6de8",
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
              <Text style={styles.headerLogo}>⚡ Bingulin</Text>
              <Text style={styles.headerTagline}>Loja Digital Premium</Text>
            </Section>

            {/* Content */}
            <Section style={styles.contentPadding}>
              {children}
            </Section>

            {/* Footer */}
            <Section style={styles.footer}>
              <Text style={styles.footerText}>
                © {new Date().getFullYear()} Bingulin. Todos os direitos reservados.
                <br />
                <Link href={`${siteUrl}/privacidade`} style={styles.footerLink}>
                  Política de Privacidade
                </Link>
                {" · "}
                <Link href={`${siteUrl}/termos`} style={styles.footerLink}>
                  Termos de Uso
                </Link>
                {" · "}
                <Link href={`mailto:${process.env.EMAIL_REPLY_TO || "suporte@bingulin.com"}?subject=cancelar`} style={styles.footerLink}>
                  Cancelar inscrição
                </Link>
              </Text>
              {footerNote && (
                <Text style={{ ...styles.footerText, marginTop: "8px", color: "#3a3a5a" }}>
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
        backgroundColor: "#6c3de8",
        color: "#ffffff",
        fontWeight: "700",
        fontSize: "15px",
        textDecoration: "none",
        padding: "14px 32px",
        borderRadius: "10px",
        margin: "8px 0",
      }}
    >
      {children}
    </Link>
  );
}

export function InfoBox({ children, color = "#6c3de8" }: { children: React.ReactNode; color?: string }) {
  return (
    <Section
      style={{
        backgroundColor: "#12122a",
        border: `1px solid ${color}33`,
        borderLeft: `4px solid ${color}`,
        borderRadius: "10px",
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
        backgroundColor: "#0a0a18",
        border: "1px solid #2a2a4a",
        borderRadius: "8px",
        padding: "14px 18px",
        margin: "8px 0",
        fontFamily: "'Courier New', monospace",
      }}
    >
      <Text
        style={{
          fontSize: "14px",
          color: "#c8c8e8",
          margin: "0",
          wordBreak: "break-all",
          letterSpacing: "0.3px",
        }}
      >
        {content}
      </Text>
    </Section>
  );
}

export const sharedStyles = styles;
