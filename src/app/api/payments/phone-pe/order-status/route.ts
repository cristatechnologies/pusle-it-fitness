import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import CryptoUtils from "@/lib/utils/crypto-utils";

const UAT = "https://api-preprod.phonepe.com/apis/pg-sandbox";
const PROD = "https://api.phonepe.com/apis/pg";
const authProd = "https://api.phonepe.com/apis/identity-manager";
const APP_KEY = process.env.APP_KEY;

type AuthParams = {
  client_id: string;
  client_secret: string;
  grant_type: string;
  [key: string]: string;
};

type TokenData = {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  scope?: string;
};

type OrderStatusResponse = {
  state: "completed" | "failed" | "pending" | string;
  [key: string]: unknown; // Changed from any to unknown
};

type ApiResponse = {
  success: boolean;
  status?: "success" | "failure" | "pending";
  raw?: OrderStatusResponse;
  tokenExpiresAt?: number;
  message?: string;
  error?: unknown; // Changed from any to unknown
};

type CookieCreds = {
  merchant_id: string;
  salt_index: string;
  api_key: string;
  account_mode: string;
};

async function generateTokenFromCookieCreds(): Promise<
  TokenData & { account_mode: string }
> {
  const credsCookie = (await cookies()).get("phonepe_creds");

  if (!APP_KEY) throw new Error("APP_KEY is missing");
  if (!credsCookie?.value)
    throw new Error("Missing PhonePe credentials cookie");

  const creds = JSON.parse(credsCookie.value) as CookieCreds;
  const cryptoUtils = new CryptoUtils(APP_KEY);

  const account_mode = cryptoUtils.decrypt(creds.account_mode);
  const client_id = cryptoUtils.decrypt(creds.merchant_id);
  const client_version = cryptoUtils.decrypt(creds.salt_index);
  const client_secret = cryptoUtils.decrypt(creds.api_key);

  const authParams: AuthParams = {
    client_id,
    client_version,
    client_secret,
    grant_type: "client_credentials",
  };

  const response = await axios.post<TokenData>(
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

  return { ...response.data, account_mode };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { orderId } = await req.json();

  if (!orderId) {
    return NextResponse.json(
      { success: false, message: "Missing orderId" },
      { status: 400 }
    );
  }

  try {
    const tokenData = await generateTokenFromCookieCreds();
    const baseUrl =
      tokenData.account_mode.toLowerCase() === "sandbox" ? UAT : PROD;

    const statusResponse = await axios.get<OrderStatusResponse>(
      `${baseUrl}/checkout/v2/order/${orderId}/status`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `O-Bearer ${tokenData.access_token}`,
        },
      }
    );

    const statusFromAPI = statusResponse.data.state.toLowerCase();
    let status: "success" | "failure" | "pending";

    switch (statusFromAPI) {
      case "completed":
        status = "success";
        break;
      case "failed":
        status = "failure";
        break;
      case "pending":
      default:
        status = "pending";
        break;
    }

    const responseData: ApiResponse = {
      success: true,
      status,
      raw: statusResponse.data,
      tokenExpiresAt: tokenData.expires_in
        ? Date.now() + tokenData.expires_in * 1000
        : undefined,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    const axiosError = error as AxiosError;
    const errData = axiosError.response?.data || axiosError.message;

    console.error("Order Status Error:", errData);

    return NextResponse.json(
      {
        success: false,
        message: "Error fetching order status",
        error: errData,
      },
      { status: 500 }
    );
  }
}
