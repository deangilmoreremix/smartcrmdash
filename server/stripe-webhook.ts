import { Request, Response } from "express";
import { 
  handleSuccessfulPurchase,
  handleInvoicePaid,
  handlePaymentFailure,
  handleCancellation,
  handleRefund,
  ProductType
} from "./entitlements-utils";

// Initialize Stripe - you'll need to add STRIPE_SECRET_KEY to your environment
let stripe: any = null;
try {
  const Stripe = require('stripe');
  stripe = process.env.STRIPE_SECRET_KEY 
    ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-12-18' })
    : null;
} catch (error) {
  console.log('Stripe not available - install stripe package if needed');
}

export async function handleStripeWebhook(req: Request, res: Response) {
  if (!stripe) {
    console.error('Stripe not configured - missing STRIPE_SECRET_KEY');
    return res.status(400).json({ error: 'Stripe not configured' });
  }

  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    console.error('Stripe webhook secret not configured');
    return res.status(400).json({ error: 'Webhook secret not configured' });
  }

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const metadata = session.metadata;
        
        if (metadata?.user_id && metadata?.product_type) {
          await handleSuccessfulPurchase(
            metadata.user_id,
            metadata.product_type as ProductType,
            {
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              planName: session.display_items?.[0]?.custom?.name,
              planAmount: session.amount_total ? (session.amount_total / 100).toString() : undefined,
              currency: session.currency?.toUpperCase(),
            }
          );
          
          console.log(`Processed successful purchase for user ${metadata.user_id}, type: ${metadata.product_type}`);
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as any;
        const subscription = invoice.subscription;
        
        if (subscription && typeof subscription === 'string') {
          // Get subscription to find metadata
          const subscriptionObj = await stripe.subscriptions.retrieve(subscription);
          const metadata = subscriptionObj.metadata;
          
          if (metadata?.user_id && metadata?.product_type) {
            await handleInvoicePaid(
              metadata.user_id,
              metadata.product_type as ProductType
            );
            
            console.log(`Processed invoice payment for user ${metadata.user_id}, type: ${metadata.product_type}`);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const subscription = invoice.subscription;
        
        if (subscription && typeof subscription === 'string') {
          const subscriptionObj = await stripe.subscriptions.retrieve(subscription);
          const metadata = subscriptionObj.metadata;
          
          if (metadata?.user_id && metadata?.product_type) {
            await handlePaymentFailure(
              metadata.user_id,
              metadata.product_type as ProductType
            );
            
            console.log(`Processed payment failure for user ${metadata.user_id}, type: ${metadata.product_type}`);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const metadata = subscription.metadata;
        
        if (metadata?.user_id && metadata?.product_type) {
          await handleCancellation(
            metadata.user_id,
            metadata.product_type as ProductType
          );
          
          console.log(`Processed cancellation for user ${metadata.user_id}, type: ${metadata.product_type}`);
        }
        break;
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object as any;
        const charge = dispute.charge;
        
        // Get payment intent from charge to find metadata
        if (typeof charge === 'string') {
          const chargeObj = await stripe.charges.retrieve(charge);
          const paymentIntentId = chargeObj.payment_intent;
          
          if (typeof paymentIntentId === 'string') {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            const metadata = paymentIntent.metadata;
            
            if (metadata?.user_id && metadata?.product_type) {
              await handleRefund(
                metadata.user_id,
                metadata.product_type as ProductType
              );
              
              console.log(`Processed refund for user ${metadata.user_id}, type: ${metadata.product_type}`);
            }
          }
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}