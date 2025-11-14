'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { PenTool, ArrowLeft, Upload, FileText, AlertCircle } from 'lucide-react'

const ENEM_THEMES = [
  "Desafios da juventude na contemporaneidade",
  "Impacto das redes sociais na sociedade",
  "Sustentabilidade e meio ambiente",
  "Desigualdade social no Brasil",
  "Tecnologia e o futuro do trabalho",
  "Saúde mental na era digital",
  "Educação no século XXI",
  "Violência contra a mulher",
  "Políticas de inclusão social",
  "Cultura identidade e diversidade",
  "Globalização e soberania nacional",
  "Preconceito e discriminação racial",
  "Crises econômicas e seus reflexos",
  "Mídia e construção da opinião pública",
  "Urbanização e qualidade de vida"
]

export default function EssaySubmissionPage() {
  const [user, setUser] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [theme, setTheme] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!title || !content || !theme) {
      setError('Todos os campos são obrigatórios')
      setIsLoading(false)
      return
    }

    if (content.length < 20) {
      setError('A redação deve ter pelo menos 20 caracteres')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/essays', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          theme,
          userId: user.id
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/essay/${data.essay.id}`)
      } else {
        setError(data.error || 'Erro ao enviar redação')
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length

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
                Créditos: <span className="font-semibold text-blue-600">{user.credits || 0}</span>
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Enviar Redação
            </h1>
            <p className="text-gray-600">
              Preencha os dados abaixo para enviar sua redação para correção
            </p>
          </div>

          {user.credits <= 0 && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-red-800 font-medium">Você não tem créditos disponíveis</p>
                    <p className="text-red-600 text-sm">
                      <Link href="/plans" className="underline hover:no-underline">
                        Adquira mais créditos para continuar
                      </Link>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Dados da Redação
              </CardTitle>
              <CardDescription>
                Sua redação será corrigida conforme os critérios oficiais do ENEM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título da Redação</Label>
                    <input
                      id="title"
                      type="text"
                      placeholder="Dê um título para sua redação"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme">Tema da Redação</Label>
                    <Select value={theme} onValueChange={setTheme} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tema" />
                      </SelectTrigger>
                      <SelectContent>
                        {ENEM_THEMES.map((themeOption, index) => (
                          <SelectItem key={index} value={themeOption}>
                            {themeOption}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Texto da Redação</Label>
                  <Textarea
                    id="content"
                    placeholder="Digite sua redação aqui. A redação do ENEM deve ter entre 20 e 30 linhas..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[400px] resize-y"
                    required
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Número de palavras: {wordCount}</span>
                    <span>Número de linhas: {content.split('\n').length}</span>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <p>Ao enviar, você usará 1 crédito de correção.</p>
                    <p>Saldo atual: {user.credits || 0} créditos</p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading || user.credits <= 0}
                  >
                    {isLoading ? 'Enviando...' : 'Enviar para Correção'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Dicas ENEM */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Dicas para uma Boa Redação ENEM</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Estrutura:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Introdução com apresentação do tema</li>
                    <li>• Desenvolvimento com argumentos consistentes</li>
                    <li>• Conclusão com proposta de intervenção</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Competências:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• C1: Domínio da norma culta</li>
                    <li>• C2: Compreensão do tema</li>
                    <li>• C3: Organização textual</li>
                    <li>• C4: Argumentação</li>
                    <li>• C5: Proposta de intervenção</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}