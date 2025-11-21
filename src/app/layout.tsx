import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; 
import { Toaster } from "@/components/ui/toaster";
// Importação do componente de barra de progresso
import NextTopLoader from "nextjs-toploader"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuesTec",
  description: "Plataforma de Correção de Redação com IA",
  keywords: ["Z.ai", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "AI development", "React"],
  authors: [{ name: "br6nin" }],
  icons: {
    icon: "https://noxxvyznjrozaxwldnpv.supabase.co/storage/v1/object/public/logo/questec_logo.svg",
  },
  openGraph: {
    title: "QuesTec",
    description: "AI-powered development with modern React stack",
    url: "https://chat.z.ai",
    siteName: "Z.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuesTec",
    description: "AI-powered development with modern React stack",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Alterei lang="en" para lang="pt-br" para maior consistência
    <html lang="pt-br" suppressHydrationWarning> 
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {/* Componente de Barra de Progresso Adicionado */}
        <NextTopLoader
          color="#2299DD" // Cor azul do Questec
          initialPosition={0.08}
          crawlSpeed={200}
          height={3} 
          showSpinner={false} 
          easing="ease"
          speed={500}
          shadow="0 0 10px #2299DD, 0 0 5px #2299DD"
        />

        {children}
        <Toaster />
      </body>
    </html>
  );
}