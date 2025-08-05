// utils/auth.ts
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;

  const authData = localStorage.getItem("auth");
  if (!authData) return null;

  try {
    const parsedAuth = JSON.parse(authData);
    return parsedAuth?.access_token || null;
  } catch (error) {
    console.log("Error parsing auth data:", error);
    return null;
  }
};

export const getAuthUser = () => {
  if (typeof window === "undefined") return null;

  const authData = localStorage.getItem("auth");
  if (!authData) return null;

  try {
    const parsedAuth = JSON.parse(authData);
    return parsedAuth?.user || null;
  } catch (error) {
    console.log("Error parsing auth data:", error);
    return null;
  }
};
