/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://questec.com.br', // <-- Mude para seu domínio
  generateRobotsTxt: true, // (Opcional) Cria também o robots.txt
  sitemapSize: 7000, // Limite de URLs por arquivo sitemap (se tiver muitas páginas)
  // Adicione outras configurações aqui se precisar excluir rotas, etc.
}