import { useEffect, useState } from "react";

import {
    getSalesmen,
    getAttendanceBySalesman,
    checkInAttendance,
    checkOutAttendance,
    markAbsentAttendance,
} from "../services/api";


function Attendance() {

    const [salesmen, setSalesmen] = useState([]);
    const [attendance, setAttendance] = useState([]);

    const [salesmanId, setSalesmanId] = useState("");

    const [status, setStatus] = useState("Present");
    const [remarks, setRemarks] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // Load salesmen when page opens
    useEffect(() => {

        async function loadSalesmen() {

            try {

                const data = await getSalesmen();

                setSalesmen(data);

            } catch (error) {

                console.error(
                    "Failed to load salesmen:",
                    error
                );

                setError(error.message);

            }

        }

        loadSalesmen();

    }, []);


    // Find salesman
    function findSalesman() {

        return salesmen.find(
            (salesman) =>
                salesman.id === Number(salesmanId)
        );

    }


    // Search attendance
    async function handleSearch() {

        if (!salesmanId) {

            alert("Please enter Salesman ID");

            return;

        }


        const salesman = findSalesman();


        if (!salesman) {

            alert(
                `Salesman ID ${salesmanId} not found`
            );

            setAttendance([]);

            return;

        }


        try {

            setLoading(true);
            setError("");

            const data =
                await getAttendanceBySalesman(
                    Number(salesmanId)
                );

            setAttendance(data);

        } catch (error) {

            console.error(
                "Search attendance error:",
                error
            );

            setError(error.message);

        } finally {

            setLoading(false);

        }

    }


    // Check In
    async function handleCheckIn() {

        if (!salesmanId) {

            alert("Please enter Salesman ID");

            return;

        }


        const salesman = findSalesman();


        if (!salesman) {

            alert(
                `Salesman ID ${salesmanId} not found`
            );

            return;

        }


        try {

            setLoading(true);
            setError("");

            const newAttendance =
                await checkInAttendance({

                    salesman_id:
                        Number(salesmanId),

                    status: status,

                    remarks:
                        remarks || null,

                });


            setAttendance(
                [
                    newAttendance,
                    ...attendance,
                ]
            );


            alert(
                "Attendance checked in successfully"
            );


            setRemarks("");

        } catch (error) {

            console.error(
                "Check-in error:",
                error
            );

            alert(error.message);

        } finally {

            setLoading(false);

        }

    }


    // Check Out
    async function handleCheckOut() {

        if (!salesmanId) {

            alert("Please enter Salesman ID");

            return;

        }


        const salesman = findSalesman();


        if (!salesman) {

            alert(
                `Salesman ID ${salesmanId} not found`
            );

            return;

        }


        try {

            setLoading(true);
            setError("");

            const updatedAttendance =
                await checkOutAttendance(
                    Number(salesmanId)
                );


            setAttendance(
                attendance.map(
                    (record) =>

                        record.id ===
                        updatedAttendance.id

                            ? updatedAttendance

                            : record
                )
            );


            alert(
                "Attendance checked out successfully"
            );

        } catch (error) {

            console.error(
                "Check-out error:",
                error
            );

            alert(error.message);

        } finally {

            setLoading(false);

        }

    }


    // Mark Absent
    async function handleAbsent() {

        if (!salesmanId) {

            alert("Please enter Salesman ID");

            return;

        }


        const salesman = findSalesman();


        if (!salesman) {

            alert(
                `Salesman ID ${salesmanId} not found`
            );

            return;

        }


        const confirmed =
            window.confirm(
                `Mark salesman ${salesmanId} as absent today?`
            );


        if (!confirmed) {

            return;

        }


        try {

            setLoading(true);
            setError("");

            const absentAttendance =
                await markAbsentAttendance(
                    Number(salesmanId)
                );


            setAttendance(
                [
                    absentAttendance,
                    ...attendance,
                ]
            );


            alert(
                "Salesman marked absent successfully"
            );


            setRemarks("");

        } catch (error) {

            console.error(
                "Mark absent error:",
                error
            );

            alert(error.message);

        } finally {

            setLoading(false);

        }

    }


    // Get salesman name
    function getSalesmanName(id) {

        const salesman =
            salesmen.find(
                (salesman) =>
                    salesman.id === id
            );


        return salesman
            ? salesman.name
            : "Unknown";

    }


    return (

        <div>

            <h1>
                Attendance Management
            </h1>


            <h2>
                Salesman
            </h2>


            {/* Salesman Search */}

            <div>

                <label>
                    Salesman ID:
                </label>

                {" "}

                <input
                    type="number"
                    value={salesmanId}
                    onChange={(event) => {

                        setSalesmanId(
                            event.target.value
                        );

                        setError("");

                    }}
                />

                {" "}

                <button
                    onClick={handleSearch}
                    disabled={loading}
                >
                    Search
                </button>

            </div>


            <br />


            {/* Status */}

            <div>

                <label>
                    Status:
                </label>

                {" "}

                <select
                    value={status}
                    onChange={(event) =>
                        setStatus(
                            event.target.value
                        )
                    }
                >

                    <option value="Present">
                        Present
                    </option>

                    <option value="Late">
                        Late
                    </option>

                    <option value="Absent">
                        Absent
                    </option>

                </select>

            </div>


            <br />


            {/* Remarks */}

            <div>

                <label>
                    Remarks:
                </label>

                {" "}

                <input
                    type="text"
                    value={remarks}
                    onChange={(event) =>
                        setRemarks(
                            event.target.value
                        )
                    }
                    placeholder="Optional"
                />

            </div>


            <br />


            {/* Buttons */}

            {status === "Absent" ? (

                <button
                    onClick={handleAbsent}
                    disabled={loading}
                >
                    Mark Absent
                </button>

            ) : (

                <>

                    <button
                        onClick={handleCheckIn}
                        disabled={loading}
                    >
                        Check In
                    </button>

                    {" "}

                    <button
                        onClick={handleCheckOut}
                        disabled={loading}
                    >
                        Check Out
                    </button>

                </>

            )}


            <hr />


            {/* Error */}

            {error && (

                <p>
                    {error}
                </p>

            )}


            {/* Loading */}

            {loading && (

                <p>
                    Processing...
                </p>

            )}


            {/* Attendance */}

            <h2>
                Attendance Records
            </h2>


            <table
                border="1"
                cellPadding="10"
            >

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Salesman ID</th>

                        <th>Salesman Name</th>

                        <th>Date</th>

                        <th>Check In</th>

                        <th>Check Out</th>

                        <th>Status</th>

                        <th>Remarks</th>

                    </tr>

                </thead>


                <tbody>

                    {attendance.length === 0 ? (

                        <tr>

                            <td colSpan="8">
                                No attendance records found
                            </td>

                        </tr>

                    ) : (

                        attendance.map(
                            (record) => (

                                <tr
                                    key={record.id}
                                >

                                    <td>
                                        {record.id}
                                    </td>

                                    <td>
                                        {record.salesman_id}
                                    </td>

                                    <td>
                                        {getSalesmanName(
                                            record.salesman_id
                                        )}
                                    </td>

                                    <td>
                                        {record.attendance_date}
                                    </td>

                                    <td>
                                        {record.check_in || "-"}
                                    </td>

                                    <td>
                                        {record.check_out || "-"}
                                    </td>

                                    <td>
                                        {record.status}
                                    </td>

                                    <td>
                                        {record.remarks || "-"}
                                    </td>

                                </tr>

                            )
                        )

                    )}

                </tbody>

            </table>

        </div>

    );

}


export default Attendance;