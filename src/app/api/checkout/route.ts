import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Use uma versão estável e confirmada da API do Stripe.
const STRIPE_API_VERSION = '2024-06-20'; 

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

    // Garante que o userId (para o webhook) sempre existirá
    const finalUserId = userId || 'user_mock_test_12345';

    // ----------------------------------------------------

    const session = await stripe.checkout.sessions.create({
      // 1. Detalhes do Pagamento
      // Usando 'card' e 'boleto', pois o boleto está Habilitado no Dashboard.
      // O 'pix' foi removido porque causou o último erro, sugerindo que não estava ativado.
      payment_method_types: ['card', 'boleto'], 
      mode: 'subscription', // ESSENCIAL: Assinatura recorrente
      line_items: [{
        price: priceId, 
        quantity: 1,
      }],
      
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
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session. Check server logs.' }, { status: 500 });
  }
}