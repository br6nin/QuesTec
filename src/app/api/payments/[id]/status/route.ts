import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paymentId = params.id

    // Buscar pagamento
    const payment = await db.payment.findUnique({
      where: { id: paymentId },
      include: { user: true }
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Pagamento não encontrado' },
        { status: 404 }
      )
    }

    // Simular verificação de status (em produção, integrar com API de pagamento real)
    // Para demonstração, vamos aprovar pagamentos após 30 segundos
    const paymentAge = Date.now() - new Date(payment.createdAt).getTime()
    const shouldApprove = paymentAge > 30000 && payment.status === 'pending'

    if (shouldApprove) {
      // Atualizar status do pagamento
      const updatedPayment = await db.payment.update({
        where: { id: paymentId },
        data: { status: 'approved' }
      })

      // Adicionar créditos ao usuário
      await db.user.update({
        where: { id: payment.userId },
        data: {
          credits: {
            increment: payment.credits
          }
        }
      })

      return NextResponse.json({
        payment: updatedPayment
      })
    }

    return NextResponse.json({
      payment
    })

  } catch (error) {
    console.error('Payment status check error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}