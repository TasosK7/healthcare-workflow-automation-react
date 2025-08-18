import api from "./api";

export const createStaff = async (user_id: number, first_name: string, last_name: string, department_id?: number) => {
    const res = await api.post("/staff", {
        user_id,
        first_name,
        last_name,
        department_id,
        role: "staff"
    });
    return res.data;
};

export const getAllStaff = async () => {
    const res = await api.get("/staff");
    return res.data;
};
