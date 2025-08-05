// utils/auth.ts
export interface AuthData {
  access_token: string;
  token_type: string;
  expires_in: number;
  is_vendor: number;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    image: string | null;
    status: number;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cart_items: any[];
}

export default function auth(): AuthData | false {
  if (typeof window !== "undefined") {
    const authString = localStorage.getItem("auth");
    if (authString) {
      try {
        return JSON.parse(authString) as AuthData;
      } catch (e) {
        console.log("Failed to parse auth data", e);
        return false;
      }
    }
  }
  return false;
}
