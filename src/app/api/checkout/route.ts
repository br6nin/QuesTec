import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Use uma versão estável e confirmada da API do Stripe.
const STRIPE_API_VERSION = '2024-06-20'; 

// 1. Verificação da chave secreta do Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Inicializa o Stripe APENAS se a chave estiver presente. Caso contrário, será nulo para permitir o mock.
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: STRIPE_API_VERSION as Stripe.LatestApiVersion,
}) : null;

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

    // --- LÓGICA DE MOCK PARA AMBIENTES SEM CHAVE SECRETA DO STRIPE ---
    if (!stripe) {
        console.warn("STRIPE_SECRET_KEY não definida. Retornando URL de checkout simulada.");
        // Retorna uma URL de mock. O PlansPage.tsx fará o redirect.
        // Adicionando um prefixo 'http://' ao mock_url caso o origin não esteja disponível ou esteja incompleto
        const mockUrl = `${origin || 'http://localhost:3000'}/success?mock_checkout=true&price=${priceId}&user=${finalUserId}`;
        return NextResponse.json({ url: mockUrl, id: 'mock_session_id' });
    }
    // --- FIM DA LÓGICA DE MOCK ---

    // Se a chave secreta estiver definida, executa a chamada real ao Stripe.
    const session = await stripe.checkout.sessions.create({
      // 1. Detalhes do Pagamento
      // Usando 'card' e 'boleto'
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