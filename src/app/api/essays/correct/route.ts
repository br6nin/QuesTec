import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db'; 

// 1. Lê a URL do AWS Lambda da variável de ambiente da Vercel
const AWS_CORRECTION_URL = process.env.AWS_CORRECTION_URL;

export async function POST(request: NextRequest) {
    // Verifica se a URL de correção está configurada antes de começar
    if (!AWS_CORRECTION_URL) {
        return NextResponse.json(
            { error: 'URL do serviço de correção de IA não configurada (AWS_CORRECTION_URL)' },
            { status: 500 }
        );
    }
    
    try {
        const { essayId } = await request.json();

        // 1. Buscar a redação no banco (Prisma)
        const essay = await db.essay.findUnique({
            where: { id: essayId }
        });

        if (!essay) {
            return NextResponse.json({ error: 'Redação não encontrada' }, { status: 404 });
        }

        // 🛑 CHAMADA LEVE: Envia os dados para a função Lambda (onde a IA roda)
        const lambdaResponse = await fetch(AWS_CORRECTION_URL, {
            method: 'POST',
            // Envia APENAS os dados da redação que o Lambda precisa
            body: JSON.stringify({ 
                theme: essay.theme, 
                title: essay.title, 
                content: essay.content 
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        
        // Lidar com erros de rede ou status de erro do Lambda
        if (!lambdaResponse.ok) {
            let errorBody = await lambdaResponse.text();
            try {
                 errorBody = JSON.parse(errorBody);
            } catch (e) {
                // Se não for JSON, usa o texto puro
            }
            console.error('Erro da Função Lambda:', errorBody);
            throw new Error(`Erro do Serviço de Correção: ${lambdaResponse.statusText}`);
        }

        const lambdaData = await lambdaResponse.json();
        // CORREÇÃO: Lê o objeto de correção diretamente.
        const correctionData = lambdaData;

        // 2. Atualizar a redação no banco com os resultados REAIS do Lambda
        const updatedEssay = await db.essay.update({
            where: { id: essayId },
            data: {
                // Os campos c1Score, finalScore, etc. agora existem em correctionData 
                // graças ao novo prompt que você inseriu na Lambda.
                c1Score: correctionData.c1Score,
                c2Score: correctionData.c2Score,
                c3Score: correctionData.c3Score,
                c4Score: correctionData.c4Score,
                c5Score: correctionData.c5Score,
                finalScore: correctionData.finalScore,
                feedback: JSON.stringify(correctionData), 
                status: 'corrected'
            }
        });

        // Este retorno agora envia o objeto de correção correto para o Front-end
        return NextResponse.json({
            message: 'Redação corrigida com sucesso pela IA externa',
            essay: updatedEssay,
            correction: correctionData
        });

    } catch (error) {
        console.error('Erro no processo de correção Vercel -> Lambda:', error);
        return NextResponse.json(
            { error: 'Erro ao processar a correção. Verifique o Lambda e CORS.' },
            { status: 500 }
        );
    }
}