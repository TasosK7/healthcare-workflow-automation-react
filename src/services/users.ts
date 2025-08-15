import api from './api';

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
    const res = await api.get('/staff');
    return res.data;
};

export const getAllPatients = async (): Promise<Patient[]> => {
    const res = await api.get('/patients');
    return res.data;
};
