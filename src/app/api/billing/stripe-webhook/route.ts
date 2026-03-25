import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/billing";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || "whsec_mock"
    );
  } catch (error: any) {
    console.error("Stripe Webhook Error:", error.message);
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        const invoiceId = paymentIntent.metadata?.invoiceId;
        
        if (invoiceId) {
          await prisma.invoice.update({
            where: { id: invoiceId },
            data: { status: "PAID" }
          });
          
          if (paymentIntent.metadata?.customerId) {
            await prisma.payment.create({
              data: {
                invoiceId: invoiceId,
                customerId: paymentIntent.metadata.customerId,
                amount: paymentIntent.amount_received / 100, // Stripe is in cents
                method: "STRIPE",
              }
            });
          }
          console.log(`Pago procesado para factura ${invoiceId}`);
        }
        break;
      case "payment_intent.payment_failed":
        console.log("El pago ha fallado", event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Error processing webhook", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
