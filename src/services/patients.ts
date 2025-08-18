import api from "./api";
import type { Patient } from "./users.ts";

export const getAllPatients = async (): Promise<Patient[]> => {
  const res = await api.get("/patients");
  return res.data;
};

export async function createPatient(
  user_id: number,
  first_name: string,
  last_name: string,
) {
  const res = await api.post("/patients/", {
    user_id,
    first_name,
    last_name,
  });
  return res.data;
}

export async function updatePatient(
  id: number,
  first_name: string,
  last_name: string,
) {
  const res = await api.put(`/patients/${id}`, {
    first_name,
    last_name,
  });
  return res.data;
}
