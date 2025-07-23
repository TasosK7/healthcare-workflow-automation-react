import { useEffect, useState } from 'react';
import Topbar from '../components/Topbar';
import {AxiosError} from "axios";
import api from '../services/api';
import type {Staff, Patient} from '../services/users'

interface Appointment {
    id: number;
    staff_id: number;
    date: string;
    status: string;
    staff_name: string;
}

interface DiagnosedTest {
    id: number;
    result_file_url: string;
    diagnosis: string;
    staff_name: string;
}


const Patient = () => {
    const [patient, setPatient] = useState<Patient | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<number | "">("");
    const [selectedDate, setSelectedDate] = useState<string>("");


    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);

    const [diagnosedTests, setDiagnosedTests] = useState<DiagnosedTest[]>([]);

    const [downloadLinks, setDownloadLinks] = useState<{ [key: number]: string }>({});

    const [bookingError, setBookingError] = useState<string | null>(null);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const resPatient = await api.get('/patients/me');
                setPatient(resPatient.data);

                const resAppointments = await api.get('/appointments/me');
                setAppointments(resAppointments.data);

                const resDiagnosis = await api.get("/lab-tests/diagnosed/me");
                setDiagnosedTests(resDiagnosis.data);

            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };

        fetchData();

        const fetchStaff = async () => {
            try {
                const res = await api.get("/staff");
                setStaffList(res.data);
            } catch (err) {
                console.error("Failed to fetch staff", err);
            }
        };
        fetchStaff();

    }, []);

    const getDownloadLink = async (testId: number): Promise<string | null> => {
        try {
            const res = await api.get(`/lab-tests/download-url/${testId}`);
            return res.data.url;
        } catch (err) {
            console.error("Download URL error:", err);
            return null;
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setBookingError(null);
        try {
            await api.post("/appointments/book", {
                patient_id: 0, // dummy, will be ignored by backend
                staff_id: selectedStaff,
                date: selectedDate,
                status: "pending"
            });

            const resAppointments = await api.get('/appointments/me');
            setAppointments(resAppointments.data);
            setSelectedDate("");
            setSelectedStaff("");
            alert("Appointment booked!");
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ detail: string }>;
            console.error("Failed to book appointment", error);
            if (axiosError.response && axiosError.response.status === 400) {
                setBookingError(axiosError.response.data?.detail || "Booking error.");
            } else {
                setBookingError("An unexpected error occurred.");
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file);
        } else {
            setSelectedFile(null);
            setUploadStatus("Please upload a valid PDF file.");
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !selectedStaff) return;

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("staff_id", selectedStaff.toString());

        try {
            await api.post("/lab-tests/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setUploadStatus("Upload successful!");
            setSelectedFile(null);
            setSelectedStaff("");
        } catch (error) {
            console.error("Upload error:", error);
            setUploadStatus("Upload failed.");
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
                        {patient ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-700"><span className="font-semibold">First Name:</span> {patient.first_name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-700"><span className="font-semibold">Last Name:</span> {patient.last_name}</p>
                                </div>
                                {/*<div>*/}
                                {/*    <p className="text-gray-700"><span className="font-semibold">Patient ID:</span> {patient.id}</p>*/}
                                {/*</div>*/}
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
                                        <th className="text-left px-4 py-2 border">Staff</th>
                                        <th className="text-left px-4 py-2 border">Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {appointments.map(appt => (
                                        <tr key={appt.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 border">{new Date(appt.date).toLocaleDateString()}</td>
                                            <td className="px-4 py-2 border">{appt.staff_name}</td>
                                            <td className="px-4 py-2 border">
                                              <span
                                                  className={`px-2 py-1 rounded-full text-sm font-semibold
                                                  ${appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                      appt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                          'bg-gray-100 text-gray-700'}`}
                                              >
                                                {appt.status}
                                              </span>
                                            </td>                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-600">No appointments found.</p>
                        )}
                    </div>
                    {/* Book Appointment Form */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Book New Appointment</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Staff Selector */}
                            <div>
                                <label className="block mb-1 font-medium">Select Staff Member</label>
                                <select
                                    value={selectedStaff}
                                    onChange={(e) => setSelectedStaff(Number(e.target.value))}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                >
                                    <option value="">-- Choose --</option>
                                    {staffList.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.first_name} {s.last_name} ({s.role})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date Picker */}
                            <div>
                                <label className="block mb-1 font-medium">Date</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Book Appointment
                            </button>
                        </form>
                        {bookingError && (
                            <div className="text-red-600 text-sm mt-2">
                                {bookingError}
                            </div>
                        )}

                    </div>
                    {/* File Upload Form */}
                    <div className="mt-6 p-6 border rounded-xl bg-white shadow-md">
                        <h2 className="text-lg font-semibold mb-4">Upload Lab Test Results (PDF)</h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Staff</label>
                            <select
                                value={selectedStaff}
                                onChange={(e) => setSelectedStaff(parseInt(e.target.value))}
                                className="block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 text-sm"
                            >
                                <option value="">-- Choose Staff --</option>
                                {staffList.map((staff) => (
                                    <option key={staff.id} value={staff.id}>
                                        {staff.first_name} {staff.last_name} ({staff.role})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                 file:rounded-lg file:border-0
                 file:text-sm file:font-semibold
                 file:bg-blue-50 file:text-blue-700
                 hover:file:bg-blue-100"
                            />


                            <button
                                onClick={handleUpload}
                                disabled={!selectedFile}
                                className={`px-5 py-2 rounded-lg text-white transition duration-150 ${
                                    selectedFile
                                        ? "bg-blue-600 hover:bg-blue-700"
                                        : "bg-gray-400 cursor-not-allowed"
                                }`}
                            >
                                Upload
                            </button>
                        </div>

                        {uploadStatus && (
                            <p className="mt-3 text-sm">
                                {uploadStatus.includes("successful") ? (
                                    <span className="text-green-600">{uploadStatus}</span>
                                ) : (
                                    <span className="text-red-600">{uploadStatus}</span>
                                )}
                            </p>
                        )}
                    </div>

                    <div className="mt-6 p-6 border rounded-xl bg-white shadow-md">
                        <h2 className="text-lg font-semibold mb-4">My Diagnoses</h2>

                        {diagnosedTests.length === 0 ? (
                            <p className="text-gray-600">No diagnoses available yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto border border-gray-200">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th className="text-left px-4 py-2 border">Staff Member</th>
                                        <th className="text-left px-4 py-2 border">Diagnosis</th>
                                        <th className="text-left px-4 py-2 border">Lab Test</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {diagnosedTests.map(test => (
                                        <tr key={test.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 border">{test.staff_name}</td>
                                            <td className="px-4 py-2 border">{test.diagnosis || "No diagnosis yet"}</td>
                                            <td className="px-4 py-2 border">
                                                {downloadLinks[test.id] ? (
                                                    <a
                                                        href={downloadLinks[test.id]}
                                                        download
                                                        className="text-blue-600 underline"
                                                    >
                                                        Download PDF
                                                    </a>
                                                ) : (
                                                    <button
                                                        onClick={async () => {
                                                            const url = await getDownloadLink(test.id);
                                                            if (url) {
                                                                setDownloadLinks((prev) => ({ ...prev, [test.id]: url }));
                                                            }
                                                        }}
                                                        className="text-blue-600 underline"
                                                    >
                                                        Get Download Link
                                                    </button>
                                                )}
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

export default Patient;
