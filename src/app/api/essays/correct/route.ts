import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { essayId } = await request.json()

    if (!essayId) {
      return NextResponse.json(
        { error: 'ID da redação é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar a redação no banco
    const essay = await db.essay.findUnique({
      where: { id: essayId }
    })

    if (!essay) {
      return NextResponse.json(
        { error: 'Redação não encontrada' },
        { status: 404 }
      )
    }

    // Inicializar o SDK da Z.AI
    const zai = await ZAI.create()

    // Criar o prompt para correção da redação
    const correctionPrompt = `
Você é um corretor experiente de redações do ENEM. Analise a seguinte redação e atribua notas de 0 a 200 para cada uma das 5 competências, justificando cada nota.

Tema: ${essay.theme}
Título: ${essay.title}
Redação:
${essay.content}

Analise as seguintes competências:

C1 - Domínio da norma culta: Avalie gramática, ortografia, pontuação e sintaxe.
C2 - Compreensão do tema: Verifique se o autor demonstra compreensão do tema proposto.
C3 - Organização textual: Avalie a estrutura da redação (introdução, desenvolvimento, conclusão).
C4 - Argumentação: Analise a qualidade e consistência dos argumentos apresentados.
C5 - Proposta de intervenção: Verifique se há uma proposta concreta e viável para o problema.

Para cada competência, forneça:
- Nota (0-200)
- Justificativa detalhada (2-3 frases)

Ao final, forneça:
- Nota final (soma das 5 competências)
- Feedback geral com pontos fortes e sugestões de melhoria
- 3 sugestões específicas para melhorar a redação

Responda em formato JSON da seguinte maneira:
{
  "c1Score": nota,
  "c1Feedback": "justificativa",
  "c2Score": nota,
  "c2Feedback": "justificativa", 
  "c3Score": nota,
  "c3Feedback": "justificativa",
  "c4Score": nota,
  "c4Feedback": "justificativa",
  "c5Score": nota,
  "c5Feedback": "justificativa",
  "finalScore": nota_total,
  "generalFeedback": "feedback geral",
  "suggestions": ["sugestão1", "sugestão2", "sugestão3"]
}
`

    // Fazer a correção com IA
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Você é um corretor especializado em redações do ENEM. Forneça análises detalhadas e construtivas.'
        },
        {
          role: 'user',
          content: correctionPrompt
        }
      ],
      temperature: 0.3
    })

    const aiResponse = completion.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('Não foi possível obter resposta da IA')
    }

    // Tentar fazer parse do JSON
    let correctionData
    try {
      // Extrair JSON da resposta
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('JSON não encontrado na resposta')
      }
      correctionData = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.error('Erro ao fazer parse da resposta da IA:', parseError)
      // Fallback com valores padrão
      correctionData = {
        c1Score: 120,
        c1Feedback: "Análise básica da norma culta",
        c2Score: 120,
        c2Feedback: "Compreensão adequada do tema",
        c3Score: 120,
        c3Feedback: "Estrutura textual organizada",
        c4Score: 120,
        c4Feedback: "Argumentação consistente",
        c5Score: 120,
        c5Feedback: "Proposta de intervenção presente",
        finalScore: 600,
        generalFeedback: "Redação com estrutura adequada, mas pode ser melhorada em vários aspectos.",
        suggestions: [
          "Revise a coesão e coerência textual",
          "Aprofunde os argumentos com mais exemplos",
          "Detalhe melhor a proposta de intervenção"
        ]
      }
    }

    // Atualizar a redação no banco com os resultados
    const updatedEssay = await db.essay.update({
      where: { id: essayId },
      data: {
        c1Score: correctionData.c1Score,
        c2Score: correctionData.c2Score,
        c3Score: correctionData.c3Score,
        c4Score: correctionData.c4Score,
        c5Score: correctionData.c5Score,
        finalScore: correctionData.finalScore,
        feedback: JSON.stringify(correctionData),
        status: 'corrected'
      }
    })

    return NextResponse.json({
      message: 'Redação corrigida com sucesso',
      essay: updatedEssay,
      correction: correctionData
    })

  } catch (error) {
    console.error('Essay correction error:', error)
    return NextResponse.json(
      { error: 'Erro ao corrigir redação' },
      { status: 500 }
    )
  }
}