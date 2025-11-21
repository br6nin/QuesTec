import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicializa o Stripe com a Chave Secreta
// process.env.STRIPE_SECRET_KEY DEVE estar configurado no seu .env.local
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover', // Usando uma versão estável
});

export async function POST(req: Request) {
  try {
    // O frontend envia apenas { priceId } no nosso código atualizado.
    // Em produção, aqui deveria vir também o userId do usuário logado.
    const { priceId } = await req.json();

    // --- MOCK DE DADOS PARA AMBIENTE DE DESENVOLVIMENTO ---
    // ATENÇÃO: Em produção, você DEVE obter o userId do seu sistema de autenticação (e-mail, Supabase, etc.)
    // O código a seguir é apenas para que o Stripe aceite a requisição no ambiente de teste.
    const MOCK_USER_ID = 'user_mock_test_12345'; // Valor temporário para o metadata
    
    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 });
    }

    const origin = req.headers.get('origin');
    if (!origin) {
        return NextResponse.json({ error: 'Origin header missing' }, { status: 400 });
    }

    // ----------------------------------------------------

    const session = await stripe.checkout.sessions.create({
      // 1. Detalhes do Pagamento
      payment_method_types: ['card', 'boleto', 'pix'], // Configuração para o Brasil
      mode: 'subscription', // Essencial para assinaturas recorrentes
      line_items: [{
        price: priceId, 
        quantity: 1,
      }],
      // Necessário para o Stripe criar um Customer se ele não existir
      // Em produção, você passaria o ID do Cliente Stripe (customer: 'cus_xxxx')
      customer_creation: 'if_required', 

      // 2. Automação e Metadata
      // O webhook irá ler este metadata para saber qual usuário e plano ativar.
      metadata: { 
          userId: MOCK_USER_ID, // Usando o mock ID temporariamente
          planId: priceId 
      }, 
      
      // 3. URLs de Retorno
      // Redireciona para o dashboard após sucesso ou para a página de planos em caso de cancelamento.
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/plans`,
    });

    return NextResponse.json({ url: session.url, id: session.id });

  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    // Retorna um erro amigável ao frontend
    return NextResponse.json({ error: 'Failed to create checkout session. Check server logs.' }, { status: 500 });
  }
}