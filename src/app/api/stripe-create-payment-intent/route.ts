// src/app/api/stripe-create-payment-intent/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface RequestBody {
  data: {
    amount: number;
    orderId: string;
    currency: string;
    metadata?: Record<string, string>;
  };
  metaData?: Record<string, string>;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;
    const { data, metaData } = body;

    console.log("data", data);
    if (!data.amount || !data.currency) {
      return NextResponse.json(
        { error: "Amount and currency are required" },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency,
      metadata: {
        orderId: data.orderId,
        ...(metaData || {}),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });
    console.log("payment intent", paymentIntent);

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: unknown) {
    const err = error as Error;
    console.log("Error creating payment intent:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
