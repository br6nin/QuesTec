'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, PenTool, Brain, TrendingUp, Users, Star, ArrowRight, Mail, Phone, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [activeTab, setActiveTab] = useState('how')

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
      color: 'bg-green-50'
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
      color: 'bg-gray-50'
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
      color: 'bg-blue-50'
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
      color: 'bg-gray-50'
    }
  ]

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
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">QuesTec</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#how" className="text-gray-600 hover:text-gray-900 transition">Como Funciona</a>
              <a href="#plans" className="text-gray-600 hover:text-gray-900 transition">Planos</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition">Depoimentos</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition">Contato</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                  Entrar
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Cadastrar
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
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
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">IA Avançada</h3>
              <p className="text-gray-600">Correção baseada nos critérios oficiais do ENEM</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Resultados Rápidos</h3>
              <p className="text-gray-600">Feedback instantâneo e detalhado</p>
            </div>
            <div className="text-center">
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
            <Card className="text-center p-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PenTool className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Envie sua Redação</h3>
              <p className="text-gray-600">
                Digite o texto ou faça upload da sua redação. Selecione o tema e envie para correção.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. IA Analisa</h3>
              <p className="text-gray-600">
                Nossa inteligência artificial analisa sua redação conforme os critérios do ENEM.
              </p>
            </Card>

            <Card className="text-center p-6">
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
                  
                  {/* INÍCIO DA ALTERAÇÃO: Adicionando o Link ao redor do Button */}
                  <Link 
                    href={plan.name === 'Grátis' 
                      ? '/register?plan=gratis' // Plano Grátis leva para o Cadastro/Login
                      : `/plans` // Planos pagos levam para o Checkout, passando o nome do plano na URL
                    }
                    className="block" // O Link precisa ser block para ocupar a largura total
                  >
                    <Button 
                      className={`w-full py-2 text-sm ${plan.name === 'Grátis' ? 'bg-green-600 hover:bg-green-700' : plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
                    >
                      {plan.name === 'Grátis' ? 'Começar Grátis' : 'Escolher Plano'}
                    </Button>
                  </Link>
                  {/* FIM DA ALTERAÇÃO */}
                  
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
              <Card key={index} className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.course}</p>
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
            <Card className="text-center p-6">
              <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">bruno.almeidaferrer@gmail.com</p>
            </Card>

            <Card className="text-center p-6">
              <Phone className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">WhatsApp</h3>
              <p className="text-gray-600">(85) 9 8180-9105</p>
            </Card>

            <Card className="text-center p-6">
              <MessageCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Suporte</h3>
              <p className="text-gray-600">Chat online 24/7</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <PenTool className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">QuesTec</span>
              </div>
              <p className="text-gray-400">
                Correção de redações ENEM com inteligência artificial
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Como Funciona</a></li>
                <li><a href="#" className="hover:text-white transition">Planos</a></li>
                <li><a href="#" className="hover:text-white transition">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition">Contato</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition">LGPD</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 QuesTec. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}