import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface RegisterMakerPayload {
  email: string;
  password: string;
  namaSiswa: string;
  kelas: string;
  namaApp: string;
}

export async function registerMaker(
  payload: RegisterMakerPayload
) {
  const response = await axios.post(
    `${API_URL}/api/v1/maker/register`,
    payload
  );

  return response.data;
}

export async function loginMaker(
  email: string,
  password: string
) {
  const response = await axios.post(
    `${API_URL}/api/v1/maker/login`,
    {
      email,
      password,
    }
  );

  return response.data;
}