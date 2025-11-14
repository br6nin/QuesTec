import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      )
    }

    const essay = await db.essay.findFirst({
      where: { 
        id: params.id,
        userId: userId 
      }
    })

    if (!essay) {
      return NextResponse.json(
        { error: 'Redação não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      essay
    })

  } catch (error) {
    console.error('Essay fetch error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}