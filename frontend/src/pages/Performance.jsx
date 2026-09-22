import { useEffect, useState } from "react";

import {
    getPerformance,
    getSalesmen,
    createPerformance,
    updatePerformance,
    deletePerformance,
} from "../services/api";

function Performance() {
    const [performance, setPerformance] = useState([]);
    const [salesmen, setSalesmen] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        salesman_id: "",
        period: "",
        target: "",
        achievement: "",
    });

    useEffect(() => {
        async function loadData() {
            try {
                const performanceData = await getPerformance();
                const salesmenData = await getSalesmen();

                setPerformance(performanceData);
                setSalesmen(salesmenData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    }

    function handleEdit(record) {
        setEditingId(record.id);

        setFormData({
            salesman_id: record.salesman_id,
            period: record.period,
            target: record.target,
            achievement: record.achievement,
        });
    }

    function handleCancel() {
        setEditingId(null);

        setFormData({
            salesman_id: "",
            period: "",
            target: "",
            achievement: "",
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const duplicate = performance.some(
            (record) =>
                record.salesman_id === Number(formData.salesman_id) &&
                record.period === formData.period
        );

        if (duplicate && editingId === null) {
            alert(
                "Performance already exists for this salesman and period"
            );
            return;
        }

        try {
            const performanceData = {
                salesman_id: Number(formData.salesman_id),
                period: formData.period,
                target: Number(formData.target),
                achievement: Number(formData.achievement),
            };

            if (editingId === null) {
                const newPerformance =
                    await createPerformance(performanceData);

                setPerformance([
                    ...performance,
                    newPerformance,
                ]);

                alert("Performance added successfully");
            } else {
                const updatedPerformance =
                    await updatePerformance(
                        editingId,
                        performanceData
                    );

                setPerformance(
                    performance.map((record) =>
                        record.id === editingId
                            ? updatedPerformance
                            : record
                    )
                );

                alert("Performance updated successfully");
            }

            handleCancel();

        } catch (error) {
            alert(error.message);
        }
    }

    async function handleDelete(performanceId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this performance?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deletePerformance(performanceId);

            setPerformance(
                performance.filter(
                    (record) => record.id !== performanceId
                )
            );

            alert("Performance deleted successfully");

        } catch (error) {
            alert(error.message);
        }
    }

    function getSalesmanName(salesmanId) {
        const salesman = salesmen.find(
            (salesman) => salesman.id === salesmanId
        );

        return salesman ? salesman.name : "Unknown";
    }

    if (loading) {
        return <p>Loading performance...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Sales Performance</h1>

            <h2>
                {editingId === null
                    ? "Add Performance"
                    : "Edit Performance"}
            </h2>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Salesman ID: </label>

                    <input
                        type="number"
                        name="salesman_id"
                        value={formData.salesman_id}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Period: </label>

                    <input
                        type="text"
                        name="period"
                        value={formData.period}
                        onChange={handleChange}
                        placeholder="2026-09"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Target: </label>

                    <input
                        type="number"
                        name="target"
                        value={formData.target}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Achievement: </label>

                    <input
                        type="number"
                        name="achievement"
                        value={formData.achievement}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br />

                <button type="submit">
                    {editingId === null
                        ? "Add Performance"
                        : "Update Performance"}
                </button>

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

            <h2>Performance List</h2>

            <table border="1" cellPadding="10">

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Salesman ID</th>
                        <th>Salesman Name</th>
                        <th>Period</th>
                        <th>Target</th>
                        <th>Achievement</th>
                        <th>Created At</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>

                    {performance.map((record) => (
                        <tr key={record.id}>

                            <td>{record.id}</td>

                            <td>
                                {record.salesman_id}
                            </td>

                            <td>
                                {getSalesmanName(
                                    record.salesman_id
                                )}
                            </td>

                            <td>
                                {record.period}
                            </td>

                            <td>
                                {record.target}
                            </td>

                            <td>
                                {record.achievement}
                            </td>

                            <td>
                                {record.created_at}
                            </td>

                            <td>
                                <button
                                    onClick={() =>
                                        handleEdit(record)
                                    }
                                >
                                    Edit
                                </button>

                                {" "}

                                <button
                                    onClick={() =>
                                        handleDelete(record.id)
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

export default Performance;