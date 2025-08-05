import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import CryptoUtils from "@/lib/utils/crypto-utils";

type RequestBody = {
  amount: number;
  merchantTransactionId: string;
  baseurl: string;
  payment_keys: {
    merchant_id: string;
    salt_index: string;
    api_key: string;
    account_mode: string;
  };
};

type TokenData = {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  expires_at?: number;
  scope?: string;
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as RequestBody;
    const { amount, merchantTransactionId, baseurl, payment_keys } = body;

    const UAT = "https://api-preprod.phonepe.com/apis/pg-sandbox";
    const PROD = "https://api.phonepe.com/apis/pg";
    const authProd = "https://api.phonepe.com/apis/identity-manager";
    const APP_KEY = process.env.APP_KEY;

    if (!APP_KEY) {
      return NextResponse.json(
        { success: false, message: "APP_KEY is not defined" },
        { status: 500 }
      );
    }

    const cryptoUtils = new CryptoUtils(APP_KEY);
    const account_mode = cryptoUtils.decrypt(payment_keys.account_mode);
    const authParams = {
      client_id: cryptoUtils.decrypt(payment_keys.merchant_id),
      client_version: cryptoUtils.decrypt(payment_keys.salt_index),
      client_secret: cryptoUtils.decrypt(payment_keys.api_key),
      grant_type: "client_credentials",
    };

    const authResponse = await axios.post<TokenData>(
      `${
        account_mode.toLowerCase() === "sandbox" ? UAT : authProd
      }/v1/oauth/token`,
      new URLSearchParams(authParams),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    );

    const tokenData = authResponse.data;

    const credsToStore = {
      merchant_id: payment_keys.merchant_id,
      salt_index: payment_keys.salt_index,
      api_key: payment_keys.api_key,
      account_mode: payment_keys.account_mode,
    };

    // Store token in secure cookie
    (await cookies()).set("phonepe_creds", JSON.stringify(credsToStore), {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 300, // same as token
      sameSite: "lax",
    });

    console.log("cookie set");

    // Construct payment payload
    const paymentPayload = {
      merchantOrderId: merchantTransactionId,
      amount: amount,
      expireAfter: 2400,
      metaInfo: {
        udf1: merchantTransactionId,
        udf2: "test2",
        udf3: "test3",
      },
      paymentFlow: {
        type: "PG_CHECKOUT",
        merchantUrls: {
          redirectUrl: `${baseurl}/payment-status?order_id=${merchantTransactionId}&By=phonepe`,
        },
      },
    };

    const paymentResponse = await axios.post<{ redirectUrl: string }>(
      `${
        account_mode.toLowerCase() === "sandbox" ? UAT : PROD
      }/checkout/v2/pay`,
      paymentPayload,
      {
        headers: {
          Authorization: `O-Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return NextResponse.json({
      success: true,
      redirectUrl: paymentResponse.data.redirectUrl,
    });
  } catch (error: unknown) {
    const errMessage = error;
    // error?.response?.data || error?.message || "Unknown error";

    console.error("Initiate Payment Error:", errMessage);

    return NextResponse.json(
      {
        success: false,
        message: "Payment initiation failed",
        error: errMessage,
      },
      { status: 500 }
    );
  }
}
