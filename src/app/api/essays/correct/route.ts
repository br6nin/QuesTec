import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// NOTA: A importação do ZAI foi removida e a lógica de IA foi comentada/substituída
// para permitir que o deploy na Vercel seja concluído com sucesso.

export async function POST(request: NextRequest) {
  try {
    const { essayId } = await request.json()

    if (!essayId) {
      return NextResponse.json(
        { error: 'ID da redação é obrigatório' },
        { status: 400 }
      )
    }

    // 1. Buscar a redação no banco
    const essay = await db.essay.findUnique({
      where: { id: essayId }
    })

    if (!essay) {
      return NextResponse.json(
        { error: 'Redação não encontrada' },
        { status: 404 }
      )
    }

    // ======================================================
    // **BLOCO DA IA DESABILITADO TEMPORARIAMENTE**
    // 
    // Em seu lugar, vamos simular uma resposta (placeholder)
    // para que a Vercel não tente executar código pesado.
    // ======================================================

    const correctionData = {
      c1Score: 180,
      c1Feedback: "Simulação: Forte domínio da norma culta, com pouquíssimos desvios (180/200).",
      c2Score: 180,
      c2Feedback: "Simulação: Excelente compreensão da proposta e aplicação produtiva do tema (180/200).",
      c3Score: 180,
      c3Feedback: "Simulação: Estrutura dissertativo-argumentativa clara e coesa (180/200).",
      c4Score: 180,
      c4Feedback: "Simulação: Argumentação sólida, com repertório sociocultural pertinente (180/200).",
      c5Score: 180,
      c5Feedback: "Simulação: Proposta de intervenção completa, com todos os elementos (180/200).",
      finalScore: 900, // Simulação de nota total
      generalFeedback: "Simulação: O site está em estabilização. Sua redação simulada atingiu 900 pontos, indicando ótimo potencial. A correção real por IA será ativada em breve.",
      suggestions: [
        "Simulação: Revise a concordância nominal para precisão máxima.",
        "Simulação: Busque aprofundar a discussão dos agentes de intervenção.",
        "Simulação: Conecte o repertório de forma mais explícita ao argumento."
      ]
    }

    // 2. Atualizar a redação no banco com os resultados SIMULADOS
    const updatedEssay = await db.essay.update({
      where: { id: essayId },
      data: {
        c1Score: correctionData.c1Score,
        c2Score: correctionData.c2Score,
        c3Score: correctionData.c3Score,
        c4Score: correctionData.c4Score,
        c5Score: correctionData.c5Score,
        finalScore: correctionData.finalScore,
        // É importante salvar o feedback como string no seu banco
        feedback: JSON.stringify(correctionData), 
        status: 'corrected'
      }
    })

    // 3. Retornar a resposta simulada
    return NextResponse.json({
      message: 'Redação corrigida com sucesso (Simulado)',
      essay: updatedEssay,
      correction: correctionData
    })

  } catch (error) {
    console.error('Essay correction error (handled):', error)
    return NextResponse.json(
      { error: 'Erro ao corrigir redação' },
      { status: 500 }
    )
  }
}