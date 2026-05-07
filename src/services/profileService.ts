const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CompleteProfileRequest {
  nombre: string;
  idGenero: number;
  fechaNacimiento: string;
  salario: number; 
  idOcupacion: number;
}

export type getUser = {
  id: number;
  nombre: string;
  email: string;
  idOcupacion: number;
  salario: number;
}; 

export async function getProfile(token: string) {
  const response = await fetch(`${API_URL}/api/auth/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error obteniendo el perfil");
  }

  return response.json();
}


export async function completeProfile(
  userId: number,
  data: CompleteProfileRequest,
  token: string
) {
  const response = await fetch(
    `${API_URL}/api/auth/complete-profile/${userId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al completar el perfil");
  }

  return response.json();
}