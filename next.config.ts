import type { NextConfig } from "next";

// Define a variável de ambiente para pular o download da CLI do Supabase
// Isso é necessário porque o script postinstall do Supabase pode falhar no ambiente
// de build do Vercel, e a CLI não é necessária para o runtime do Next.js.
if (process.env.VERCEL_ENV === 'production' && process.env.SUPABASE_SKIP_CLI_DOWNLOAD !== 'true') {
    // Define a variável de ambiente para pular a CLI.
    // Esta linha deve ser executada antes de o Next.js ler as dependências.
    process.env.SUPABASE_SKIP_CLI_DOWNLOAD = 'true';
}

const nextConfig: NextConfig = {
  // Configuração para saída otimizada (como Docker)
  output: "standalone",
  
  // Configurações do TypeScript
  typescript: {
    // Ignora erros de build do TypeScript (não recomendado para produção, mas útil para builds rápidos)
    ignoreBuildErrors: true,
  },
  
  // Desabilita o Hot Reload do Next.js (se você estiver usando uma ferramenta externa como nodemon)
  reactStrictMode: false,
  
  // Configurações do Webpack
  webpack: (config, { dev }) => {
    if (dev) {
      // Desabilita a troca a quente de módulos do webpack
      config.watchOptions = {
        ignored: ["**/*"], // Ignora todas as mudanças de arquivo
      };
    }
    return config;
  },
  
  // Configurações do ESLint
  eslint: {
    // Ignora erros do ESLint durante o build
    ignoreDuringBuilds: true,
  },
  
  // Define o diretório de origem do projeto
  srcDir: 'src/',
};

export default nextConfig;