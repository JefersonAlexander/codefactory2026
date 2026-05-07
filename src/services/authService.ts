// src/services/authService.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginWithGoogle(idToken: string) {
  const response = await fetch(`${API_URL}/api/auth/google-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  }); 

  if (!response.ok) {
    throw new Error("Error autenticando con Google");
  }

  return response.json();
}
