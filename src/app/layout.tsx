import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/providers/ThemeProvider";
import { AppShell } from "../components/layout/AppShell";

export const metadata: Metadata = {
  title: "SevenX Labs — Freelance Tech Studio Toolkit",
  description:
    "Professional Invoices, Agreements & NDAs generator built for modern freelancers and studios.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="bg-neutral-950 text-neutral-100 selection:bg-purple-500/30 selection:text-purple-200">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
