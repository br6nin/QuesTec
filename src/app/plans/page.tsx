'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, PenTool, ArrowLeft, Loader2 } from 'lucide-react'

// ATENÇÃO: Os priceId abaixo são IDs DE TESTE/EXEMPLO do Stripe.
// Você DEVE substituí-los pelos IDs reais dos seus planos recorrentes no Stripe Dashboard.
const plans = [
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
    color: 'bg-green-50',
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
    color: 'bg-gray-50',
    paymentRequired: true,
    creditsToAdd: 5,
    priceId: 'price_1SVyEp7y7k1z73nwQrreXq4y', // <-- SUBSTITUA ESTE ID
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
    color: 'bg-blue-50',
    paymentRequired: true,
    creditsToAdd: 15,
    priceId: 'price_1SVyFZ7y7k1z73nwWRLqyz3Q', // <-- SUBSTITUA ESTE ID
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
    color: 'bg-gray-50',
    paymentRequired: true,
    creditsToAdd: 30,
    priceId: 'price_1SVyFz7y7k1z73nwT56tbTH6', // <-- SUBSTITUA ESTE ID
  }
]

export default function PlansPage() {
  const [user, setUser] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

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
      console.error('Error parsing user data:', error)
      router.push('/login')
    }
  }, [router])


  // Função para iniciar o processo de checkout via Stripe
  const handleCheckout = async (plan: typeof plans[0]) => {
    if (!user || !plan.priceId) {
      // Permite o fluxo gratuito, mas bloqueia pagamento sem Price ID
      if (!plan.paymentRequired) {
        router.push('/dashboard');
        return;
      }
      console.error('Usuário não autenticado ou Price ID ausente no plano pago.');
      alert('Erro: Plano mal configurado. Tente novamente ou entre em contato com o suporte.');
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
        // Usando alert como fallback para simular modal/toast
        alert('Ocorreu um erro ao processar o pagamento. Por favor, tente novamente mais tarde.')
      }
    } catch (error) {
      console.error('Erro ao iniciar o checkout:', error)
      // Usando alert como fallback para simular modal/toast
      alert('Ocorreu um erro de conexão. Verifique o console.')
    } finally {
      setIsProcessing(false)
    }
  }

  // ------------------------------------------
  // O JSX de 'showPayment' para Pix manual foi removido
  // ------------------------------------------

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">QuesTec</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Plano atual: <span className="font-semibold text-blue-600 capitalize">{user.plan || 'Grátis'}</span>
              </div>
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Planos e Preços</h1>
          <p className="text-xl text-gray-600">Escolha o plano ideal para seu estudo</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              // Desabilita visualmente durante o processamento
              className={`relative ${plan.color} ${plan.popular ? 'ring-2 ring-blue-600' : ''} ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Mais Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold text-gray-900">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-blue-600 mb-2">{plan.price}</div>
                <CardDescription className="text-sm text-gray-600">{plan.credits}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => handleCheckout(plan)}
                  disabled={isProcessing} // Desabilita todos os botões durante o processamento
                  className={`w-full py-2 text-sm ${
                    plan.name === 'Grátis' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-600 hover:bg-gray-700'
                  } text-white`}
                >
                  {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {plan.name === 'Grátis' ? 'Continuar Gratuito' : 'Assinar Agora'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <Card className="mt-12 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Comparação de Recursos</CardTitle>
            <CardDescription>
              Veja as diferenças entre cada plano
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Recurso</th>
                    <th className="text-center py-2">Grátis</th>
                    <th className="text-center py-2">Básico</th>
                    <th className="text-center py-2">Plus</th>
                    <th className="text-center py-2">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Correções por mês</td>
                    <td className="text-center py-2">12</td>
                    <td className="text-center py-2">5</td>
                    <td className="text-center py-2">15</td>
                    <td className="text-center py-2">30</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Feedback por competência</td>
                    <td className="text-center py-2">✓</td>
                    <td className="text-center py-2">✓</td>
                    <td className="text-center py-2">✓</td>
                    <td className="text-center py-2">✓</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Feedback detalhado</td>
                    <td className="text-center py-2">Básico</td>
                    <td className="text-center py-2">✓</td>
                    <td className="text-center py-2">✓</td>
                    <td className="text-center py-2">✓</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Suporte prioritário</td>
                    <td className="text-center py-2">✗</td>
                    <td className="text-center py-2">✗</td>
                    <td className="text-center py-2">✓</td>
                    <td className="text-center py-2">✓</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Dicas de melhoria</td>
                    <td className="text-center py-2">✗</td>
                    <td className="text-center py-2">✗</td>
                    <td className="text-center py-2">✓</td>
                    <td className="text-center py-2">✓</td>
                  </tr>
                  <tr>
                    <td className="py-2">Redações modelo</td>
                    <td className="text-center py-2">✗</td>
                    <td className="text-center py-2">✗</td>
                    <td className="text-center py-2">✗</td>
                    <td className="text-center py-2">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}