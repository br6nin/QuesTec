// 'use client' // Mantenha esta linha se estiver usando o Next.js App Router

import { useState, useEffect, useCallback } from 'react' // Adicionado useCallback
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { PenTool, ArrowLeft, CheckCircle, AlertCircle, TrendingUp, Download, Share2, CornerRightUp } from 'lucide-react' // Adicionado CornerRightUp

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
  suggestions: string[] // É um array de strings
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

const EssayFeedbackPage = ({ params }: { params: { id: string } }) => {
  const [user, setUser] = useState<any>(null)
  const [essay, setEssay] = useState<Essay | null>(null)
  const [correction, setCorrection] = useState<CorrectionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCorrecting, setIsCorrecting] = useState(false)
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'feedback' | 'original'>('feedback')


  const fetchEssay = useCallback(async (userId: string) => {
    try {
      const response = await fetch(`/api/essays/${params.id}?userId=${userId}`)
      const data = await response.json()

      if (response.ok) {
        setEssay(data.essay)
        if (data.essay.feedback) {
          const rawFeedback = data.essay.feedback.trim();
          let correctionData;
          try {
            const cleanedFeedback = rawFeedback.replace(/```json|```/g, '').trim();
            const firstBracketIndex = cleanedFeedback.indexOf('{');
            const finalJson = firstBracketIndex > 0 ? cleanedFeedback.substring(firstBracketIndex) : cleanedFeedback;
            correctionData = JSON.parse(finalJson);
          } catch (e) {
            console.error("Erro ao parsear o JSON de feedback:", e);
            correctionData = { finalScore: 0, generalFeedback: "Erro na leitura da correção. Tente corrigir novamente.", suggestions: [] };
          }
          setCorrection(correctionData as CorrectionData)
        }
      } else {
        console.error('Error fetching essay:', data.error)
      }
    } catch (error) {
      console.error('Error fetching essay:', error)
    } finally {
      setIsLoading(false)
    }
  }, [params.id])

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
  }, [router, fetchEssay])

  const handleCorrectEssay = async () => {
    setIsCorrecting(true)
    try {
      // Lógica de correção (mantida)
      const response = await fetch('/api/essays/correct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ essayId: params.id }),
      })
      const data = await response.json()

      if (response.ok) {
        setCorrection(data.correction)
        setEssay(data.essay)
        setActiveTab('feedback') // Muda para a aba de feedback após a correção
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
    if (score >= 800) return 'text-green-600' 
    if (score >= 600) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getProgressColor = (score: number) => {
    if (score >= 800) return 'bg-green-600' 
    if (score >= 600) return 'bg-yellow-600'
    return 'bg-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 900) return 'Excelente'
    if (score >= 700) return 'Muito Bom'
    if (score >= 500) return 'Regular'
    return 'Precisa Melhorar'
  }
  
  // Funções de Renderização Condicional (Mantidas)
  // ... (mantidas iguais)

  if (isLoading || !user) {
    // Tela de carregamento (mantida)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando feedback...</p>
        </div>
        

[Image of a spinning loading icon]

      </div>
    )
  }

  if (!essay) {
    // Tela de erro/não encontrado (mantida)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Redação não encontrada</h2>
          <p className="text-gray-600 mb-4">Verifique se o link está correto.</p>
          <Link href="/dashboard">
            <Button>Voltar ao Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Fixo (Melhorado) */}
      <header className="sticky top-0 z-10 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2 text-gray-900 hover:text-red-600 transition">
              <PenTool className="w-6 h-6" />
              <span className="text-xl font-bold hidden sm:inline">QuesTec - Feedback</span>
            </Link>
            
            <Button variant="ghost" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Título da Redação e Tema */}
          <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
              {essay.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
              <span className="font-semibold text-gray-700">Tema: {essay.theme}</span>
              <span>Enviada em: {new Date(essay.createdAt).toLocaleDateString('pt-BR')}</span>
              <Badge variant={essay.status === 'corrected' ? 'default' : 'secondary'} className="text-xs">
                {essay.status === 'corrected' ? 'CORRIGIDA' : 'PENDENTE'}
              </Badge>
            </div>
          </div>

          {/* Ação de Correção */}
          {essay.status === 'pending' && (
            <Card className="mb-8 border-l-4 border-blue-500 bg-blue-50 shadow-lg">
              <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-bold text-blue-800">
                    Sua redação está pronta para ser avaliada!
                  </h3>
                  <p className="text-blue-700 text-sm">
                    Receba o feedback completo em poucos segundos.
                  </p>
                </div>
                <Button 
                  onClick={handleCorrectEssay}
                  disabled={isCorrecting}
                  className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
                >
                  {isCorrecting ? 'Corrigindo... (Aguarde)' : 'Corrigir Agora'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Conteúdo Principal: Abas (Feedback vs. Original) */}
          <div className="flex mb-4 border-b border-gray-200">
            <button
              onClick={() => correction && setActiveTab('feedback')}
              className={`px-4 py-2 text-lg font-semibold transition ${
                activeTab === 'feedback' && correction
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-500 hover:text-gray-700 disabled:opacity-50'
              }`}
              disabled={!correction}
            >
              Avaliação Completa
            </button>
            <button
              onClick={() => setActiveTab('original')}
              className={`px-4 py-2 text-lg font-semibold transition ${
                activeTab === 'original'
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Texto Original
            </button>
          </div>

          {/* ------------------ ABA: AVALIAÇÃO COMPLETA ------------------ */}
          {activeTab === 'feedback' && correction && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Coluna 1: Score Final (Destaque) */}
              <div className="lg:col-span-1">
                <Card className="shadow-2xl border-t-4 border-red-500 transform transition duration-300 hover:scale-[1.01] mb-6">
                  <CardContent className="p-8 text-center">
                    <p className="text-xl font-semibold text-gray-500 mb-2">NOTA FINAL ENEM</p>
                    <div className={`text-8xl font-black mb-3 ${getScoreColor(correction.finalScore)}`}>
                      {correction.finalScore}
                    </div>
                    <Badge 
                      variant={correction.finalScore >= 600 ? 'default' : 'destructive'}
                      className="text-xl px-5 py-2 font-bold"
                    >
                      {getScoreLabel(correction.finalScore)}
                    </Badge>
                    <Progress 
                      value={(correction.finalScore / 1000) * 100} 
                      className={`mt-6 h-3 ${getProgressColor(correction.finalScore)}`} // Aplica a cor via className
                    />
                  </CardContent>
                </Card>

                {/* Feedback Geral */}
                <Card className="shadow-lg border border-gray-100">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl text-red-600">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Feedback do Corretor IA
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed text-base">{correction.generalFeedback}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Coluna 2 e 3: Competências (grid 2x3) */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Avaliação por Competência</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* C1 */}
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span>Competência 1: Norma Culta</span>
                        <span className={`text-2xl font-black ${getScoreColor(correction.c1Score)}`}>
                          {correction.c1Score}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* CORREÇÃO APLICADA AQUI */}
                      <Progress value={(correction.c1Score / 200) * 100} className={`mb-3 ${getProgressColor(correction.c1Score * 5)}`} />
                      <p className="text-sm text-gray-600">{correction.c1Feedback}</p>
                    </CardContent>
                  </Card>

                  {/* C2 */}
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span>Competência 2: Compreensão</span>
                        <span className={`text-2xl font-black ${getScoreColor(correction.c2Score)}`}>
                          {correction.c2Score}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* CORREÇÃO APLICADA AQUI */}
                      <Progress value={(correction.c2Score / 200) * 100} className={`mb-3 ${getProgressColor(correction.c2Score * 5)}`} />
                      <p className="text-sm text-gray-600">{correction.c2Feedback}</p>
                    </CardContent>
                  </Card>

                  {/* C3 */}
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span>Competência 3: Organização</span>
                        <span className={`text-2xl font-black ${getScoreColor(correction.c3Score)}`}>
                          {correction.c3Score}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* CORREÇÃO APLICADA AQUI */}
                      <Progress value={(correction.c3Score / 200) * 100} className={`mb-3 ${getProgressColor(correction.c3Score * 5)}`} />
                      <p className="text-sm text-gray-600">{correction.c3Feedback}</p>
                    </CardContent>
                  </Card>

                  {/* C4 */}
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span>Competência 4: Argumentação</span>
                        <span className={`text-2xl font-black ${getScoreColor(correction.c4Score)}`}>
                          {correction.c4Score}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* CORREÇÃO APLICADA AQUI */}
                      <Progress value={(correction.c4Score / 200) * 100} className={`mb-3 ${getProgressColor(correction.c4Score * 5)}`} />
                      <p className="text-sm text-gray-600">{correction.c4Feedback}</p>
                    </CardContent>
                  </Card>

                  {/* C5 */}
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span>Competência 5: Proposta</span>
                        <span className={`text-2xl font-black ${getScoreColor(correction.c5Score)}`}>
                          {correction.c5Score}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* CORREÇÃO APLICADA AQUI */}
                      <Progress value={(correction.c5Score / 200) * 100} className={`mb-3 ${getProgressColor(correction.c5Score * 5)}`} />
                      <p className="text-sm text-gray-600">{correction.c5Feedback}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Sugestões de Melhoria (Lista Detalhada) */}
                <Card className="shadow-lg border border-gray-100">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <CheckCircle className="w-5 h-5 mr-2 text-red-600" />
                      Sugestões Prioritárias
                    </CardTitle>
                    <CardDescription>Foque nestes pontos para maximizar sua próxima nota.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {correction.suggestions && Array.isArray(correction.suggestions) && correction.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <CornerRightUp className="w-5 h-5 text-red-600 mr-3 mt-1 flex-shrink-0 rotate-90" />
                          <span className="text-gray-800 font-medium">{suggestion}</span>
                        </li>
                      ))}
                  </ul> 
                  </CardContent>
                </Card>

              </div>
            </div>
          )}
          
          {/* ------------------ ABA: TEXTO ORIGINAL ------------------ */}
          {activeTab === 'original' && (
            <Card className="shadow-lg border border-gray-100">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Texto Completo Enviado</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                    <Download className="w-4 h-4 mr-2" />
                    Baixar
                  </Button>
                  <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartilhar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap font-serif text-lg">
                    {essay.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Ações Finais */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-10">
            <Link href="/submit">
              <Button variant="outline" className="w-full sm:w-auto">
                Enviar Nova Redação
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="w-full sm:w-auto bg-red-600 hover:bg-red-700">
                Voltar ao Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default EssayFeedbackPage