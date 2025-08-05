// utils/api.ts
import auth from "./auth";

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
) {
  const authData = auth();
  if (!authData || !("access_token" in authData)) {
    throw new Error("Not authenticated");
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${authData.access_token}`,
    },
  });
}
