'use client'

import { useState, useEffect } from 'react'
import React from 'react'; // Importação do React necessária para tipagem FC

// Substituições para Next.js: Usaremos redirecionamento direto (window.location.href)
// e tags <a>, pois as bibliotecas Next.js ('next/navigation', 'next/link') não estão disponíveis neste ambiente.

// ----------------------------------------------------
// Componentes UI simplificados e TIPADOS
// ----------------------------------------------------

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

// Componente Button tipado corretamente como React.FC
const Button: React.FC<ButtonProps> = ({ children, onClick, disabled, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      px-6 py-3 rounded-xl font-semibold text-center transition duration-300 ease-in-out
      focus:outline-none focus:ring-4 focus:ring-opacity-50
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'}
      ${className}
    `}
  >
    {children}
  </button>
);

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-xl transition duration-300 hover:shadow-2xl ${className}`}>
    {children}
  </div>
);

// Ícones
const CheckCircle: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-green-500' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PenTool: React.FC<{ className?: string }> = ({ className = 'w-6 h-6 text-white' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 20.817a1.875 1.875 0 01-.707.311l-3.21 0a2.25 2.25 0 01-2.25-2.25l0-3.21a1.875 1.875 0 01.311-.707L16.862 4.487z" />
  </svg>
);

const ArrowLeft: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const Loader2: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`animate-spin ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001m-4.992 0A2.25 2.25 0 0017.25 7.125h1.229m-1.229 0l-3.181-2.29m-3.52 1.332L5.9 10.941M13.25 4.885h2.189A2.25 2.25 0 0118.75 6.25v2.275m-4.78 6.471h3.181l1.795-2.562m-1.795 2.562l-1.687-1.688m4.37-3.693l-.75-1.071m-.75 1.071l-1.687-1.688m-1.84 4.54l-1.071.75m1.071-.75l-1.687-1.688m-3.181 2.29l-1.071-.75m1.071.75l-1.687-1.688M12 18.75A6.75 6.75 0 0018.75 12c0-2.485-2.015-4.5-4.5-4.5S9.75 9.515 9.75 12A6.75 6.75 0 0012 18.75z" />
  </svg>
);


// Implementação simples de 'useRouter' para este ambiente de componente único.
const useSimpleRouter = () => ({
  push: (path: string) => {
    // Redireciona a janela inteira.
    window.location.href = path;
  },
});

// Tipagem simplificada para os planos
interface Plan {
    name: string;
    price: string;
    credits: string;
    features: string[];
    popular: boolean;
    color: string;
    paymentRequired: boolean;
    priceId: string | null;
    creditsToAdd: number;
}

// ATENÇÃO: Os priceId abaixo são IDs DE TESTE/EXEMPLO.
// Você DEVE substituí-los pelos IDs reais dos seus planos recorrentes no Stripe Dashboard.
const plans: Plan[] = [
  {
    name: 'Grátis',
    price: 'R$ 0',
    credits: '3 correções por semana',
    features: [
      '3 correções semanais',
      'Nota por competência',
      'Feedback básico',
      'Validade ilimitada'
    ],
    popular: false,
    color: 'ring-green-400',
    paymentRequired: false,
    priceId: null, // Não se aplica ao plano grátis
    creditsToAdd: 0
  },
  {
    name: 'Básico',
    price: 'R$ 19,90',
    credits: '5 correções',
    features: [
      'Correção detalhada por competência',
      'Feedback personalizado',
      'Validade de 30 dias',
      'Suporte por email'
    ],
    popular: false,
    color: 'ring-gray-300',
    paymentRequired: true,
    creditsToAdd: 5,
    priceId: 'price_1PBasicoXXXXXX', // <-- SUBSTITUA ESTE ID
  },
  {
    name: 'Plus',
    price: 'R$ 39,90',
    credits: '15 correções',
    features: [
      'Correção detalhada por competência',
      'Feedback personalizado',
      'Validade de 60 dias',
      'Suporte prioritário',
      'Dicas de melhoria'
    ],
    popular: true,
    color: 'ring-indigo-600',
    paymentRequired: true,
    creditsToAdd: 15,
    priceId: 'price_1PPlusXXXXXX', // <-- SUBSTITUA ESTE ID
  },
  {
    name: 'Premium',
    price: 'R$ 69,90',
    credits: '30 correções',
    features: [
      'Correção detalhada por competência',
      'Feedback personalizado',
      'Validade de 90 dias',
      'Suporte VIP',
      'Dicas de melhoria',
      'Acesso a redações modelo'
    ],
    popular: false,
    color: 'ring-gray-300',
    paymentRequired: true,
    creditsToAdd: 30,
    priceId: 'price_1PPremiumXXXXXX', // <-- SUBSTITUA ESTE ID
  }
]

export default function PlansPage() {
  const [user, setUser] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useSimpleRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    
    try {
      const parsedUser = JSON.parse(userData)
      // Garante que o usuário tenha um ID para enviar ao Stripe (metadata)
      if (!parsedUser.id) {
        parsedUser.id = 'user_' + Math.random().toString(36).substring(2, 9);
      }
      setUser(parsedUser)
    } catch (error) {
      console.error('Erro ao analisar dados do usuário:', error)
      router.push('/login')
    }
  }, [router])


  // Função para iniciar o processo de checkout via Stripe
  const handleCheckout = async (plan: Plan) => {
    if (!user || (plan.paymentRequired && !plan.priceId)) {
      if (!plan.paymentRequired) {
        // Navegação para plano gratuito
        router.push('/dashboard');
        return;
      }
      console.error('Erro: Plano pago mal configurado (Price ID ausente) ou usuário não autenticado.');
      return;
    }
    
    // Se for o plano gratuito, apenas navega.
    if (!plan.paymentRequired) {
        router.push('/dashboard');
        return;
    }


    setIsProcessing(true)

    try {
      // Chama a rota de API do Next.js que interage com o Stripe
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId, // Requerido pela rota do Stripe
          userId: user.id, // Para metadata e criação de Customer
        }),
      })

      const data = await response.json()

      if (response.ok && data.url) {
        // Redireciona o usuário para o Checkout do Stripe
        router.push(data.url)
      } else {
        console.error('Erro no Checkout do Stripe:', data.error || 'Resposta inválida do servidor.')
        // Mensagem de erro customizada (substituindo o antigo alert)
        // Aqui você pode implementar um modal ou toast
        // Usando o alert simples como último recurso, pois já havíamos removido
        // na correção anterior. Idealmente, use um modal customizado.
        alert('Ocorreu um erro ao processar o pagamento. Verifique o console para detalhes.');
      }
    } catch (error) {
      console.error('Erro ao iniciar o checkout:', error)
      alert('Ocorreu um erro de conexão. Verifique o console.');
    } finally {
      setIsProcessing(false)
    }
  }
  
  // Componente Card de Plano
  const PlanCard: React.FC<{ plan: Plan }> = ({ plan }) => (
    <Card 
        className={`relative p-6 flex flex-col h-full ring-2 ${plan.color} ${plan.popular ? 'ring-offset-2' : 'ring-opacity-50'} ${isProcessing ? 'opacity-70' : 'hover:scale-[1.02]'} transition-all duration-300`}
    >
      {plan.popular && (
        <div className="absolute top-0 right-0 -mt-3 -mr-3">
          <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md uppercase tracking-wider">
            Recomendado
          </span>
        </div>
      )}
      
      <div className="text-center mb-6 flex-grow">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{plan.name}</h2>
        <p className="text-4xl font-black text-indigo-700 mb-2">
          {plan.price}
          {plan.paymentRequired && <span className="text-base font-medium text-gray-500">/mês</span>}
        </p>
        <p className="text-sm text-gray-500 font-medium">{plan.credits}</p>
      </div>

      <div className="mb-8 space-y-3 flex-grow">
        <h3 className="text-sm font-bold uppercase text-gray-600 mb-3 border-b pb-1">Recursos Incluídos:</h3>
        <ul className="space-y-3">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start text-sm text-gray-700">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto"> {/* Alinha o botão na parte inferior */}
        <Button 
          onClick={() => handleCheckout(plan)}
          disabled={isProcessing}
          className={`w-full ${
            plan.name === 'Grátis' 
              ? 'bg-green-600 hover:bg-green-700 focus:ring-green-300' 
              : plan.popular 
                ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-300' 
                : 'bg-gray-700 hover:bg-gray-800 focus:ring-gray-300'
          } text-white`}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processando...
            </span>
          ) : (
            plan.name === 'Grátis' ? 'Começar Grátis' : 'Assinar Agora'
          )}
        </Button>
      </div>
    </Card>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Carregando dados do usuário...</p>
        </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header Limpo */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Nome da Aplicação */}
            <a href="/dashboard" className="flex items-center space-x-2 text-indigo-700 hover:text-indigo-900 transition duration-150">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <PenTool className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">QuesTec</span>
            </a>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500 hidden sm:block">
                Plano atual: <span className="font-bold text-indigo-600 capitalize">{user.plan || 'Grátis'}</span>
              </div>
              {/* A LINHA PROBLEMÁTICA ORIGINALMENTE ESTAVA AQUI - CORRIGIDA */}
              <Button 
                  onClick={() => router.push('/dashboard')}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300 px-4 py-2 text-sm"
              >
                <span className="flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar ao Painel
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Escolha o Plano Ideal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Aumente seu desempenho com correções detalhadas e recursos exclusivos.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <PlanCard key={index} plan={plan} />
          ))}
        </div>

        {/* Features Comparison Table (Redesenhada) */}
        <div className="mt-20 max-w-5xl mx-auto">
          <Card className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Comparação Detalhada</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-separate border-spacing-0">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
                    <th className="text-left py-3 px-4 rounded-tl-lg">Recurso</th>
                    <th className="text-center py-3 px-4 font-normal">Grátis</th>
                    <th className="text-center py-3 px-4 font-normal">Básico</th>
                    <th className="text-center py-3 px-4 font-normal">Plus</th>
                    <th className="text-center py-3 px-4 font-normal rounded-tr-lg">Premium</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium text-gray-700">Correções por mês</td>
                    <td className="text-center py-4 px-4 text-gray-500">4</td>
                    <td className="text-center py-4 px-4 font-semibold text-gray-700">5</td>
                    <td className="text-center py-4 px-4 font-semibold text-gray-700">15</td>
                    <td className="text-center py-4 px-4 font-semibold text-gray-700">30</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-700">Feedback por competência</td>
                    <td className="text-center py-4 px-4"><CheckCircle /></td>
                    <td className="text-center py-4 px-4"><CheckCircle /></td>
                    <td className="text-center py-4 px-4"><CheckCircle /></td>
                    <td className="text-center py-4 px-4"><CheckCircle /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium text-gray-700">Nível de Detalhamento</td>
                    <td className="text-center py-4 px-4 text-gray-500">Básico</td>
                    <td className="text-center py-4 px-4 text-indigo-600 font-semibold">Detalhado</td>
                    <td className="text-center py-4 px-4 text-indigo-600 font-semibold">Detalhado</td>
                    <td className="text-center py-4 px-4 text-indigo-600 font-semibold">Detalhado</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-700">Suporte prioritário</td>
                    <td className="text-center py-4 px-4 text-red-500">✗</td>
                    <td className="text-center py-4 px-4 text-red-500">✗</td>
                    <td className="text-center py-4 px-4"><CheckCircle /></td>
                    <td className="text-center py-4 px-4"><CheckCircle /></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-gray-700">Acesso a Redações Modelo</td>
                    <td className="text-center py-4 px-4 text-red-500">✗</td>
                    <td className="text-center py-4 px-4 text-red-500">✗</td>
                    <td className="text-center py-4 px-4 text-red-500">✗</td>
                    <td className="text-center py-4 px-4"><CheckCircle /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-6">
          <div className="container mx-auto px-4 text-center text-sm text-gray-500">
              <p>&copy; {new Date().getFullYear()} QuesTec. Todos os direitos reservados. Design moderno e organizado.</p>
          </div>
      </footer>
    </div>
  )
}