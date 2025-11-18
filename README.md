✍️ Questec - Plataforma de Correção de Redações com IA Gemini

💡 Sobre o Projeto
O Questec é uma plataforma inovadora projetada para auxiliar estudantes na preparação para o ENEM e outros vestibulares, oferecendo correções automáticas e detalhadas de redações utilizando a avançada inteligência artificial do Google Gemini.

O sistema foi desenvolvido para replicar a estrutura de avaliação das 5 competências do ENEM, fornecendo aos usuários uma pontuação (de 0 a 1000) e feedbacks específicos para cada área de avaliação.

✨ Funcionalidades Principais
Correção Inteligente: Utiliza a API Gemini 2.5 Flash para processar e corrigir redações.

Avaliação Detalhada: Retorna a pontuação final e feedback dividido pelas 5 competências do ENEM (Domínio da norma padrão, Compreensão do tema, Argumentação, Mecanismos linguísticos e Proposta de intervenção).

Interface Amigável: Front-end desenvolvido com Next.js para uma experiência de usuário fluida.

Arquitetura Serverless: O processamento da correção é gerenciado por uma função AWS Lambda, garantindo escalabilidade e baixo custo de operação.


🛠️ Tecnologias Utilizadas
O projeto Questec foi construído com as seguintes tecnologias:

Frontend: Next.js (com TypeScript e React)

Estilização: Tailwind CSS (para design rápido e responsivo)

Backend/API: AWS Lambda (Node.js)

Database: Prisma ORM com PostgreSQL (ou outro BD de sua escolha)

Inteligência Artificial: Google Gemini API (gemini-2.5-flash)

Versionamento: Git e GitHub

🚀 Como Executar o Projeto Localmente
Siga estes passos para configurar e executar o Questec em sua máquina.

1. Pré-requisitos
Certifique-se de ter instalado:

Node.js (v18+)

npm ou Yarn

Git

Conta no Google AI Studio e uma chave de API válida para o Gemini.

2. Clonagem do Repositório
Bash

git clone <URL do seu repositório>
cd questec

3. Instalação de Dependências
Bash

npm install 
# ou
yarn install

4. Configuração das Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto e adicione as suas chaves e credenciais:

# Variável principal para a API do Google Gemini
GEMINI_API_KEY="<SUA CHAVE DA API GEMINI AQUI>" 

# Configurações do Banco de Dados (exemplo Prisma/PostgreSQL)
DATABASE_URL="<URL DE CONEXÃO DO SEU BANCO DE DADOS>"

# Outras variáveis (se houver, como NEXTAUTH_SECRET, etc.)
# ...
Atenção: Se você estiver utilizando uma função AWS Lambda como backend para a correção, certifique-se de que a variável GEMINI_API_KEY esteja corretamente configurada no ambiente da sua função Lambda.

5. Execução Local
Para iniciar o servidor de desenvolvimento:

Bash

npm run dev
# ou
yarn dev
O aplicativo estará disponível em http://localhost:3000.

📄 Estrutura do Projeto
O projeto segue a estrutura padrão do Next.js e inclui uma função serverless para o processamento da IA:

questec/
├── .next/
├── node_modules/
├── prisma/               # Esquemas do banco de dados
├── public/
├── src/
│   ├── app/              # Rotas e Páginas do Next.js
│   │   ├── api/          # Rotas de API (ex: /api/admin, /api/auth)
│   │   │   ├── essays/   # Rota de submissão/busca de redações
│   │   │   └── payments/
│   │   └── dashboard/
│   ├── components/       # Componentes React
│   └── lib/              # Funções utilitárias
├── .env                  # Variáveis de ambiente
├── package.json
└── README.md

🤝 Contribuições
Contribuições são sempre bem-vindas! Se você tiver sugestões, bug reports ou quiser adicionar novas funcionalidades, sinta-se à vontade para abrir uma issue ou enviar um Pull Request.

⚖️ Licença
Este projeto está licenciado sob a Licença <br6nin>.