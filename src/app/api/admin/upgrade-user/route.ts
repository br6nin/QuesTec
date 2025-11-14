import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { userId, plan, credits } = await request.json()

    if (!userId || !plan) {
      return NextResponse.json(
        { error: 'ID do usuário e plano são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se o usuário existe
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar plano e créditos do usuário
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        plan: plan.toLowerCase(),
        credits: user.credits + (credits || 0)
      }
    })

    // Criar registro de pagamento (para histórico)
    if (plan !== 'free' || credits > 0) {
      await db.payment.create({
        data: {
          userId: userId,
          amount: 0,
          credits: credits || 0,
          paymentMethod: 'admin_upgrade',
          status: 'approved'
        }
      })
    }

    return NextResponse.json({
      message: 'Usuário atualizado com sucesso',
      user: updatedUser
    })

  } catch (error) {
    console.error('Error upgrading user:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}