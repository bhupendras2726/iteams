import { useEffect, useState } from "react";

import {
    createSalesman,
    getSalesmen,
    updateSalesman,
    deleteSalesman,
} from "../services/api";

function Salesmen() {
    const [salesmen, setSalesmen] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        territory: "",
        password: "",
        is_active: true,
    });

    // Get salesmen
    useEffect(() => {
        async function loadSalesmen() {
            try {
                const data = await getSalesmen();
                setSalesmen(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        loadSalesmen();
    }, []);

    // Handle input changes
    function handleChange(event) {
        const { name, value, type, checked } = event.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    }

    // Edit salesman
    function handleEdit(salesman) {
        setEditingId(salesman.id);

        setFormData({
            name: salesman.name,
            phone: salesman.phone,
            email: salesman.email,
            address: salesman.address,
            territory: salesman.territory,
            password: "",
            is_active: salesman.is_active,
        });
    }

    // Delete salesman
    async function handleDelete(salesmanId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this salesman?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteSalesman(salesmanId);

            setSalesmen(
                salesmen.filter(
                    (salesman) => salesman.id !== salesmanId
                )
            );

            alert("Salesman deleted successfully");

        } catch (error) {
            alert(error.message);
        }
    }

    // Submit form
    async function handleSubmit(event) {
        event.preventDefault();

        try {
            // CREATE
            if (editingId === null) {
                const newSalesman = await createSalesman(formData);

                setSalesmen([...salesmen, newSalesman]);

                alert("Salesman created successfully");
            }

            // UPDATE
            else {
                const updatedSalesman = await updateSalesman(
                    editingId,
                    formData
                );

                setSalesmen(
                    salesmen.map((salesman) =>
                        salesman.id === editingId
                            ? updatedSalesman
                            : salesman
                    )
                );

                alert("Salesman updated successfully");
            }

            // Reset form
            setFormData({
                name: "",
                phone: "",
                email: "",
                address: "",
                territory: "",
                password: "",
                is_active: true,
            });

            setEditingId(null);

        } catch (error) {
            alert(error.message);
        }
    }

    // Cancel edit
    function handleCancel() {
        setFormData({
            name: "",
            phone: "",
            email: "",
            address: "",
            territory: "",
            password: "",
            is_active: true,
        });

        setEditingId(null);
    }

    if (loading) {
        return <p>Loading salesmen...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Salesmen</h1>

            {/* Add / Edit Form */}

            <h2>
                {editingId === null
                    ? "Add Salesman"
                    : "Edit Salesman"}
            </h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name: </label>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <div>
                    <label>Phone: </label>

                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <div>
                    <label>Email: </label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <div>
                    <label>Address: </label>

                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <div>
                    <label>Territory: </label>

                    <input
                        type="text"
                        name="territory"
                        value={formData.territory}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <div>
                    <label>Password: </label>

                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                        />

                        {" "}Active
                    </label>
                </div>

                <br />

                <button type="submit">
                    {editingId === null
                        ? "Add Salesman"
                        : "Update Salesman"}
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

            {/* Salesman Table */}

            <h2>Salesman List</h2>

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Territory</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {salesmen.map((salesman) => (
                        <tr key={salesman.id}>
                            <td>{salesman.id}</td>

                            <td>{salesman.name}</td>

                            <td>{salesman.phone}</td>

                            <td>{salesman.email}</td>

                            <td>{salesman.territory}</td>

                            <td>
                                {salesman.is_active
                                    ? "Active"
                                    : "Inactive"}
                            </td>

                            <td>
                                <button
                                    onClick={() =>
                                        handleEdit(salesman)
                                    }
                                >
                                    Edit
                                </button>

                                {" "}

                                <button
                                    onClick={() =>
                                        handleDelete(salesman.id)
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

export default Salesmen;