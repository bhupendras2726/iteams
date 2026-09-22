import { useEffect, useState } from "react";

import {
    getLeaveRecordsBySalesman,
    getSalesmen,
    createLeaveRecord,
    updateLeaveRecord,
    deleteLeaveRecord,
} from "../services/api";


function LeaveManagement() {

    const [leaves, setLeaves] = useState([]);
    const [salesmen, setSalesmen] = useState([]);

    const [salesmanId, setSalesmanId] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        leave_date: "",
        leave_type: "",
        status: "Pending",
        reason: "",
    });


    // Load salesmen
    useEffect(() => {

        async function loadSalesmen() {

            try {

                const data = await getSalesmen();

                setSalesmen(data);

            } catch (error) {

                setError(error.message);

            }

        }

        loadSalesmen();

    }, []);


    // Get leaves for selected salesman
    async function handleSearch() {

        if (!salesmanId) {
            alert("Please enter Salesman ID");
            return;
        }

        const salesman = salesmen.find(
            (salesman) =>
                salesman.id === Number(salesmanId)
        );

        if (!salesman) {
            alert(
                `Salesman ID ${salesmanId} not found`
            );

            setLeaves([]);

            return;
        }

        try {

            setLoading(true);
            setError("");

            const data =
                await getLeaveRecordsBySalesman(
                    salesmanId
                );

            setLeaves(data);

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);

        }
    }


    function handleChange(event) {

        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });

    }


    function handleEdit(leave) {

        setEditingId(leave.id);

        setSalesmanId(leave.salesman_id);

        setFormData({

            leave_date: leave.leave_date,

            leave_type: leave.leave_type,

            status: leave.status,

            reason: leave.reason || "",

        });

    }


    function handleCancel() {

        setEditingId(null);

        setFormData({

            leave_date: "",
            leave_type: "",
            status: "Pending",
            reason: "",

        });

    }


    async function handleSubmit(event) {

        event.preventDefault();

        if (!salesmanId) {

            alert("Please enter Salesman ID");

            return;

        }

        try {

            const leaveData = {

                salesman_id: Number(salesmanId),

                leave_date: formData.leave_date,

                leave_type: formData.leave_type,

                status: formData.status,

                reason: formData.reason || null,

            };


            if (editingId === null) {

                const newLeave =
                    await createLeaveRecord(
                        leaveData
                    );

                setLeaves([
                    ...leaves,
                    newLeave,
                ]);

                alert(
                    "Leave record added successfully"
                );

            } else {

                const updatedLeave =
                    await updateLeaveRecord(
                        editingId,
                        leaveData
                    );

                setLeaves(
                    leaves.map((leave) =>
                        leave.id === editingId
                            ? updatedLeave
                            : leave
                    )
                );

                alert(
                    "Leave record updated successfully"
                );

            }

            handleCancel();

        } catch (error) {

            alert(error.message);

        }

    }


    async function handleDelete(leaveId) {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this leave record?"
            );

        if (!confirmed) {

            return;

        }

        try {

            await deleteLeaveRecord(leaveId);

            setLeaves(
                leaves.filter(
                    (leave) =>
                        leave.id !== leaveId
                )
            );

            alert(
                "Leave record deleted successfully"
            );

        } catch (error) {

            alert(error.message);

        }

    }


    function getSalesmanName(salesmanId) {

        const salesman =
            salesmen.find(
                (salesman) =>
                    salesman.id === salesmanId
            );

        return salesman
            ? salesman.name
            : "Unknown";

    }


    return (

        <div>

            <h1>Leave Management</h1>


            {/* Salesman Search */}

            <h2>Search Leave Records</h2>

            <div>

                <label>
                    Salesman ID:
                </label>

                {" "}

                <input
                    type="number"
                    value={salesmanId}
                    onChange={(event) =>
                        setSalesmanId(
                            event.target.value
                        )
                    }
                />

                {" "}

                <button
                    onClick={handleSearch}
                >
                    Search
                </button>

            </div>


            <hr />


            {/* Leave Form */}

            <h2>
                {editingId === null
                    ? "Add Leave"
                    : "Edit Leave"}
            </h2>


            <form onSubmit={handleSubmit}>

                <div>

                    <label>
                        Leave Date:
                    </label>

                    {" "}

                    <input
                        type="date"
                        name="leave_date"
                        value={
                            formData.leave_date
                        }
                        onChange={handleChange}
                        required
                    />

                </div>


                <br />


                <div>

                    <label>
                        Leave Type:
                    </label>

                    {" "}

                    <input
                        type="text"
                        name="leave_type"
                        value={
                            formData.leave_type
                        }
                        onChange={handleChange}
                        placeholder="Sick"
                        required
                    />

                </div>


                <br />


                <div>

                    <label>
                        Status:
                    </label>

                    {" "}

                    <select
                        name="status"
                        value={
                            formData.status
                        }
                        onChange={handleChange}
                    >

                        <option value="Pending">
                            Pending
                        </option>

                        <option value="Approved">
                            Approved
                        </option>

                        <option value="Rejected">
                            Rejected
                        </option>

                    </select>

                </div>


                <br />


                <div>

                    <label>
                        Reason:
                    </label>

                    {" "}

                    <input
                        type="text"
                        name="reason"
                        value={
                            formData.reason
                        }
                        onChange={handleChange}
                        placeholder="Personal work"
                    />

                </div>


                <br />


                <button type="submit">

                    {editingId === null
                        ? "Add Leave"
                        : "Update Leave"}

                </button>


                {" "}


                {editingId !== null && (

                    <button
                        type="button"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>

                )}

            </form>


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
                    Loading leave records...
                </p>

            )}


            {/* Leave Table */}

            <h2>
                Leave Records
            </h2>


            <table
                border="1"
                cellPadding="10"
            >

                <thead>

                    <tr>

                        <th>
                            ID
                        </th>

                        <th>
                            Salesman ID
                        </th>

                        <th>
                            Salesman Name
                        </th>

                        <th>
                            Leave Date
                        </th>

                        <th>
                            Leave Type
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Reason
                        </th>

                        <th>
                            Action
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {leaves.map((leave) => (

                        <tr key={leave.id}>

                            <td>
                                {leave.id}
                            </td>

                            <td>
                                {leave.salesman_id}
                            </td>

                            <td>
                                {getSalesmanName(
                                    leave.salesman_id
                                )}
                            </td>

                            <td>
                                {leave.leave_date}
                            </td>

                            <td>
                                {leave.leave_type}
                            </td>

                            <td>
                                {leave.status}
                            </td>

                            <td>
                                {leave.reason}
                            </td>

                            <td>

                                <button
                                    onClick={() =>
                                        handleEdit(
                                            leave
                                        )
                                    }
                                >
                                    Edit
                                </button>

                                {" "}

                                <button
                                    onClick={() =>
                                        handleDelete(
                                            leave.id
                                        )
                                    }
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );
}


export default LeaveManagement;