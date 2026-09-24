const API_URL = "http://127.0.0.1:8000";


// ============================================================
// SALESMEN
// ============================================================

export async function getSalesmen() {
    const response = await fetch(`${API_URL}/salesmen`);

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.detail || "Failed to fetch salesmen"
        );
    }

    return response.json();
}


export async function getSalesmanById(salesmanId) {
    const response = await fetch(
        `${API_URL}/salesmen/${salesmanId}`
    );

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.detail || "Failed to fetch salesman"
        );
    }

    return response.json();
}


export async function createSalesman(salesmanData) {
    const response = await fetch(
        `${API_URL}/salesmen`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(salesmanData),
        }
    );

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.detail || "Failed to create salesman"
        );
    }

    return response.json();
}


export async function updateSalesman(
    salesmanId,
    salesmanData
) {
    const response = await fetch(
        `${API_URL}/salesmen/${salesmanId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(salesmanData),
        }
    );

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.detail || "Failed to update salesman"
        );
    }

    return response.json();
}


export async function deleteSalesman(salesmanId) {
    const response = await fetch(
        `${API_URL}/salesmen/${salesmanId}`,
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.detail || "Failed to delete salesman"
        );
    }
}


// ============================================================
// SALES PERFORMANCE
// ============================================================

export async function getPerformance() {
    const response = await fetch(
        `${API_URL}/sales-performance`
    );

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.detail ||
            "Failed to fetch performance records"
        );
    }

    return response.json();
}


export async function createPerformance(
    performanceData
) {
    const response = await fetch(
        `${API_URL}/sales-performance`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(performanceData),
        }
    );

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.detail ||
            "Failed to create performance"
        );
    }

    return response.json();
}


export async function updatePerformance(
    performanceId,
    performanceData
) {
    const response = await fetch(
        `${API_URL}/sales-performance/${performanceId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(performanceData),
        }
    );

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.detail ||
            "Failed to update performance"
        );
    }

    return response.json();
}


export async function deletePerformance(
    performanceId
) {
    const response = await fetch(
        `${API_URL}/sales-performance/${performanceId}`,
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.detail ||
            "Failed to delete performance"
        );
    }
}


export async function getPerformanceSummary(
    salesmanId
) {
    const response = await fetch(
        `${API_URL}/salesmen/${salesmanId}/performance-summary`
    );

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.detail ||
            "Failed to fetch performance summary"
        );
    }

    return response.json();
}


// ============================================================
// LEAVE MANAGEMENT
// ============================================================

export async function getLeaveRecords() {
    const response = await fetch(
        `${API_URL}/leave-records`
    );

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.detail ||
            "Failed to fetch leave records"
        );
    }

    return response.json();
}


export async function getLeaveRecordsBySalesman(
    salesmanId
) {
    const response = await fetch(
        `${API_URL}/salesmen/${salesmanId}/leave-records`
    );

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.detail ||
            "Failed to fetch leave records"
        );
    }

    return response.json();
}


export async function createLeaveRecord(
    leaveData
) {
    const response = await fetch(
        `${API_URL}/leave-records`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(leaveData),
        }
    );

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.detail ||
            "Failed to create leave record"
        );
    }

    return response.json();
}


export async function updateLeaveRecord(
    leaveId,
    leaveData
) {
    const response = await fetch(
        `${API_URL}/leave-records/${leaveId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(leaveData),
        }
    );

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.detail ||
            "Failed to update leave record"
        );
    }

    return response.json();
}


export async function deleteLeaveRecord(
    leaveId
) {
    const response = await fetch(
        `${API_URL}/leave-records/${leaveId}`,
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.detail ||
            "Failed to delete leave record"
        );
    }
}


// ============================================================
// ATTENDANCE
// ============================================================

export async function checkInAttendance(
    attendanceData
) {
    const response = await fetch(
        `${API_URL}/attendance/check-in`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(attendanceData),
        }
    );

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.detail ||
            "Failed to check in"
        );
    }

    return response.json();
}


export async function checkOutAttendance(
    salesmanId
) {
    const response = await fetch(
        `${API_URL}/attendance/check-out`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                salesman_id: Number(salesmanId),
            }),
        }
    );

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.detail ||
            "Failed to check out"
        );
    }

    return response.json();
}


export async function markAbsentAttendance(
    salesmanId
) {
    const response = await fetch(
        `${API_URL}/attendance/mark-absent`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                salesman_id: Number(salesmanId),
            }),
        }
    );

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.detail ||
            "Failed to mark absent"
        );
    }

    return response.json();
}


export async function getAttendanceBySalesman(
    salesmanId
) {
    const response = await fetch(
        `${API_URL}/salesmen/${salesmanId}/attendance`
    );

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.detail ||
            "Failed to fetch attendance"
        );
    }

    return response.json();
}

