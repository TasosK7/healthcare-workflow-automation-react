import api from './api';

export interface Department {
    id: number;
    name: string;
    unit_type: string;
}

export const getDepartments = async (): Promise<Department[]> => {
    const res = await api.get('/departments');
    return res.data;
};
