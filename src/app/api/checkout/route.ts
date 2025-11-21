import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Use uma versão estável e confirmada da API do Stripe.
const STRIPE_API_VERSION = '2024-06-20'; 

// 🚨 ATENÇÃO: A falta ou erro em STRIPE_SECRET_KEY é a CAUSA MAIS COMUM do erro 500.
// Se process.env.STRIPE_SECRET_KEY for undefined, este construtor falha.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: STRIPE_API_VERSION as Stripe.LatestApiVersion,
});

export async function POST(req: Request) {
  try {
    // O frontend DEVE enviar { priceId, userId }
    const { priceId, userId } = await req.json();

    // --- VALIDAÇÕES ---
    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceId in request body' }, { status: 400 });
    }
    
    const origin = req.headers.get('origin');
    if (!origin) {
        return NextResponse.json({ error: 'Origin header missing' }, { status: 400 });
    }

    // Use o userId real se existir. Se não existir (em testes, por exemplo), 
    // defina um mock, mas em produção, isto DEVE ser o ID do usuário logado.
    const finalUserId = userId || 'user_mock_test_12345';

    // ----------------------------------------------------

    const session = await stripe.checkout.sessions.create({
      // 1. Detalhes do Pagamento
      payment_method_types: ['card', 'boleto', 'pix'],
      mode: 'subscription', // Essencial para assinaturas recorrentes
      line_items: [{
        price: priceId, // Verifique se este ID está ativo no Stripe Dashboard
        quantity: 1,
      }],
      customer_creation: 'if_required', 

      // 2. Automação e Metadata
      metadata: { 
          userId: finalUserId, 
          planId: priceId 
      }, 
      
      // 3. URLs de Retorno
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/plans`,
    });

    return NextResponse.json({ url: session.url, id: session.id });

  } catch (error) {
    // Este bloco de catch é o que está retornando o 500.
    console.error('Stripe Checkout Error:', error);
    // IMPORTANTE: O objeto 'error' impresso aqui contém a causa exata.
    return NextResponse.json({ error: 'Failed to create checkout session. Check server logs.' }, { status: 500 });
  }
}