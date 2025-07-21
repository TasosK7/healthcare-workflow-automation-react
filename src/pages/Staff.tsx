import { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import api from "../services/api";
import type { Staff } from "../services/users";

interface Appointment {
    id: number;
    patient_id: number;
    patient_name: string;
    date: string;
    status: string;
}

interface LabTest {
    id: number;
    patient_id: number;
    result_file_url: string;
    status: string;
    diagnosis?: string;
    patient_name: string;
}

const Staff = () => {
    const [staff, setStaff] = useState<Staff | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [labTests, setLabTests] = useState<LabTest[]>([]);
    const [diagnosisMap, setDiagnosisMap] = useState<{ [key: number]: string }>({});
    const [downloadLinks, setDownloadLinks] = useState<{ [key: number]: string }>({});


    useEffect(() => {
        const fetchData = async () => {
            try {
                const resStaff = await api.get("/staff/me");
                setStaff(resStaff.data);

                const resAppointments = await api.get("/appointments/staff/me");
                setAppointments(resAppointments.data);

                const resLabTests = await api.get("lab-tests/staff/me");
                setLabTests(resLabTests.data);
            } catch (error) {
                console.error("Failed to fetch staff data", error);
            }
        };

        fetchData();
    }, []);

    const fetchDownloadUrl = async (testId: number) => {
        try {
            const res = await api.get(`/lab-tests/download-url/${testId}`);
            setDownloadLinks((prev) => ({ ...prev, [testId]: res.data.url }));
        } catch (err) {
            console.error("Download failed", err);
        }
    };

    const handleDiagnosisChange = (id: number, value: string) => {
        setDiagnosisMap((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmitDiagnosis = async (testId: number) => {
        const diagnosis = diagnosisMap[testId];
        if (!diagnosis) return;

        try {
            await api.patch(`/lab-tests/${testId}/diagnose`, { diagnosis });
            const res = await api.get("/lab-tests/staff/me");
            setLabTests(res.data);
            setDiagnosisMap((prev) => ({ ...prev, [testId]: "" }));
        } catch (err) {
            console.error("Failed to submit diagnosis", err);
        }
    };

    const handleApproveAppointment = async (appointmentId: number) => {
        try {
            await api.patch(`/appointments/${appointmentId}/approve`);
            const res = await api.get("/appointments/staff/me");
            setAppointments(res.data);
        } catch (err) {
            console.error("Failed to approve appointment", err);
            alert("Could not approve appointment.");
        }
    };


    return (
        <div>
            <Topbar />
            <div className="p-8 bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto space-y-6">

                    {/* Profile Card */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h1 className="text-2xl font-bold mb-4">My Profile</h1>
                        {staff ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-700"><span className="font-semibold">First Name:</span> {staff.first_name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-700"><span className="font-semibold">Last Name:</span> {staff.last_name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-700"><span className="font-semibold">Role:</span> {staff.role}</p>
                                </div>
                            </div>
                        ) : (
                            <p>Loading profile...</p>
                        )}
                    </div>

                    {/* Appointments Card */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">My Appointments</h2>
                        {appointments.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto border border-gray-200">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th className="text-left px-4 py-2 border">Date</th>
                                        <th className="text-left px-4 py-2 border">Patient</th>
                                        <th className="text-left px-4 py-2 border">Status</th>
                                        <th className="text-left px-4 py-2 border">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {appointments.map(appt => (
                                        <tr key={appt.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 border">{new Date(appt.date).toLocaleDateString()}</td>
                                            <td className="px-4 py-2 border">{appt.patient_name}</td>
                                            <td className="px-4 py-2 border">
          <span
              className={`px-2 py-1 rounded-full text-sm font-semibold
              ${appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  appt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-700'}`}
          >
            {appt.status}
          </span>
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <button
                                                    disabled={appt.status === "confirmed"}
                                                    onClick={() => handleApproveAppointment(appt.id)}
                                                    className={`px-3 py-1 rounded text-white font-semibold transition ${
                                                        appt.status === "confirmed"
                                                            ? "bg-gray-300 cursor-not-allowed"
                                                            : "bg-blue-600 hover:bg-blue-700"
                                                    }`}
                                                >
                                                    Approve
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>

                            </div>
                        ) : (
                            <p className="text-gray-600">No appointments found.</p>
                        )}
                    </div>

                    {/* Lab Tests Card */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Patient Lab Tests</h2>
                        {labTests.length === 0 ? (
                            <p className="text-gray-600">No pending lab tests.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto border border-gray-200">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th className="text-left px-4 py-2 border">Patient</th>
                                        <th className="text-left px-4 py-2 border">Result File</th>
                                        <th className="text-left px-4 py-2 border">Diagnosis</th>
                                        <th className="text-left px-4 py-2 border">Submit</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {labTests.map(test => (
                                        <tr key={test.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 border">{test.patient_name}</td>
                                            <td className="px-4 py-2 border">
                                                {downloadLinks[test.id] ? (
                                                    <a href={downloadLinks[test.id]} download className="text-blue-600 underline">
                                                        Download PDF
                                                    </a>
                                                ) : (
                                                    <button
                                                        onClick={() => fetchDownloadUrl(test.id)}
                                                        className="text-blue-600 underline"
                                                    >
                                                        Get Download Link
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <input
                                                    type="text"
                                                    className="w-full border rounded px-2 py-1"
                                                    placeholder="Enter diagnosis"
                                                    value={diagnosisMap[test.id] || ""}
                                                    onChange={(e) => handleDiagnosisChange(test.id, e.target.value)}
                                                />
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <button
                                                    onClick={() => handleSubmitDiagnosis(test.id)}
                                                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                                >
                                                    Submit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Staff;
