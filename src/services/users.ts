import api from "./api";

export interface Staff {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  department_id?: number;
  role: string;
  department_name: string;
}

export interface Patient {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
}

export const getAllStaff = async (): Promise<Staff[]> => {
  const res = await api.get("/staff");
  return res.data;
};

export const createStaffUser = async (
  username: string,
  email: string,
  password: string,
  contact_info?: string,
) => {
  const res = await api.post("/users/register", {
    username,
    email,
    password,
    role: "staff",
    contact_info,
  });
  return res.data;
};

export const createPatientUser = async (
  username: string,
  email: string,
  password: string,
  contact_info?: string,
) => {
  const res = await api.post("/users/register", {
    username,
    email,
    password,
    role: "patient",
    contact_info,
  });
  return res.data;
};
