import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { title, content, theme, userId } = await request.json()

    if (!title || !content || !theme || !userId) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se o usuário existe e tem créditos
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    if (user.credits <= 0) {
      return NextResponse.json(
        { error: 'Créditos insuficientes' },
        { status: 400 }
      )
    }

    // Criar a redação
    const essay = await db.essay.create({
      data: {
        title,
        content,
        theme,
        userId,
        status: 'pending'
      }
    })

    // Deduzir um crédito do usuário
    await db.user.update({
      where: { id: userId },
      data: {
        credits: user.credits - 1
      }
    })

    return NextResponse.json({
      message: 'Redação enviada com sucesso',
      essay
    })

  } catch (error) {
    console.error('Essay submission error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      )
    }

    const essays = await db.essay.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      essays
    })

  } catch (error) {
    console.error('Essay fetch error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}