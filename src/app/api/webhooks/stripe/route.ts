import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseServer } from '@/lib/supabase/supabaseServer'; 
import { PostgrestResponse } from '@supabase/supabase-js'; 

// --- CONFIGURAÇÃO ---
// Use a versão da API do Stripe que você configurou no Dashboard.
const STRIPE_API_VERSION = '2024-06-20'; // Versão estável

// Inicializa o Stripe.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: STRIPE_API_VERSION as Stripe.LatestApiVersion,
});

// A chave secreta do Webhook
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET; 

// Handler principal para a rota POST do Webhook
export async function POST(req: Request) {
  let event: Stripe.Event;

  // 1. Validar e Construir o Evento Stripe (Segurança)
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!webhookSecret || !signature) {
      console.error('Webhook Secret ou Stripe Signature ausente.');
      return NextResponse.json({ error: 'Webhook Secret ou Signature ausente.' }, { status: 400 });
    }

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (err: any) {
    console.error(`Erro ao validar o Webhook: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // 2. Processar o Evento
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription as string;

        if (!userId || !subscriptionId) {
            console.error('Metadata (userId) ou Subscription ID ausente na sessão.');
            return NextResponse.json({ error: 'Metadata ou Subscription ID ausente.' }, { status: 400 });
        }

        // Obtém o objeto Subscription completo
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        
        // @ts-ignore: Ignora o erro de tipagem para esta propriedade, pois sabemos que ela existe no Stripe.Subscription
        const subscriptionEndDate = subscription.current_period_end; 

        // 3. Atualizar o Banco de Dados (Supabase)
        const { error: updateError } = await supabaseServer
            .from('users') 
            .update({
                stripe_customer_id: session.customer as string,
                stripe_subscription_id: subscriptionId,
                subscription_status: subscription.status, 
                subscription_end_date: new Date(subscriptionEndDate * 1000).toISOString(), 
            })
            .eq('id', userId); 

        if (updateError) {
            console.error('Erro ao atualizar o Supabase após checkout:', updateError);
            return NextResponse.json({ error: 'Failed to update database.' }, { status: 500 });
        }
        break;
      }

      case 'customer.subscription.updated': {
        // Objeto de Subscrição do evento. Asserção de tipo é necessária para o compilador.
        const subscription = event.data.object as Stripe.Subscription;
        
        // @ts-ignore: Ignora o erro de tipagem para esta propriedade
        const subscriptionEndDate = subscription.current_period_end; 

        // Encontrar o userId baseado no stripe_customer_id
        const { data: userData, error: fetchError } = await supabaseServer
            .from('users')
            .select('id')
            .eq('stripe_customer_id', subscription.customer)
            .single();

        if (fetchError || !userData) {
            console.error('Erro ao buscar o userId pela Subscrição:', fetchError);
            return NextResponse.json({ error: 'User not found for this subscription.' }, { status: 404 });
        }

        // Atualiza status e data de fim (útil para renovações)
        const { error: updateError } = await supabaseServer
            .from('users')
            .update({
                subscription_status: subscription.status,
                subscription_end_date: new Date(subscriptionEndDate * 1000).toISOString(),
            })
            .eq('id', userData.id);

        if (updateError) {
            console.error('Erro ao atualizar o Supabase após update de subscrição:', updateError);
            return NextResponse.json({ error: 'Failed to update database on subscription update.' }, { status: 500 });
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Encontrar o userId baseado no stripe_customer_id
        const { data: userData, error: fetchError } = await supabaseServer
            .from('users')
            .select('id')
            .eq('stripe_customer_id', subscription.customer)
            .single();
            
        if (fetchError || !userData) {
            console.error('Erro ao buscar o userId pela Subscrição deletada:', fetchError);
            return NextResponse.json({ error: 'User not found for this deleted subscription.' }, { status: 404 });
        }
        
        const { error: updateError } = await supabaseServer
            .from('users')
            .update({
                subscription_status: 'canceled',
                // Nenhuma atualização de data necessária, pois o acesso expira no fim do período atual.
            })
            .eq('id', userData.id);

        if (updateError) {
            console.error('Erro ao atualizar o Supabase após delete de subscrição:', updateError);
            return NextResponse.json({ error: 'Failed to update database on subscription delete.' }, { status: 500 });
        }
        break;
      }

      default:
        console.log(`Evento não tratado: ${event.type}`);
    }
  } catch (err) {
    console.error('Erro durante o processamento do evento:', err);
    return NextResponse.json({ error: 'Falha interna ao processar o evento.' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}