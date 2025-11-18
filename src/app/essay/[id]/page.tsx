'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { PenTool, ArrowLeft, CheckCircle, AlertCircle, TrendingUp, Download, Share2 } from 'lucide-react'

// Interface de dados esperada do Back-end (11 campos)
interface CorrectionData {
  c1Score: number
  c1Feedback: string
  c2Score: number
  c2Feedback: string
  c3Score: number
  c3Feedback: string
  c4Score: number
  c4Feedback: string
  c5Score: number
  c5Feedback: string
  finalScore: number
  generalFeedback: string
  suggestions: string[]
}

interface Essay {
  id: string
  title: string
  content: string
  theme: string
  finalScore: number | null
  c1Score: number | null
  c2Score: number | null
  c3Score: number | null
  c4Score: number | null
  c5Score: number | null
  feedback: string | null
  status: string
  createdAt: string
}

export default function EssayFeedbackPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null)
  const [essay, setEssay] = useState<Essay | null>(null)
  const [correction, setCorrection] = useState<CorrectionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCorrecting, setIsCorrecting] = useState(false)
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
      fetchEssay(parsedUser.id)
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/login')
    }
  }, [router, params.id])

  const fetchEssay = async (userId: string) => {
    try {
      const response = await fetch(`/api/essays/${params.id}?userId=${userId}`)
      const data = await response.json()

      if (response.ok) {
        setEssay(data.essay)
        if (data.essay.feedback) {
          setCorrection(JSON.parse(data.essay.feedback))
        }
      } else {
        console.error('Error fetching essay:', data.error)
      }
    } catch (error) {
      console.error('Error fetching essay:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCorrectEssay = async () => {
    setIsCorrecting(true)
    try {
      const response = await fetch('/api/essays/correct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ essayId: params.id }),
      })

      const data = await response.json()

      if (response.ok) {
        setCorrection(data.correction)
        setEssay(data.essay)
      } else {
        console.error('Error correcting essay:', data.error)
      }
    } catch (error) {
      console.error('Error correcting essay:', error)
    } finally {
      setIsCorrecting(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-600' // Ajustei o limite para melhor visualização
    if (score >= 600) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 900) return 'Excelente'
    if (score >= 700) return 'Muito Bom'
    if (score >= 500) return 'Regular'
    return 'Precisa Melhorar'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando feedback...</p>
        </div>
      </div>
    )
  }

  if (!essay) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Redação não encontrada</h2>
          <p className="text-gray-600 mb-4">Verifique se o link está correto.</p>
          <Link href="/dashboard">
            <Button>Voltar ao Dashboard</Button>
          </Link>
        </div>
        {/* A chave '}' de fechamento da função já está no final do arquivo */}
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
        <div className="max-w-6xl mx-auto">
          {/* Header da Redação */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{essay.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span><strong>Tema:</strong> {essay.theme}</span>
              <span><strong>Enviada em:</strong> {new Date(essay.createdAt).toLocaleDateString('pt-BR')}</span>
              <Badge variant={essay.status === 'corrected' ? 'default' : 'secondary'}>
                {essay.status === 'corrected' ? 'Corrigida' : 'Pendente'}
              </Badge>
            </div>
          </div>

          {/* Ação de Correção */}
          {essay.status === 'pending' && (
            <Card className="mb-6 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      Sua redação está aguardando correção
                    </h3>
                    <p className="text-blue-700">
                      Clique no botão abaixo para iniciar a correção com nossa IA.
                    </p>
                  </div>
                  <Button 
                    onClick={handleCorrectEssay}
                    disabled={isCorrecting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isCorrecting ? 'Corrigindo...' : 'Corrigir Agora'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {correction && (
            <>
              {/* Score Final */}
              <Card className="mb-6">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Nota Final</CardTitle>
                  <CardDescription>Sua redação foi avaliada em 1000 pontos</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className={`text-6xl font-bold mb-2 ${getScoreColor(correction.finalScore)}`}>
                    {correction.finalScore}
                  </div>
                  <Badge 
                    variant={correction.finalScore >= 600 ? 'default' : 'destructive'}
                    className="text-lg px-4 py-2"
                  >
                    {getScoreLabel(correction.finalScore)}
                  </Badge>
                  <Progress 
                    value={(correction.finalScore / 1000) * 100} 
                    className="mt-4 h-3"
                  />
                </CardContent>
              </Card>

              {/* Competências (Mantidas iguais, pois usam campos simples) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>C1 - Norma Culta</span>
                      <span className={`text-lg font-bold ${getScoreColor(correction.c1Score)}`}>
                        {correction.c1Score}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={(correction.c1Score / 200) * 100} className="mb-3" />
                    <p className="text-sm text-gray-600">{correction.c1Feedback}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>C2 - Compreensão</span>
                      <span className={`text-lg font-bold ${getScoreColor(correction.c2Score)}`}>
                        {correction.c2Score}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={(correction.c2Score / 200) * 100} className="mb-3" />
                    <p className="text-sm text-gray-600">{correction.c2Feedback}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>C3 - Organização</span>
                      <span className={`text-lg font-bold ${getScoreColor(correction.c3Score)}`}>
                        {correction.c3Score}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={(correction.c3Score / 200) * 100} className="mb-3" />
                    <p className="text-sm text-gray-600">{correction.c3Feedback}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>C4 - Argumentação</span>
                      <span className={`text-lg font-bold ${getScoreColor(correction.c4Score)}`}>
                        {correction.c4Score}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={(correction.c4Score / 200) * 100} className="mb-3" />
                    <p className="text-sm text-gray-600">{correction.c4Feedback}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>C5 - Proposta</span>
                      <span className={`text-lg font-bold ${getScoreColor(correction.c5Score)}`}>
                        {correction.c5Score}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={(correction.c5Score / 200) * 100} className="mb-3" />
                    <p className="text-sm text-gray-600">{correction.c5Feedback}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Feedback Geral */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Feedback Geral
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{correction.generalFeedback}</p>
                </CardContent>
              </Card>

              {/* Sugestões */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Sugestões de Melhoria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {/* CORREÇÃO PRINCIPAL: Garante que 'suggestions' existe E é um array antes de usar .map() */}
                    {correction.suggestions && Array.isArray(correction.suggestions) && correction.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <span className="text-blue-600 text-sm font-semibold">{index + 1}</span>
                        </div>
                        <span className="text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul> 
                </CardContent>
              </Card>
            </>
          )}

          {/* Texto Original */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Texto Original</span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Baixar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartilhar
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {essay.content}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex justify-center space-x-4 mt-8">
            <Link href="/submit">
              <Button variant="outline">
                Enviar Nova Redação
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button>
                Ver Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}