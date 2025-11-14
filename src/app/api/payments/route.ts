import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { userId, amount, credits, paymentMethod, planName } = await request.json()

    if (!userId || !amount || !credits || !paymentMethod || !planName) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
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

    // Criar registro de pagamento
    const payment = await db.payment.create({
      data: {
        userId,
        amount,
        credits,
        paymentMethod,
        status: 'pending',
        pixKey: 'bruno.almeidaferrer@gmail.com'
      }
    })

    // Simular criação de QR Code (em produção, integrar com API de pagamento real)
    const qrCodeData = {
      qrCode: `qrcode_data_${payment.id}`,
      expirationTime: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutos
    }

    return NextResponse.json({
      message: 'Pagamento criado com sucesso',
      payment: {
        ...payment,
        ...qrCodeData,
        planName
      }
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}