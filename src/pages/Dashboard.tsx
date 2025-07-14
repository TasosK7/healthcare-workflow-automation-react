import { useEffect, useState } from 'react';
import api from '../services/api';
import Topbar from '../components/Topbar';
import { getAllStaff, getAllPatients} from '../services/users';
import { getDepartments} from '../services/departments';
import type {Department} from "../services/departments";
import type {Staff, Patient} from "../services/users";
// import Navbar from "../components/Navbar.tsx";

const Dashboard = () => {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);

    const [editingDept, setEditingDept] = useState<Department | null>(null);
    const [updatedName, setUpdatedName] = useState('');
    const [updatedUnitType, setUpdatedUnitType] = useState('');

    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [staffFirstName, setStaffFirstName] = useState('');
    const [staffLastName, setStaffLastName] = useState('');
    const [staffRole, setStaffRole] = useState('');
    const [staffDepartmentId, setStaffDepartmentId] = useState<number | undefined>();

    const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
    const [patientFirstName, setPatientFirstName] = useState('');
    const [patientLastName, setPatientLastName] = useState('');


    const handleEditDepartment = (dept: Department) => {
        setEditingDept(dept);
        setUpdatedName(dept.name);
        setUpdatedUnitType(dept.unit_type);
    };

    const handleEditStaff = (staff: Staff) => {
        setEditingStaff(staff);
        setStaffFirstName(staff.first_name);
        setStaffLastName(staff.last_name);
        setStaffRole(staff.role);
        setStaffDepartmentId(staff.department_id);
    };

    const handleEditPatient = (patient: Patient) => {
        setEditingPatient(patient);
        setPatientFirstName(patient.first_name);
        setPatientLastName(patient.last_name);
    };

    const handleSaveDepartment = async () => {
        if (!editingDept) return;
        try {
            await api.put(`/departments/${editingDept.id}`, {
                name: updatedName,
                unit_type: updatedUnitType,
            });
            setEditingDept(null);
            const updatedDepartments = await getDepartments();
            setDepartments(updatedDepartments);
        } catch (err) {
            console.error('Failed to update department', err);
        }
    };

    const handleSaveStaff = async () => {
        if (!editingStaff) return;
        try {
            await api.put(`/staff/${editingStaff.id}`, {
                first_name: staffFirstName,
                last_name: staffLastName,
                role: staffRole,
                department_id: staffDepartmentId,
            });
            setEditingStaff(null);
            const updated = await getAllStaff();
            setStaff(updated);
        } catch (err) {
            console.error("Failed to update staff", err);
        }
    };

    const handleSavePatient = async () => {
        if (!editingPatient) return;
        try {
            await api.put(`/patients/${editingPatient.id}`, {
                first_name: patientFirstName,
                last_name: patientLastName,
            });
            setEditingPatient(null);
            const updated = await getAllPatients();
            setPatients(updated);
        } catch (err) {
            console.error("Failed to update patient", err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const staffData = await getAllStaff();
                const patientData = await getAllPatients();
                const departmentData = await getDepartments();
                setStaff(staffData);
                setPatients(patientData);
                setDepartments(departmentData);
            } catch (err) {
                console.error('Error loading data:', err);
            }
        };
        fetchData();
    }, []);

    const getDepartmentName = (id: number | undefined) => {
        const dept = departments.find((d) => d.id === id);
        return dept ? dept.name : '-';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Topbar />
            {/*<Navbar />*/}

            <div className="p-6 space-y-10 max-w-6xl mx-auto">
                {/* STAFF TABLE */}
                <section>
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Admin Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* STAFF TABLE */}
                        <div className="overflow-x-auto rounded-lg shadow bg-white border border-gray-200">
                            <h3 className="text-lg font-semibold p-4 border-b">Staff Members</h3>
                            <table className="w-full text-sm text-left text-gray-700">
                                <thead className="bg-gray-100 text-xs uppercase">
                                <tr>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Role</th>
                                    <th className="p-3">Department</th>
                                    <th className="p-3 text-center"></th>
                                </tr>
                                </thead>
                                <tbody>
                                {staff.map((s) => (
                                    <tr key={s.id} className="border-t hover:bg-gray-50">
                                        <td className="p-3">{s.first_name} {s.last_name}</td>
                                        <td className="p-3 capitalize">{s.role}</td>
                                        <td className="p-3">{getDepartmentName(s.department_id)}</td>
                                        <td className="p-3 text-center">
                                            <button
                                                onClick={() => handleEditStaff(s)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* DEPARTMENTS TABLE */}
                        <div className="overflow-x-auto rounded-lg shadow bg-white border border-gray-200">
                            <h3 className="text-lg font-semibold p-4 border-b">Departments</h3>
                            <table className="w-full text-sm text-left text-gray-700">
                                <thead className="bg-gray-100 text-xs uppercase">
                                <tr>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Unit Type</th>
                                    <th className="p-3 text-center"></th>
                                </tr>
                                </thead>
                                <tbody>
                                {departments.map((d) => (
                                    <tr key={d.id} className="border-t hover:bg-gray-50">
                                        <td className="p-3">{d.name}</td>
                                        <td className="p-3">{d.unit_type}</td>
                                        <td className="p-3 text-center">
                                            <button
                                                onClick={() => handleEditDepartment(d)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* PATIENT TABLE */}
                <section>
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">Patients</h3>
                    <div className="overflow-x-auto rounded-lg shadow">
                        <table className="w-full text-sm text-left text-gray-700 bg-white border border-gray-200">
                            <thead className="bg-gray-100 text-xs uppercase">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3 text-center"></th>
                                {/*<th className="p-3">User ID</th>*/}
                            </tr>
                            </thead>
                            <tbody>
                            {patients.map((p) => (
                                <tr key={p.id} className="border-t hover:bg-gray-50">
                                    <td className="p-3">{p.first_name} {p.last_name}</td>
                                    <td className="p-3 text-center">
                                        <button
                                            onClick={() => handleEditPatient(p)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                    {/*<td className="p-3">{p.user_id}</td>*/}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
            {editingDept && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Edit Department</h3>
                        <label className="block mb-2 text-sm">Name</label>
                        <input
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                        />
                        <label className="block mb-2 text-sm">Unit Type</label>
                        <input
                            value={updatedUnitType}
                            onChange={(e) => setUpdatedUnitType(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingDept(null)} className="px-4 py-2 border rounded">
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveDepartment}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {editingStaff && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Edit Staff</h3>
                        <input className="mb-2 w-full p-2 border" value={staffFirstName} onChange={(e) => setStaffFirstName(e.target.value)} />
                        <input className="mb-2 w-full p-2 border" value={staffLastName} onChange={(e) => setStaffLastName(e.target.value)} />
                        <input className="mb-2 w-full p-2 border" value={staffRole} onChange={(e) => setStaffRole(e.target.value)} />
                        <select
                            value={staffDepartmentId ?? ''}
                            onChange={(e) => setStaffDepartmentId(Number(e.target.value))}
                            className="mb-4 w-full p-2 border rounded"
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingStaff(null)} className="border px-4 py-2 rounded">Cancel</button>
                            <button onClick={handleSaveStaff} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                        </div>
                    </div>
                </div>
            )}
            {editingPatient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Edit Patient</h3>
                        <input className="mb-2 w-full p-2 border" value={patientFirstName} onChange={(e) => setPatientFirstName(e.target.value)} />
                        <input className="mb-4 w-full p-2 border" value={patientLastName} onChange={(e) => setPatientLastName(e.target.value)} />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingPatient(null)} className="border px-4 py-2 rounded">Cancel</button>
                            <button onClick={handleSavePatient} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;