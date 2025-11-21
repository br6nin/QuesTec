// src/app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; 
import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader"; 

// 🛑 NOVA IMPORTAÇÃO: Componente de Cabeçalho
import Header from "@/components/ui/header"; 

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
  
  // 🛑 ÍCONE (Favicon) - AGORA USANDO O PNG
  icons: {
    icon: "https://noxxvyznjrozaxwldnpv.supabase.co/storage/v1/object/public/logo/brand.png",
  },
  
  openGraph: {
    title: "QuesTec",
    description: "AI-powered development with modern React stack",
    url: "https://questec.com.br",
    siteName: "QuesTec",
    type: "website",
    
    // 🛑 IMAGEM OPEN GRAPH
    images: [
      {
        url: 'https://noxxvyznjrozaxwldnpv.supabase.co/storage/v1/object/public/logo/questec_logo.png',
        width: 1200, 
        height: 630,
        alt: 'QuesTec Logo e Correção ENEM com IA',
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "QuesTec",
    description: "AI-powered development with modern React stack",
    // 🛑 IMAGEM TWITTER
    images: ['https://noxxvyznjrozaxwldnpv.supabase.co/storage/v1/object/public/logo/questec_logo.png'], 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning> 
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {/* Componente de Barra de Progresso */}
        <NextTopLoader
          color="#2299DD" 
          initialPosition={0.08}
          crawlSpeed={200}
          height={3} 
          showSpinner={false} 
          easing="ease"
          speed={500}
          shadow="0 0 10px #2299DD, 0 0 5px #2299DD"
        />

        {/* 🛑 COMPONENTE DE CABEÇALHO GLOBAL */}
        <Header /> 

        {children}
        <Toaster />
      </body>
    </html>
  );
}