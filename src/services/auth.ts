import api from "./api";

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    username: string;
    email: string;
    role: string;
  };
}

export const login = async (
  username: string,
  password: string,
): Promise<LoginResponse> => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const response = await api.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
