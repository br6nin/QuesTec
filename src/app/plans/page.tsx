'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, PenTool, ArrowLeft, CreditCard, QrCode, Copy, Check } from 'lucide-react'

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
    paymentRequired: false
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
    creditsToAdd: 5
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
    creditsToAdd: 15
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
    creditsToAdd: 30
  }
]

export default function PlansPage() {
  const [user, setUser] = useState<any>(null)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [copied, setCopied] = useState(false)
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
      setUser(parsedUser)
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/login')
    }
  }, [router])

  const handleSelectPlan = (plan: any) => {
    if (!plan.paymentRequired) {
      // Plano gratuito - apenas redireciona para o dashboard
      router.push('/dashboard')
      return
    }
    
    setSelectedPlan(plan)
    setShowPayment(true)
  }

  const handlePayment = async () => {
    if (!selectedPlan || !user) return

    setIsProcessing(true)
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          amount: parseFloat(selectedPlan.price.replace('R$ ', '').replace(',', '.')),
          credits: selectedPlan.creditsToAdd,
          paymentMethod: 'pix',
          planName: selectedPlan.name
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setPaymentData(data.payment)
      } else {
        console.error('Error creating payment:', data.error)
      }
    } catch (error) {
      console.error('Error creating payment:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const checkPaymentStatus = async () => {
    if (!paymentData) return

    try {
      const response = await fetch(`/api/payments/${paymentData.id}/status`)
      const data = await response.json()

      if (data.payment.status === 'approved') {
        // Atualizar dados do usuário
        const updatedUser = {
          ...user,
          credits: user.credits + paymentData.credits,
          plan: paymentData.planName.toLowerCase()
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setUser(updatedUser)
        
        // Redirecionar para dashboard
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error checking payment status:', error)
    }
  }

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

  if (showPayment && selectedPlan) {
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
              
              <Button variant="outline" onClick={() => setShowPayment(false)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar aos Planos
              </Button>
            </div>
          </div>
        </header>

        {/* Payment Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Finalizar Pagamento</CardTitle>
                <CardDescription>
                  Complete sua compra usando Pix para acesso imediato
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Order Summary */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Resumo do Pedido</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Plano {selectedPlan.name}</span>
                      <span className="font-semibold">{selectedPlan.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Créditos adicionais</span>
                      <span>{selectedPlan.creditsToAdd} correções</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{selectedPlan.price}</span>
                    </div>
                  </div>
                </div>

                {!paymentData ? (
                  <div className="text-center">
                    <Button 
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full bg-blue-600 hover:bg-blue-700 mb-4"
                    >
                      {isProcessing ? 'Gerando QR Code...' : 'Gerar QR Code Pix'}
                    </Button>
                    <p className="text-sm text-gray-600">
                      Ao clicar, geraremos um QR Code para pagamento via Pix
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* QR Code */}
                    <div className="text-center">
                      <div className="w-64 h-64 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <QrCode className="w-32 h-32 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Escaneie o QR Code acima com seu aplicativo bancário
                      </p>
                    </div>

                    {/* Pix Key */}
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-900 mb-2">Chave Pix</h4>
                      <div className="flex items-center justify-center space-x-2">
                        <code className="bg-gray-100 px-4 py-2 rounded text-sm">
                          bruno.almeidaferrer@gmail.com
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard('bruno.almeidaferrer@gmail.com')}
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {copied ? 'Chave copiada!' : 'Clique para copiar a chave Pix'}
                      </p>
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Como pagar:</h4>
                      <ol className="text-sm text-blue-800 space-y-1">
                        <li>1. Abra o aplicativo do seu banco</li>
                        <li>2. Escolha a opção Pix</li>
                        <li>3. Escaneie o QR Code ou cole a chave</li>
                        <li>4. Confirme o pagamento de {selectedPlan.price}</li>
                        <li>5. Aguarde a confirmação (até 5 minutos)</li>
                      </ol>
                    </div>

                    {/* Check Status Button */}
                    <Button 
                      onClick={checkPaymentStatus}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Verificar Status do Pagamento
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Após a confirmação, seus créditos serão adicionados automaticamente
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
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
                Plano atual: <span className="font-semibold text-blue-600 capitalize">{user.plan}</span>
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
            <Card key={index} className={`relative ${plan.color} ${plan.popular ? 'ring-2 ring-blue-600' : ''}`}>
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
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-2 text-sm ${
                    plan.name === 'Grátis' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-600 hover:bg-gray-700'
                  } text-white`}
                >
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