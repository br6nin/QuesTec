'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// Importa todos os ícones necessários
import { CheckCircle, PenTool, Brain, TrendingUp, Users, Star, ArrowRight, Mail, Phone, MessageCircle, Menu, X, Zap, Loader2 } from 'lucide-react' 
import Link from 'next/link'
import { useRouter } from 'next/navigation' 

export default function Home() {
  const [activeTab, setActiveTab] = useState('how')
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null); // Rastreia qual plano está carregando
  const router = useRouter(); 

  const navItems = [
    { name: 'Como Funciona', href: '#how' },
    { name: 'Planos', href: '#plans' },
    { name: 'Depoimentos', href: '#testimonials' },
    { name: 'Contato', href: '#contact' },
  ];

  // MUITO IMPORTANTE: Substitua 'price_...' pelos IDs de preço reais do seu Stripe
  // Se estes IDs estiverem incorretos, o checkout irá falhar.
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
      stripePriceId: 'price_free',
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
      stripePriceId: 'price_1SVyEp7y7k1z73nwQrreXq4y', // <-- SUBSTITUIR
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
      stripePriceId: 'price_1SVyFZ7y7k1z73nwWRLqyz3Q', // <-- SUBSTITUIR
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
      stripePriceId: 'price_1SVyFz7y7k1z73nwT56tbTH6', // <-- SUBSTITUIR
    }
  ];

  const testimonials = [
    {
      name: 'Ana Silva',
      course: 'Cursinho Popular',
      text: 'A QuesTec me ajudou a melhorar minha nota de 640 para 820 em apenas 2 meses!',
      rating: 5
    },
    {
      name: 'Carlos Mendes',
      course: '3º Ano Ensino Médio',
      text: 'O feedback detalhado por competência fez toda a diferença no meu estudo.',
      rating: 5
    },
    {
      name: 'Maria Oliveira',
      course: 'Pré-vestibular',
      text: 'Correção rápida e precisa. Consigo corrigir várias redações por semana.',
      rating: 5
    }
  ];

  const Logo = () => (
    <Link href="/" className="flex items-center space-x-2">
      <Zap className="w-7 h-7 text-blue-600 fill-blue-600" />
      <span className="text-xl font-bold text-gray-900">QuesTec</span>
    </Link>
  );

  /**
   * Função para iniciar o checkout no Stripe
   * Ela chama o endpoint API /api/checkout com o Price ID e redireciona.
   * @param priceId O Price ID do plano no Stripe
   * @param planName O nome do plano para rastreamento (e estado de loading)
   */
  const handleCheckout = async (priceId: string, planName: string) => {
    // Evita cliques múltiplos
    if (loadingPlan !== null) return; 

    setLoadingPlan(planName);
    
    // ATENÇÃO: Em produção, você DEVE enviar o ID do usuário autenticado para a API
    // para que a sessão do Stripe seja associada ao cliente correto.
    // Exemplo: body: JSON.stringify({ priceId, userId: meuIdDeUsuario }),
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            priceId, 
            // Mock de ID de usuário para demonstração. REMOVA em produção.
            // O backend deve lidar com a autenticação de forma segura.
            // userId: 'mock-user-12345'
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao iniciar o checkout do Stripe. Status: ' + response.status);
      }

      const { url } = await response.json();

      if (url) {
        // Redireciona o usuário para a página de Checkout do Stripe
        router.push(url);
      } else {
        alert('Erro: O Stripe não retornou a URL de checkout. Verifique a API.');
      }
    } catch (error) {
      console.error('Erro no checkout:', error);
      alert('Ocorreu um erro ao processar o pagamento. Verifique o console e os Price IDs.');
    } finally {
      // O finally não será chamado se o router.push for bem-sucedido e mudar de página, 
      // mas é útil para falhas ou se o router.push for síncrono.
      setLoadingPlan(null); 
    }
  };


  return (
    <div className="min-h-screen bg-white">
      {/* Navbar - (MANTIDO DO PASSO ANTERIOR) */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <a 
                  key={item.name} 
                  href={item.href} 
                  className="text-gray-600 hover:text-blue-600 font-medium transition duration-150 ease-in-out"
                >
                  {item.name}
                </a>
              ))}
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-blue-600 hover:bg-blue-50">Entrar</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Cadastre-se</Button>
              </Link>
            </div>
            <div className="flex md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Abrir menu principal</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition duration-150 ease-in-out"
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link href="/login" className="block">
                  <Button variant="ghost" className="w-full justify-start text-blue-600 hover:bg-blue-50">
                    Entrar
                  </Button>
                </Link>
                <Link href="/register" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Cadastre-se
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
              Correção de Redações
              <span className="text-red-600"> ENEM</span> com IA
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Plataforma online que fornece correção instantânea, detalhada e padronizada de redações do ENEM, 
              simulando os critérios de avaliação oficiais. Comece grátis com 3 correções semanais!
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg shadow-lg">
                Começar Grátis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#plans">
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
                Ver Planos
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto pt-10">
            <div className="text-center p-4 rounded-xl transition duration-300 hover:shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">IA Avançada</h3>
              <p className="text-gray-600">Correção baseada nos critérios oficiais do ENEM</p>
            </div>
            <div className="text-center p-4 rounded-xl transition duration-300 hover:shadow-lg">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Resultados Rápidos</h3>
              <p className="text-gray-600">Feedback instantâneo e detalhado</p>
            </div>
            <div className="text-center p-4 rounded-xl transition duration-300 hover:shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Precisão Garantida</h3>
              <p className="text-gray-600">Análise por competência (C1 a C5)</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Como Funciona</h2>
            <p className="text-xl text-gray-600">Três passos simples para melhorar sua redação</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center p-6 shadow-md hover:shadow-xl transition duration-300 border-t-4 border-blue-500">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PenTool className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Envie sua Redação</h3>
              <p className="text-gray-600">
                Digite o texto ou faça upload da sua redação. Selecione o tema e envie para correção.
              </p>
            </Card>

            <Card className="text-center p-6 shadow-md hover:shadow-xl transition duration-300 border-t-4 border-red-500">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. IA Analisa</h3>
              <p className="text-gray-600">
                Nossa inteligência artificial analisa sua redação conforme os critérios do ENEM.
              </p>
            </Card>

            <Card className="text-center p-6 shadow-md hover:shadow-xl transition duration-300 border-t-4 border-green-500">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Receba Feedback</h3>
              <p className="text-gray-600">
                Obtenha nota detalhada por competência e sugestões personalizadas de melhoria.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Planos e Preços</h2>
            <p className="text-xl text-gray-600">Comece grátis ou escolha o plano ideal para seu estudo</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.color} ${plan.popular ? 'ring-2 ring-blue-600 shadow-2xl' : 'shadow-md'} transition duration-300 hover:shadow-xl`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                      Mais Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900">{plan.name}</CardTitle>
                  <div className="text-4xl font-extrabold text-blue-600 mb-2">{plan.price}</div>
                  <CardDescription className="text-sm text-gray-600">{plan.credits}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* LÓGICA DE BOTÃO PARA CHECKOUT INTEGRADA AO STRIPE */}
                  <div className="pt-4">
                    {plan.name === 'Grátis' ? (
                      <Link 
                        href="/register?plan=gratis"
                        className="block" 
                      >
                        <Button 
                          className="w-full py-2 text-base font-semibold bg-green-600 hover:bg-green-700 text-white transition duration-300"
                        >
                          Começar Grátis
                        </Button>
                      </Link>
                    ) : (
                      // O botão chama a função handleCheckout para iniciar o processo Stripe
                      <Button 
                        onClick={() => handleCheckout(plan.stripePriceId, plan.name)}
                        disabled={loadingPlan !== null} // Desabilita se já estiver carregando
                        className={`w-full py-2 text-base font-semibold transition duration-300 ${
                          plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-800'
                        } text-white`}
                      >
                        {loadingPlan === plan.name ? (
                          // Mostra um spinner durante o carregamento
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          'Escolher Plano'
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">O que nossos alunos dizem</h2>
            <p className="text-xl text-gray-600">Depoimentos reais de quem já melhorou com a QuesTec</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 shadow-lg border-t-4 border-yellow-400">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic text-lg">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold text-gray-900 text-base">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.course}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Entre em Contato</h2>
            <p className="text-xl text-gray-600">Estamos aqui para ajudar você a alcançar seus objetivos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center p-6 shadow-lg border-t-4 border-blue-600">
              <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 font-medium">suportequestec@gmail.com</p>
            </Card>

            <Card className="text-center p-6 shadow-lg border-t-4 border-green-600">
              <Phone className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">WhatsApp</h3>
              <p className="text-gray-600 font-medium">(85) 9 8180-9105</p>
            </Card>

            <Card className="text-center p-6 shadow-lg border-t-4 border-red-600">
              <MessageCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Suporte</h3>
              <p className="text-gray-600 font-medium">Chat online 24/7</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* COLUNA 1: LOGO e DESCRIÇÃO */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Logo />
              </div>
              <p className="text-gray-400">
                Correção de redações ENEM com inteligência artificial
              </p>
            </div>

            {/* COLUNA 2: PRODUTO */}
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#how" className="hover:text-white transition">Como Funciona</a></li>
                <li><a href="#plans" className="hover:text-white transition">Planos</a></li>
                <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
              </ul>
            </div>
            
            {/* COLUNA 3: SUPORTE */}
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#contact" className="hover:text-white transition">Central de Ajuda</a></li>
                <li><a href="#contact" className="hover:text-white transition">Contato</a></li>
                <li><a href="#how" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>

            {/* COLUNA 4: LEGAL */}
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition">LGPD</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2024 QuesTec. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}