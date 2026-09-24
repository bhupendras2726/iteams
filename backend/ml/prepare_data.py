import pandas as pd

import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import engine


query = """
WITH attendance_monthly AS (
    SELECT
        salesman_id,
        TO_CHAR(attendance_date, 'YYYY-MM') AS month,
        COUNT(*) FILTER (WHERE status = 'Present') AS present_days,
        COUNT(*) FILTER (WHERE status = 'Late') AS late_days,
        COUNT(*) FILTER (WHERE status = 'Absent') AS absent_days
    FROM attendance
    WHERE salesman_id BETWEEN 1001 AND 2000
    GROUP BY salesman_id, TO_CHAR(attendance_date, 'YYYY-MM')
),

leave_monthly AS (
    SELECT
        salesman_id,
        TO_CHAR(leave_date, 'YYYY-MM') AS month,
        COUNT(DISTINCT leave_date)
            FILTER (WHERE status = 'Approved') AS approved_leave_days
    FROM leave_records
    WHERE salesman_id BETWEEN 1001 AND 2000
    GROUP BY salesman_id, TO_CHAR(leave_date, 'YYYY-MM')
),

performance_monthly AS (
    SELECT
        salesman_id,
        period AS month,
        target,
        achievement,

        LAG(achievement) OVER (
            PARTITION BY salesman_id
            ORDER BY period
        ) AS previous_month_achievement

    FROM sales_performance
    WHERE salesman_id BETWEEN 1001 AND 2000
)

SELECT
    p.salesman_id,
    s.territory,
    p.month,
    p.target,
    p.previous_month_achievement,

    COALESCE(a.present_days, 0) AS present_days,
    COALESCE(a.late_days, 0) AS late_days,
    COALESCE(a.absent_days, 0) AS absent_days,

    COALESCE(l.approved_leave_days, 0) AS approved_leave_days,

    p.achievement

FROM performance_monthly p

JOIN salesmen s
    ON s.id = p.salesman_id

LEFT JOIN attendance_monthly a
    ON a.salesman_id = p.salesman_id
    AND a.month = p.month

LEFT JOIN leave_monthly l
    ON l.salesman_id = p.salesman_id
    AND l.month = p.month

ORDER BY p.salesman_id, p.month;
"""


# Read data from PostgreSQL
df = pd.read_sql(query, engine)


# Basic information
print("Data loaded successfully!")
print("Shape:", df.shape)

print("\nFirst 5 rows:")
print(df.head())

print("\nColumn names:")
print(df.columns.tolist())

print("\nData types:")
print(df.dtypes)

print("\nMissing values:")
print(df.isnull().sum())