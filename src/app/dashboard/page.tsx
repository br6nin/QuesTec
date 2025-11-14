'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PenTool, LogOut, User, CreditCard, TrendingUp, FileText, Plus } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [essays, setEssays] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
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
      fetchEssays(parsedUser.id)
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchEssays = async (userId: string) => {
    try {
      const response = await fetch(`/api/essays?userId=${userId}`)
      const data = await response.json()

      if (response.ok) {
        setEssays(data.essays || [])
      } else {
        console.error('Error fetching essays:', data.error)
      }
    } catch (error) {
      console.error('Error fetching essays:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">QuesTec</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">{user.name || user.email}</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo, {user.name || 'Estudante'}!
          </h1>
          <p className="text-gray-600">
            Aqui está o seu painel de controle para corrigir suas redações do ENEM.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Créditos Disponíveis</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.credits || 0}</div>
              <p className="text-xs text-muted-foreground">
                {user.plan === 'free' ? '3 correções semanais' : 'Correções disponíveis'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plano Atual</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{user.plan || 'Free'}</div>
              <p className="text-xs text-muted-foreground">
                {user.plan === 'free' ? 'Plano gratuito' : 'Plano premium'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Redações Corrigidas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{essays.length}</div>
              <p className="text-xs text-muted-foreground">
                Total de redações enviadas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Nova Redação
              </CardTitle>
              <CardDescription>
                Envie sua redação para correção instantânea
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Comece a melhorar sua nota no ENEM com correções detalhadas por competência.
              </p>
              <Link href="/submit">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Enviar Nova Redação
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Redações</CardTitle>
              <CardDescription>
                Visualize suas redações anteriores e o feedback recebido
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Acompanhe sua evolução e veja as sugestões de melhoria.
              </p>
              <Link href="#history">
                <Button variant="outline" className="w-full">
                  Ver Histórico
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Essay History */}
        <div id="history" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Histórico de Redações
              </CardTitle>
              <CardDescription>
                Suas redações mais recentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {essays.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhuma redação enviada ainda
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Comece enviando sua primeira redação para ver sua evolução.
                  </p>
                  <Link href="/submit">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Enviar Primeira Redação
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {essays.map((essay) => (
                    <div key={essay.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{essay.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{essay.theme}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Enviada em {new Date(essay.createdAt).toLocaleDateString('pt-BR')}</span>
                            {essay.status === 'corrected' && essay.finalScore && (
                              <span className="font-semibold text-blue-600">
                                Nota: {essay.finalScore}/1000
                              </span>
                            )}
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              essay.status === 'corrected' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {essay.status === 'corrected' ? 'Corrigida' : 'Pendente'}
                            </span>
                          </div>
                        </div>
                        <Link href={`/essay/${essay.id}`}>
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upgrade CTA */}
        {user.plan === 'free' && (
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Upgrade seu Plano</CardTitle>
              <CardDescription className="text-blue-700">
                Desbloqueie mais correções e recursos premium
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="mb-4 sm:mb-0">
                  <p className="text-gray-700">
                    Com o plano Plus você obtém 15 correções e feedback personalizado!
                  </p>
                </div>
                <Link href="/plans">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Ver Planos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}