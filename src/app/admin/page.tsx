'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PenTool, Users, Search, Eye, CreditCard, CheckCircle, AlertCircle, UserCheck, Crown } from 'lucide-react'

interface User {
  id: string
  email: string
  name: string | null
  credits: number
  plan: string
  createdAt: string
  updatedAt: string
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('')
  const [creditsToAdd, setCreditsToAdd] = useState(0)
  const [isUpdating, setIsUpdating] = useState(false)
  const [adminKey, setAdminKey] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Verificar se já está autenticado
    const authStatus = localStorage.getItem('adminAuthenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
      fetchUsers()
    }
  }, [])

  const handleLogin = () => {
    // Chave admin personalizada
    if (adminKey === 'brunojessie13010511bj') {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuthenticated', 'true')
      fetchUsers()
    } else {
      alert('Chave admin incorreta!')
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()

      if (response.ok) {
        setUsers(data.users || [])
      } else {
        console.error('Error fetching users:', data.error)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgradeUser = async () => {
    if (!selectedUser || !selectedPlan) return

    setIsUpdating(true)
    try {
      const response = await fetch('/api/admin/upgrade-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          plan: selectedPlan,
          credits: creditsToAdd
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Plano atualizado com sucesso!')
        setShowUpgradeModal(false)
        fetchUsers()
        setSelectedUser(null)
        setSelectedPlan('')
        setCreditsToAdd(0)
      } else {
        alert('Erro ao atualizar plano: ' + data.error)
      }
    } catch (error) {
      console.error('Error upgrading user:', error)
      alert('Erro ao atualizar plano')
    } finally {
      setIsUpdating(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-green-100 text-green-800'
      case 'basic': return 'bg-gray-100 text-gray-800'
      case 'plus': return 'bg-blue-100 text-blue-800'
      case 'premium': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case 'free': return 'Grátis'
      case 'basic': return 'Básico'
      case 'plus': return 'Plus'
      case 'premium': return 'Premium'
      default: return plan
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Painel Admin</CardTitle>
            <CardDescription>
              Acesso restrito para administradores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="adminKey" className="text-sm font-medium">
                Chave de Acesso
              </label>
              <Input
                id="adminKey"
                type="password"
                placeholder="Digite a chave admin"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700">
              Acessar Painel
            </Button>
            <div className="text-center">
              <Link href="/" className="text-sm text-blue-600 hover:underline">
                Voltar para página inicial
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Painel Admin</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAuthenticated(false)
                  localStorage.removeItem('adminAuthenticated')
                }}
              >
                Sair
              </Button>
              <Link href="/">
                <Button variant="outline">
                  <PenTool className="w-4 h-4 mr-2" />
                  Site
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gerenciamento de Usuários
          </h1>
          <p className="text-gray-600">
            Visualize e gerencie todos os usuários cadastrados na plataforma
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                Usuários cadastrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Planos Gratuitos</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.plan === 'free').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Usuários gratuitos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Planos Pagos</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.plan !== 'free').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Assinantes ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Créditos Totais</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.reduce((sum, user) => sum + user.credits, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Soma de todos os créditos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por email ou nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Usuários Cadastrados
            </CardTitle>
            <CardDescription>
              Clique em "Gerenciar" para ativar planos ou adicionar créditos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando usuários...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum usuário encontrado
                </h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Tente outra busca' : 'Nenhum usuário cadastrado ainda'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium">Email</th>
                      <th className="text-left py-3 px-4 font-medium">Nome</th>
                      <th className="text-left py-3 px-4 font-medium">Plano</th>
                      <th className="text-left py-3 px-4 font-medium">Créditos</th>
                      <th className="text-left py-3 px-4 font-medium">Cadastro</th>
                      <th className="text-left py-3 px-4 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium">{user.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div>{user.name || 'Não informado'}</div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getPlanColor(user.plan)}>
                            {getPlanLabel(user.plan)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold">{user.credits}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setShowUpgradeModal(true)
                            }}
                          >
                            Gerenciar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Upgrade Modal */}
      {showUpgradeModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Gerenciar Usuário</CardTitle>
              <CardDescription>
                Ativar plano ou adicionar créditos para {selectedUser.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Informações Atuais</label>
                <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-sm">
                  <div><strong>Plano:</strong> {getPlanLabel(selectedUser.plan)}</div>
                  <div><strong>Créditos:</strong> {selectedUser.credits}</div>
                  <div><strong>Usuário:</strong> {selectedUser.email}</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Novo Plano</label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Grátis</SelectItem>
                    <SelectItem value="basic">Básico</SelectItem>
                    <SelectItem value="plus">Plus</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Créditos Adicionais</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={creditsToAdd}
                  onChange={(e) => setCreditsToAdd(parseInt(e.target.value) || 0)}
                  min="0"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Créditos que serão adicionados ao total atual
                </p>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowUpgradeModal(false)
                    setSelectedUser(null)
                    setSelectedPlan('')
                    setCreditsToAdd(0)
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleUpgradeUser}
                  disabled={isUpdating || !selectedPlan}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isUpdating ? 'Atualizando...' : 'Confirmar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}