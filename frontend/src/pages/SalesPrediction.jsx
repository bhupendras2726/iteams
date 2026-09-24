
import { useState } from "react";

function SalesPrediction() {
    const [salesmanId, setSalesmanId] = useState("");
    const [month, setMonth] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePrediction = async () => {
        // Clear previous messages
        setError("");
        setResult(null);

        // Basic validation
        if (!salesmanId || !month) {
            setError("Please enter Salesman ID and Month.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `http://127.0.0.1:8000/ml/predict/${salesmanId}?month=${month}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.detail || data.message || "Prediction failed."
                );
                return;
            }

            setResult(data);

        } catch (error) {
            setError(
                "Unable to connect to the FastAPI server."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "30px" }}>
            <h1>Sales Achievement Prediction</h1>

            {/* -------------------------------- */}
            {/* Input Section */}
            {/* -------------------------------- */}

            <div>
                <label>
                    Salesman ID:
                </label>

                <br />

                <input
                    type="number"
                    value={salesmanId}
                    onChange={(e) =>
                        setSalesmanId(e.target.value)
                    }
                    placeholder="Enter Salesman ID"
                />
            </div>

            <br />

            <div>
                <label>
                    Month:
                </label>

                <br />


                <input
                    type="month"
                    min="2025-01"
                    max="2025-12"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                />


            </div>

            <br />

            {/* -------------------------------- */}
            {/* Prediction Button */}
            {/* -------------------------------- */}

            <button
                onClick={handlePrediction}
                disabled={loading}
            >
                {loading
                    ? "Predicting..."
                    : "Predict Achievement"}
            </button>

            {/* -------------------------------- */}
            {/* Error */}
            {/* -------------------------------- */}

            {error && (
                <p>
                    <strong>Error:</strong> {error}
                </p>
            )}

            {/* -------------------------------- */}
            {/* Result */}
            {/* -------------------------------- */}

            {result && (
                <div style={{ marginTop: "30px" }}>

                    <h2>Prediction Result</h2>

                    <p>
                        <strong>Salesman ID:</strong>{" "}
                        {result.salesman_id}
                    </p>

                    <p>
                        <strong>Month:</strong>{" "}
                        {result.month}
                    </p>

                    <p>
                        <strong>Target:</strong>{" "}
                        ₹{result.target.toLocaleString()}
                    </p>

                    <hr />

                    <h3>Attendance</h3>

                    <p>
                        <strong>Present Days:</strong>{" "}
                        {result.present_days}
                    </p>

                    <p>
                        <strong>Late Days:</strong>{" "}
                        {result.late_days}
                    </p>

                    <p>
                        <strong>Absent Days:</strong>{" "}
                        {result.absent_days}
                    </p>

                    <p>
                        <strong>Approved Leave Days:</strong>{" "}
                        {result.approved_leave_days}
                    </p>

                    <hr />

                    <h3>Achievement</h3>

                    <p>
                        <strong>Actual Achievement:</strong>{" "}
                        ₹
                        {result.actual_achievement.toLocaleString()}
                    </p>

                    <p>
                        <strong>Predicted Achievement:</strong>{" "}
                        ₹
                        {result.predicted_achievement.toLocaleString()}
                    </p>

                    <p>
                        <strong>Difference:</strong>{" "}
                        ₹
                        {result.difference.toLocaleString()}
                    </p>

                </div>
            )}
        </div>
    );
}

export default SalesPrediction;

